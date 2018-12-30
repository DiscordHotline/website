import * as bodyParser from 'body-parser';
import * as ConnectDynamo from 'connect-dynamodb';
import * as session from 'express-session';
import {Container} from 'inversify';
import {InversifyExpressServer} from 'inversify-express-utils';
import * as morgan from 'morgan';
import {Server} from 'next';
import * as passport from 'passport';
import {Strategy as OAuth2Strategy} from 'passport-oauth2';
import * as request from 'request';
import {Connection, createConnection} from 'typeorm';
import {createLogger, format, Logger, transports} from 'winston';

import Types from './types';
import {Config, Vault} from './Vault';

export default async (app: Server) => {
    const container: Container = new Container({defaultScope: 'Singleton'});
    const server               = new InversifyExpressServer(container);
    const DynamoDBStore = ConnectDynamo({session});
    const store         = new DynamoDBStore({table: process.env.SESSION_TABLE});
    const url           = process.env.IS_OFFLINE ? 'http://localhost:3000' : 'https://apply.hotline.gg';
    server.setConfig((_app) => {
        _app.use(bodyParser.urlencoded({extended: true}))
           .use(bodyParser.json())
           .use(morgan('dev'))
           .use((req, res, nextReq) => {
               if (process.env.NODE_ENV === 'production') {
                   if (req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https') {
                       return nextReq();
                   }

                   return res.redirect('https://' + req.hostname + req.originalUrl);
               }
           });

        const cookie: { maxAge: number, domain?: string, secure?: boolean } = {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            secure: undefined,
        };
        if (process.env.NODE_ENV === 'production') {
            cookie.domain = 'www.hotline.gg';
            cookie.secure = true;
            _app.set('trust proxy', 1);
        }

        _app.use(session({
            secret:            '9a7sd79asrh99a9',
            saveUninitialized: true,
            resave:            false,
            rolling:           true,
            cookie,
            store,
        }));

        _app.use(passport.initialize());
        _app.use(passport.session());
    });

    // Logger
    container.bind<Logger>(Types.logger).toDynamicValue(() => createLogger({
        level:      process.env.DEBUG || false ? 'debug' : 'info',
        format:     format.combine(
            format.splat(),
            format.colorize(),
            format.timestamp(),
            format.align(),
            format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
        ),
        transports: [
            new transports.Console(),
        ],
    }));

    // Vault
    container.bind<Config>(Types.vault.config).toConstantValue({
        vaultFile: process.env.VAULT_FILE,
        address:   process.env.VAULT_ADDR,
        rootToken: process.env.VAULT_TOKEN,
        roleId:    process.env.VAULT_ROLE_ID,
        secretId:  process.env.VAULT_SECRET_ID,
    });
    container.bind<Vault>(Types.vault.client).to(Vault);
    const vault = container.get<Vault>(Types.vault.client);
    await vault.initialize();

    container.bind<Server>(Types.next.app).toConstantValue(app);
    container.bind(Types.next.handler).toFunction(app.getRequestHandler);
    await import('./Controller');

    // Database/TypeORM
    const connection = await createConnection({
        synchronize:       true,
        host:              await vault.getSecret('database', 'host'),
        database:          await vault.getSecret('api/database', 'name'),
        port:              3306,
        username:          await vault.getSecret('api/database', 'user'),
        password:          await vault.getSecret('api/database', 'password'),
        type:              'mysql',
        supportBigNumbers: true,
        logger:            this.logger,
        bigNumberStrings:  true,
        entities:          [],
    });
    container.bind<Connection>(Types.database).toConstantValue(connection);

    const expressApp = server.build();

    const baseUrl  = `https://discordapp.com/api`;
    const authType = `discord`;
    // Passport Initialization
    passport.use(authType, new OAuth2Strategy(
        {
            authorizationURL: `${baseUrl}/oauth2/authorize`,
            tokenURL:         `${baseUrl}/oauth2/token`,
            clientID:         await vault.getSecret('discord', 'client_id'),
            clientSecret:     await vault.getSecret('discord', 'secret'),
            callbackURL:      url + '/connect/callback',
        },
        function(accessToken, refreshToken, empty, cb) {
            request.get(
                `${baseUrl}/users/@me`, {
                    headers: {
                        Authorization: 'Bearer ' + accessToken,
                    },
                },
                function(err, response, body) {
                    if (err) {
                        console.error(err);

                        return cb(err);
                    }

                    const profile        = JSON.parse(body);
                    profile.accessToken  = accessToken;
                    profile.refreshToken = refreshToken;

                    cb(undefined, profile);
                },
            );
        },
    ));

    expressApp.get(`/connect`, (req, res, next) => {
        const scope = ['identify', ...req.query.scopes ? req.query.scopes.split(',') : []];

        return passport.authenticate(authType, {scope})(req, res, next);
    });
    expressApp.get(
        `/connect/callback`,
        (req: any, res: any) => passport.authenticate(authType, (err, user) => {
            if (err) {
                console.error(err);

                return res.statusCode(500).send(err.message);
            }

            req.logIn(user, (error) => {
                if (error) {
                    console.error(error);

                    return res.statusCode(500).send(error.message);
                }
                const redirect = req.session.lastUrl || url;
                delete req.session.lastUrl;

                res.redirect(redirect);
            });
        })(req, res),
    );

    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));
    expressApp.get('*', app.getRequestHandler() as any);

    return expressApp;
};
