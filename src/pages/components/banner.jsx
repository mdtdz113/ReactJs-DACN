import MyButton from '@components/Button/Button';
import styles from '../OurShop/styles.module.scss';
import CountdownTimer from '@components/CountdownTime/CountdownTime';

function Banner() {
    const targetDate = '2025-12-31T23:59:59';
    const { containerBanner, containerTimmer, title, btn } = styles;
    return (
        <>
            <div className={containerBanner}>
                <div className={containerTimmer}>
                    <div>
                        <CountdownTimer targetDate={targetDate} />
                    </div>
                    <div className={title}>Phong cách kinh điển trở lại</div>
                    <div className={btn}>
                        <MyButton content={'Mua ngay'} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Banner;
