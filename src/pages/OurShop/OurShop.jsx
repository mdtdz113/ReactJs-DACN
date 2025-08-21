import MyHeader from '@components/Header/Header';
import MainLayout from '@components/Layout/Layout';
import styles from './styles.module.scss';
import { useNavigate } from 'react-router-dom';
import Banner from '../components/Banner';
import { OurShopProvider } from '@/context/OurShopProvider';
import { useContext } from 'react';
import Filter from '@/pages/components/Filter';
import ListProducts from '@/pages/components/ListProduct';
import MyFooter from '@components/Footer/Footer';

function OurShop() {
    const { container, functionbox, specialText, btnBack } = styles;
    const navigate = useNavigate();

    const handleBackPreviousPage = () => {
        navigate(-1);
    };
    return (
        <OurShopProvider>
            <MyHeader />
            <MainLayout>
                <div className={container}>
                    <div className={functionbox}>
                        <div>
                            {' '}
                            Trang chủ &gt;{' '}
                            <span className={specialText}>Cửa hàng</span>
                        </div>
                        <div
                            className={btnBack}
                            onClick={() => handleBackPreviousPage()}
                        >
                            {' '}
                            Quay lại trang trước{' '}
                        </div>
                    </div>
                    <Banner />
                    <div>
                        <Filter />
                        <ListProducts />
                    </div>
                </div>
            </MainLayout>
            <MyFooter />
        </OurShopProvider>
    );
}

export default OurShop;
