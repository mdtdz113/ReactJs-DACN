import styles from './style.module.scss';

function MyButton({ content, ...props }) {
    const { btn } = styles;
    return <button className={btn} {...props}>{content}</button>;
}

export default MyButton;
