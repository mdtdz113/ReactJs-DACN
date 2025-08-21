import ItemProduct from '@components/ContentSideBar/components/ItemProduct/ItemProduct';
import styles from './styles.module.scss';
import { BsCart3 } from 'react-icons/bs';
import HeaderSidebar from '@components/ContentSideBar/components/HeaderSidebar/HeaderSidebar';
import MyButton from '@components/Button/Button';
import MyButtonWhist from '@components/Button/ButtonWhist';
import { useContext } from 'react';
import { SideBarContext } from '@/context/SideBarProvider';
import Loading from '@components/Loading/Loading';
import cls from 'classnames';
import { useNavigate } from 'react-router-dom';
function Cart() {
    const {
        container,
        btnWist,
        containerListProductCart,
        overLayLoading,
        isEmpty,
        boxEmpty,
        des,
        containerListItem
    } = styles;
    const { listProductCart, isLoading, setIsOpen } =
        useContext(SideBarContext);

    const navigete = useNavigate();

    const handleNavigateToShop = () => {
        navigete('/shop');
        setIsOpen(false);
    };

    const subTotal = listProductCart.reduce((acc, item) => {
        return acc + item.total;
    }, 0);

    const handleNavigate = () => {
        navigete('/cart');
        setIsOpen(false);
    };
    return (
        <div
            className={cls(container, {
                [isEmpty]: !listProductCart.length
            })}
        >
            <HeaderSidebar
                icon={<BsCart3 style={{ fontSize: '30px' }} />}
                title={'Giỏ hàng'}
            />
            {listProductCart.length ? (
                <div className={containerListItem}>
                    <div
                        style={{
                            height: 'calc(100vh - 200px)',
                            overflowY: 'auto'
                        }}
                    >
                        {isLoading ? (
                            <Loading className={overLayLoading} />
                        ) : (
                            listProductCart.map((item, index) => {
                                return (
                                    <ItemProduct
                                        key={index}
                                        src={item.images[0]}
                                        nameProduct={item.name}
                                        priceProduct={item.price}
                                        skuProduct={item.sku}
                                        sizeProduct={item.size}
                                        quantity={item.quantity}
                                        productId={item.productId}
                                        userId={item.userId}
                                    />
                                );
                            })
                        )}
                    </div>
                    <div>
                        <div>
                            <span>Tạm tính:</span>
                            <span>{subTotal.toFixed(2)} VND</span>
                        </div>
                        <div className={btnWist}>
                            <MyButton
                                content={'XEM GIỎ HÀNG'}
                                onClick={handleNavigate}
                            />
                        </div>
                        <div>
                            <MyButtonWhist content={'THANH TOÁN'} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className={boxEmpty}>
                    <div className={des}>
                        Không có sản phẩm nào trong giỏ hàng
                    </div>
                    <div onClick={() => handleNavigateToShop()}>
                        <MyButtonWhist content={'ĐẾN CỬA HÀNG'} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
