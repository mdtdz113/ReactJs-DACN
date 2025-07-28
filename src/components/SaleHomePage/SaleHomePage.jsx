import MyButton from '@components/Button/Button';
import styles from './styles.module.scss';

function SaleHomePage() {
    const { container, title, des, boxBtn, boxImage } = styles;
    return (
        <div className={container}>
            <div className={boxImage}>
                <img
                    src='https://xstore.b-cdn.net/elementor2/marseille04/wp-content/uploads/sites/2/2022/12/Image_1.jpeg'
                    alt=''
                />
            </div>
            <div>
                <h1 className={title}>Sale of the year</h1>
                <span className={des}>
                    Libero sed faucibus facilisis fermentum. Est nibh sed massa
                    sodales.
                </span>
                <div className={boxBtn}>
                    <MyButton content={'Read more'} />
                </div>
            </div>
            <div className={boxImage} >
                <img
                    src='https://xstore.b-cdn.net/elementor2/marseille04/wp-content/uploads/sites/2/2022/12/Image_2.jpeg'
                    alt=''
                />
            </div>
        </div>
    );
}

export default SaleHomePage;
