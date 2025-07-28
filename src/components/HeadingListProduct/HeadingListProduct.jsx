import MainLayout from '@components/Layout/Layout';
import styles from './styles.module.scss';
import CountdownBanner from '@components/CountdownBanner/CountdownBanner';
import ProductItem from '@components/ProductItem/ProductItem';
function HeadingListProduct({ data }) {
    const { container } = styles;

    
    return (
        <MainLayout>
            <div className={container}>
                <CountdownBanner />
                <div className={container}>
                    {data.map((item) => {
                        return (
                            <ProductItem
                                key={item.id}
                                src={item.images[0]}
                                prevSrc={item.images[1]}
                                name={item.name}
                                price={item.price}
                                details={item}
                            />
                        );
                    })}
                </div>
            </div>
        </MainLayout>
    );
}

export default HeadingListProduct;
