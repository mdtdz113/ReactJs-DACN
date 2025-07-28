import MainLayout from '@components/Layout/Layout';
import { useContext } from 'react';
import { OurShopContext } from '@/context/OurShopProvider';
import ProductItem from '@components/ProductItem/ProductItem';
import styles from '../OurShop/styles.module.scss';
import MyButton from '@components/Button/Button';
import MyButtonWhist from '@components/Button/ButtonWhist';
import Loading from '@components/Loading/Loading';

function ListProducts() {
    const { containerProducts, sectionListProduct, btnLoading } = styles;
    const {
        products,
        isShowGrid,
        isLoading,
        hangleLoadMore,
        total,
        isLoadMore,
        loader
    } = useContext(OurShopContext);

    return (
        <div className={sectionListProduct}>
            <MainLayout>
                {isLoading ? (
                    <>Loading...</>
                ) : (
                    <>
                        <div className={isShowGrid ? containerProducts : ''}>
                            {products.map((item) => (
                                <ProductItem
                                    key={item.id}
                                    src={item.images[0]}
                                    prevSrc={item.images[1]}
                                    name={item.name}
                                    price={item.price}
                                    details={item}
                                    isHomePage={false}
                                />
                            ))}
                        </div>

                        {products.length < total && (
                            <div className={btnLoading}
                                style={{ width: '200px', margin: '50px auto' }}
                                onClick={hangleLoadMore}
                            >
                                <MyButtonWhist
                                    content={
                                        isLoadMore ? (
                                            <Loading />
                                        ) : (
                                            'LOAD MORE PRODUCTS'
                                        )
                                    }
                                />
                            </div>
                        )}
                    </>
                )}
            </MainLayout>
        </div>
    );
}

export default ListProducts;
