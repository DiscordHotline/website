import c from 'classnames';
import Link from 'next/link';
import React from 'react';
import NavbarItem from './NavbarItem';

const bulma  = require('../../styles/global.scss');
const styles = require('./MainMenu.scss');

interface State {
    mounted: boolean;
    toggled: boolean;
}

export default class MainMenu extends React.Component<{}, State> {
    public state = {
        mounted: false,
        toggled: false,
    };

    public componentDidMount() {
        this.setState({mounted: true});
    }

    public render() {
        return (
            <nav className={c(bulma.navbar, bulma.isPrimary, styles.navbar)}>
                <div className={bulma.navbarBrand}>
                    <Link href="/">
                        <a className={bulma.navbarItem}>
                            <img src={require('../../static/hotline.png')} alt="Logo" className={styles.logo}/>
                            <h1 className={c(bulma.title, bulma.is2, styles.title)}>Hotline</h1>
                        </a>
                    </Link>
                    <a className={c(bulma.navbarBurger, bulma.burger)}>
                        <span/>
                        <span/>
                        <span/>
                    </a>
                </div>
                <div className={bulma.navbarMenu}>
                    <div className={bulma.navbarEnd}>
                        <NavbarItem href="https://apply.hotline.gg">
                            Apply to Join
                        </NavbarItem>
                        <NavbarItem href="/connect">
                            Log In
                        </NavbarItem>
                    </div>
                </div>
            </nav>
        );
    }
}
