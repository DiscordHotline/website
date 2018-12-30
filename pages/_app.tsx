import c from 'classnames';
import 'core-js/es7/array';
import 'core-js/fn/string/includes';
import App, {Container} from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

import '../extensions';
import '../fonts';

import MainMenu from '../components/MainMenu/MainMenu';

const bulma  = require('../styles/global.scss');
const styles = require('../styles/Layout.scss');

interface Props {
    query: any;
}

export default class extends App<Props> {
    public static async getInitialProps(context) {
        try {
            const props: any = await App.getInitialProps(context);
            props.query      = context.ctx.query;

            return props;
        } catch (e) {
            console.error(e);
        }
    }

    public state = {
        loading: true,
    };

    public async componentDidMount() {
        this.setState({loading: false});
    }

    public render() {
        const {Component, pageProps} = this.props;

        // @ts-ignore
        // noinspection TsLint
        return (
            <Container>
                <Head>
                    <title key="title">Discord Hotline | Moderator Community</title>
                    <link key="canonical" rel="canonical" href="https://www.hotline.gg"/>
                    <meta key="viewport" name="viewport" content="initial-scale=1, width=device-width"/>
                    <meta key="robots" name="robots" content="index, follow"/>

                    <meta key="description" name="description"
                          content="Discord Hotline is a community of moderators. We provide a place to talk about moderation things, and have an early warning system."/>
                    <meta key="keywords" name="keywords"
                          content="discord, discord moderation, discord moderators"/>
                    <meta key="author" name="author" content="Discord Hotline"/>
                    <meta property="og:title" content="Discord Hotline | Moderator Community"/>
                    <meta property="og:type" content="website"/>
                    <meta property="og:url" content="https://www.hotline.gg"/>
                    <meta property="og:image" content={require('../static/logo.png')}/>
                    <meta property="og:site_name" content="DiscordHotline"/>
                    <meta property="og:description"
                          content="Discord Hotline is a community of moderators. We provide a place to talk about moderation things, and have an early warning system."/>
                </Head>
                <MainMenu/>
                <div className={c(bulma.hero, bulma.isFullheightWithNavbar)}>
                    <main className={c(bulma.container, bulma.isWidescreen, styles.content)}>
                        <Component {...pageProps}/>
                    </main>
                    <div className={c(bulma.heroFoot)}>
                        <footer className={styles.footer}>
                            <div className={bulma.container}>
                                <div className={c(bulma.content, bulma.hasTextCentered)}>
                                    <p className={styles.notice}>
                                        <strong><Link href="/"><a>Discord Hotline</a></Link></strong>
                                        &nbsp;is not affiliated with&nbsp;
                                        <strong>
                                            <Link href="//discordapp.com"><a>Discord</a></Link>
                                        </strong>.
                                    </p>
                                    {/*<p className={styles.notice}>
                                     View our <Link href="/terms"><a>Terms of
                                     Service</a></Link> and
                                     our <Link href="/privacy"><a>Privacy Policy</a></Link>.
                                     </p>*/}
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </Container>
        );
    }
}
