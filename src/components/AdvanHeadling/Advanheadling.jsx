import MainLayout from '@components/Layout/Layout';
import styles from './styles.module.scss';
function AdvanHeadling() {
    const { container, headline, containerMiddleBox, title, des } = styles;

    return (
        <MainLayout>
            <div className={container}>
                <div className={headline}></div>
                <div className={containerMiddleBox}>
                    <p className={des}>ĐỪNG BỎ LỠ ƯU ĐÃI ĐẶC BIỆT</p>
                    <p className={title}>Sản phẩm nổi bật của chúng tôi</p>
                </div>
                <div className={headline}></div>
            </div>
        </MainLayout>
    );
}

export default AdvanHeadling;
