import Link from 'next/link';
import * as React from 'react';

const bulma = require('../../styles/global.scss');

interface Props {
    href: string;
    children: any[] | any;
}

export default class NavbarItem extends React.PureComponent<Props> {
    public render() {
        return (
            <Link href={this.props.href}>
                <a className={bulma.navbarItem}>
                    {this.props.children}
                </a>
            </Link>
        );
    }
}
