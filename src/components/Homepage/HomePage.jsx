import Banner from '@components/Banner/Banner';
import MyHeader from '@components/Header/Header';
import style from './styles.module.scss';
import Info from '@components/Info/Info';
import Advanheadling from '@components/AdvanHeadling/Advanheadling';
import HeadingListProduct from '@components/HeadingListProduct/HeadingListProduct';
import { getProduct } from '@/apis/productServer';
import { useEffect } from 'react';
import PopulerProduct from '@components/PopulerProduct/PopulerProduct';
import { useState } from 'react';
import SaleHomePage from '@components/SaleHomePage/SaleHomePage';
import MyFooter from '@components/Footer/Footer';
function HomePage() {
    const [listProducts, setListProducts] = useState([]);

    useEffect(() => {

        const query ={
            sortType: 0,
            page: 1,
            limit: 10
        }
        getProduct(query).then((res) => {
            setListProducts(res.contents);
        });
    }, []);

    
    const { container } = style;
    return (
        <div>
            <div className={container}>
                <MyHeader />
                <Banner />
                <Info />
                <Advanheadling />
                <HeadingListProduct data={listProducts.slice(0, 2)} />
                <PopulerProduct
                    data={listProducts.slice(2, listProducts.length)}
                />
                <SaleHomePage />
                <MyFooter />
            </div>
        </div>
    );
}

export default HomePage;
