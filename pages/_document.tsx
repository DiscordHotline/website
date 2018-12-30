import {readFileSync} from 'fs';
import memoize from 'lodash/memoize';
import Document, {Head, Main, NextScript} from 'next/document';
import {resolve} from 'path';
import React from 'react';

const doGetContent = (file) => readFileSync(resolve(process.cwd(), file), 'utf8');
const getContent = process.env.NODE_ENV === 'production' ? memoize(doGetContent) : doGetContent;
const fontAwesomeStyle = getContent(resolve(
    'node_modules',
    '@fortawesome',
    'fontawesome-svg-core',
    'styles.css',
));

export default class extends Document {
    public render() {
        // noinspection TsLint
        return (
            <html lang="en">
                <Head>
                    <style key="fonts">{fontAwesomeStyle}</style>
                </Head>
                <body>
                    <noscript>This site requires JavaScript</noscript>
                    <main role="main"><Main/></main>
                    <NextScript/>
                </body>
            </html>
        );
    }
}
