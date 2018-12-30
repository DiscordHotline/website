import '@fortawesome/fontawesome-svg-core/styles.css';
import {config, library} from '@fortawesome/fontawesome-svg-core';
import {faDiscord} from '@fortawesome/free-brands-svg-icons';
import {
    faCheck,
    faChevronDown,
    faChevronLeft,
    faChevronRight,
    faExclamationTriangle,
    faFlag,
    faHome,
    faPencil,
    faQuestion,
    faSearch,
    faSignInAlt,
    faSignOutAlt,
    faSpinner,
    faSpinnerThird,
    faStar,
    faSync,
    faUser,
    faUsers as faUsersLight,
} from '@fortawesome/pro-light-svg-icons';
import {faGem, faLongArrowAltRight, faUsers} from '@fortawesome/pro-solid-svg-icons';

config.autoAddCss = false;

library.add(
    faDiscord,
    faSpinnerThird,
    faSearch,
    faSync,
    faCheck,
    faHome,
    faPencil,
    faQuestion,
    faChevronDown,
    faStar,
    faUser,
    faUsers,
    faUsersLight,
    faGem,
    faChevronLeft,
    faChevronRight,
    faSignInAlt,
    faSignOutAlt,
    faFlag,
    faLongArrowAltRight,
    faSpinner,
    faExclamationTriangle,
);
