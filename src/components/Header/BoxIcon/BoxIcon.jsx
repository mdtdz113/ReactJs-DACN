import style from '../styles.module.scss';
import fbIcon from '@icons/svgs/facebook.svg';
import insIcon from '@icons/svgs/ins.svg';
import messIcon from '@icons/svgs/mess.svg';

function BoxIcon({ type, href }) {
    const { boxIcon } = style;
    let icon;
    switch (type) {
        case 'fb':
            icon = fbIcon;
            break;
        case 'ins':
            icon = insIcon;
            break;
        case 'mess':
            icon = messIcon;
            break;
        default:
            icon = null;
    }

    return (
        <a href={href} className={boxIcon}>
            {icon && <img src={icon} alt={type} />}
        </a>
    );
}

export default BoxIcon;
