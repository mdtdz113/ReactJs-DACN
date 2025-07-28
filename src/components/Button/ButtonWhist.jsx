import styles from './style.module.scss';

function MyButtonWhist({ content }) {
    const { btn1 } = styles;
    return <button className={btn1}>{content}</button>;
}



export default MyButtonWhist;
