import CountdownTimer from '@components/CountdownTime/CountdownTime';
import styles from './styles.module.scss';

function CountdownBanner() {
    const targetDate = '2025-12-31T23:59:59';
    const { container, containerTimmer, title, boxBtn, btn } = styles;
    return (
        <div className={container}>
            <div className={containerTimmer}>
                <CountdownTimer targetDate={targetDate} />
            </div>
            <div className={title}>The classics make a comeback</div>
            <div className={boxBtn}>
                <button className={btn}>Buy now</button>
            </div>
        </div>
    );
}

export default CountdownBanner;
