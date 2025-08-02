import classNames from 'classnames';
import styles from './style.module.scss';

function MyButton({ content, customClassname = false, ...props }) {
    const { btn } = styles;
    return (
        <button
            className={classNames(btn, {
                [customClassname]: customClassname
            })}
            {...props}
        >
            {content}
        </button>
    );
}

export default MyButton;
