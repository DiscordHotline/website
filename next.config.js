const withImages              = require('next-images');
const withCss                 = require('@zeit/next-css');
const withSass                = require('@zeit/next-sass');
const withSourceMaps          = require('@zeit/next-source-maps');
const withTypescript          = require('@zeit/next-typescript');
const withBundleAnalyzer      = require('@zeit/next-bundle-analyzer');

// Define the class
class FilterPlugin {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        compiler.hooks.afterEmit.tap(
            'FilterPlugin',
            (compilation) => {
                compilation.warnings = (
                    compilation.warnings
                ).filter(
                    warning => !this.options.filter.test(warning.message),
                );
            },
        );
    }
}

const isProd = process.env.NODE_ENV === 'production';
const ident  = isProd ? '[hash:base64:5]_[local]' : '[name]_[local]';

const config = withBundleAnalyzer(withTypescript(withSourceMaps(withImages(withCss(withSass(
    {
        analyzeServer:        ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
        analyzeBrowser:       ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
        bundleAnalyzerConfig: {
            server:  {
                analyzerMode:   'static',
                reportFilename: '../bundles/server.html',
            },
            browser: {
                analyzerMode:   'static',
                reportFilename: '../bundles/client.html',
            },
        },
        cssModules:           true,
        cssLoaderOptions:     {
            importLoaders:  1,
            camelCase:      true,
            localIdentName: 'style_' + ident,
        },
        publicRuntimeConfig:  {
            noCache:    !isProd,
            production: isProd,
            algolia:    {
                app_id:  process.env.ALGOLIA_APP_ID,
                api_key: process.env.ALGOLIA_API_KEY,
            },
            sentry:     {
                dsn: process.env.SENTRY_DSN,
            },
            api:        {
                url: process.env.API_URL,
            },
            chargebee:  {
                site: process.env.CHARGEBEE_SITE,
            },
        },
        workboxOpts:          {
            globPatterns:   ['static/**/*'],
            globDirectory:  '.',
            runtimeCaching: [
                {urlPattern: /^https:\/\/discordservers\.com\/?.*/, handler: 'staleWhileRevalidate'},
            ],
        },
        assetPrefix:          isProd ? 'https://assets.discordservers.com' : '',
        workerLoaderOptions:  {inline: true, fallback: false, publicPath: '/'},
        webpack(config, options) {
            config.plugins.push(
                new FilterPlugin({filter: /chunk styles \[mini-css-extract-plugin]\nConflicting order between:/}),
            );

            config.node    = {fs: 'empty', net: 'empty', tls: 'empty', console: true, module: 'empty'};
            config.resolve = {extensions: ['.ts', '.tsx', '.js']};

            // Necessary for file changes inside the bind mount to get picked up
            config.watchOptions = {aggregateTimeout: 300, poll: 1000};

            return config;
        },
    },
))))));

module.exports = (phase) => {
    return config;
};
