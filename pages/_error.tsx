import c from 'classnames';
import HTTPStatus from 'http-status';
import React, {PureComponent} from 'react';

const bulma = require('../styles/global.scss');

export default class Page extends PureComponent<any> {
    public static getInitialProps({res, err, query}) {
        const statusCode = res ? res.statusCode : err ? err.statusCode : null;

        return {statusCode, query};
    }

    public render() {
        const {statusCode} = this.props;
        const title        = statusCode === 404
                             ? 'This page could not be found'
                             : HTTPStatus[statusCode] || 'An unexpected error has occurred';

        return (
            <div className={c(bulma.hero, bulma.isFullheight)}>
                <div className={c(bulma.heroBody, bulma.hasTextCentered)}>
                    <div style={{width: '20%', margin: '0 auto'}}>
                        {statusCode ? <h1 style={styles.h1}>{statusCode}</h1> : null}
                        <div style={styles.desc as any}>
                            <h2 style={styles.h2 as any}>{title}.</h2>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const styles = {
    error: {
        color:          '#000',
        background:     '#fff',
        height:         '100vh',
        textAlign:      'center',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
    },

    desc: {
        display:       'inline-block',
        textAlign:     'left',
        lineHeight:    '49px',
        height:        '49px',
        verticalAlign: 'middle',
    },

    h1: {
        display:       'inline-block',
        borderRight:   '1px solid rgba(0, 0, 0,.3)',
        margin:        0,
        marginRight:   '20px',
        padding:       '10px 23px 10px 0',
        fontSize:      '24px',
        fontWeight:    500,
        verticalAlign: 'top',
        color:         'black',
    },

    h2: {
        fontSize:   '14px',
        fontWeight: 'normal',
        lineHeight: 'inherit',
        margin:     0,
        padding:    0,
        color:      'black',
    },
};
