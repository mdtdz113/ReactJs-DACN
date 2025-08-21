import CartTable from '@/pages/Cart/components/contents/CartTable';
import styles from '../../styles.module.scss';
import CartSummer from '@/pages/Cart/components/contents/CartSummer';
import MyButtonWhist from '@components/Button/ButtonWhist';
import MyButton from '@components/Button/Button';
import { useContext, useEffect } from 'react';
import { SideBarContext } from '@/context/SideBarProvider';
import { addProductToCart } from '@/apis/cartService';
import { deleteItem } from '@/apis/cartService';
import { deleteCart } from '@/apis/cartService';
import { FaCartArrowDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getCart } from '@/apis/cartService';
import Cookies from 'js-cookie';

function Contents() {
    const {
        containercontent,
        boxFooter,
        boxCoupon,
        btnCoupon,
        boxNoProduct,
        itemCart,
        desCart,
        destitle
    } = styles;

    const {
        listProductCart,
        hangleGetListProductCart,
        isLoading,
        setIsLoading,
        userId,
        setListProductCart
    } = useContext(SideBarContext);

    const hangleReplaceQuantity = (data) => {
        setIsLoading(true);
        addProductToCart(data)
            .then((res) => {
                hangleGetListProductCart(data.userId, 'cart');
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleDeleteItemCart = (data) => {
        setIsLoading(true);
        deleteItem(data)
            .then((res) => {
                hangleGetListProductCart(data.userId, 'cart');
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
    };
    const handleClearCart = () => {
        setIsLoading(true);
        deleteCart({ userId })
            .then((res) => {
                hangleGetListProductCart(userId, 'cart');
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
    };
    const navigete = useNavigate();
    const handleNavigateToShop = () => {
        navigete('/shop');
        setIsOpen(false);
    };

    useEffect(() => {
        if (userId) {
            getCart(userId)
                .then((res) => {
                    setListProductCart(res.data.data);
                    setIsLoading(false);
                })
                .catch((err) => {
                    setListProductCart([]);
                    setIsLoading(false);
                });
        }
    }, []);
    return (
        <>
            {listProductCart.length > 0 ? (
                <div className={containercontent}>
                    <div>
                        <CartTable
                            listProductCart={listProductCart}
                            getData={hangleReplaceQuantity}
                            isLoading={isLoading}
                            getDataDelete={handleDeleteItemCart}
                        />
                        <div className={boxFooter}>
                            <div className={boxCoupon}>
                                <input
                                    type='text'
                                    placeholder='Nhập mã giảm giá'
                                />
                                <div className={btnCoupon}>
                                    <MyButtonWhist content={'OK'} />
                                </div>
                            </div>
                            <div>
                                <MyButton
                                    content={'Xóa tất cả giỏ hàng'}
                                    onClick={handleClearCart}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <CartSummer />
                    </div>
                </div>
            ) : (
                <div className={boxNoProduct}>
                    <FaCartArrowDown className={itemCart} />
                    <div className={desCart}>YOUR SHOPPING CART IS EMPTY</div>
                    <div className={destitle}>
                        We invite you to get acquainted with an assortment of
                        our shop. Surely you can find something for yourself!
                    </div>
                    <div>
                        {' '}
                        <MyButton
                            content={'ĐẾN CỬA HÀNG'}
                            onClick={() => handleNavigateToShop()}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default Contents;
