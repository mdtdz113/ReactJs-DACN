import styles from './styles.module.scss';
import { MdOutlineShoppingBag } from 'react-icons/md';
import { TfiReload } from 'react-icons/tfi';
import { FaRegHeart } from 'react-icons/fa';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import cls from 'classnames';
import MyButton from '@components/Button/Button';
import { useContext, useEffect, useState } from 'react';
import { OurShopContext } from '@/context/OurShopProvider';
import Cookies from 'js-cookie';
import { SideBarContext } from '@/context/SideBarProvider';
import { ToastContext } from '@/context/ToastProvider';
import { addProductToCart } from '@/apis/cartService';
import Loading from '@components/Loading/Loading';
import { useNavigate } from 'react-router-dom';
function ProductItem({
    src,
    prevSrc,
    name,
    price,
    details,
    isHomePage = true
}) {
    // const { isShowGrid } = useContext(OurShopContext);
    const [sizeChoose, setSizeChoose] = useState('');
    const ourShopStore = useContext(OurShopContext);
    const [isShowGrid, setIsShowGrid] = useState(ourShopStore?.isShowGrid);
    const userId = Cookies.get('userId');
    const { setIsOpen, setType, hangleGetListProductCart, setDetailsProduct } =
        useContext(SideBarContext);
    const { toast } = useContext(ToastContext);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const {
        boxImg,
        showFncWhenHover,
        showImgWhenHover,
        boxIcon,
        textPrice,
        title,
        boxSize,
        size,
        textCenter,
        boxBtn,
        content,
        containerItem,
        leftBtn,
        isActiveSize,
        btnClear
    } = styles;

    const hangleChooseSize = (size) => {
        setSizeChoose(size);
    };
    const hangleChooseClear = () => {
        setSizeChoose('');
    };

    useEffect(() => {
        if (isHomePage) {
            setIsShowGrid(true);
        } else {
            setIsShowGrid(ourShopStore?.isShowGrid);
        }
    }, [isHomePage, ourShopStore?.isShowGrid]);

    const hangleAddToCart = () => {
        console.log(userId);
        if (!userId) {
            setIsOpen(true);
            setType('login');
            toast.warning('please login to add product to cart');
            return;
        }

        if (!sizeChoose) {
            toast.warning('please choose size');
            return;
        }

        const data = {
            userId,
            productId: details._id,
            quantity: 1,
            size: sizeChoose
        };
        setIsLoading(true);
        addProductToCart(data)
            .then((res) => {
                setIsOpen(true);
                setType('cart');
                toast.success('add product to cart success');
                setIsLoading(false);
                hangleGetListProductCart(userId, 'cart');
            })
            .catch((err) => {
                toast.error('add product to cart failed');
                setIsLoading(false);
            });
    };

    const handleNavigateToProductDetail = () => {
        const path = `/product/${details._id}`;

        navigate(path);
    };
    const handleShowDetailProductSidebar = () => {
        setIsOpen(true);
        setType('detail');
        setDetailsProduct(details);
    };
    return (
        <div className={isShowGrid ? '' : containerItem}>
            <div className={boxImg}>
                <img src={src} alt='' />
                <img
                    src={prevSrc}
                    alt=''
                    className={showImgWhenHover}
                    onClick={() => handleNavigateToProductDetail()}
                />
                <div className={showFncWhenHover}>
                    <div>
                        <div className={boxIcon}>
                            {' '}
                            <MdOutlineShoppingBag />
                        </div>
                        <div className={boxIcon}>
                            {' '}
                            <FaRegHeart />
                        </div>
                        <div className={boxIcon}>
                            {' '}
                            <TfiReload />
                        </div>
                        <div className={boxIcon}>
                            {' '}
                            <MdOutlineRemoveRedEye
                                onClick={handleShowDetailProductSidebar}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className={isShowGrid ? '' : content}>
                {!isHomePage && (
                    <div className={boxSize}>
                        {details.size.map((item, index) => {
                            return (
                                <div
                                    onClick={() => hangleChooseSize(item.name)}
                                    className={cls(size, {
                                        [isActiveSize]: sizeChoose === item.name
                                    })}
                                    key={index}
                                >
                                    {item.name}
                                </div>
                            );
                        })}
                    </div>
                )}
                {sizeChoose && (
                    <div
                        className={btnClear}
                        onClick={() => hangleChooseClear()}
                    >
                        Clear
                    </div>
                )}
                <div
                    className={cls(title, {
                        [textCenter]: !isHomePage
                    })}
                >
                    {name}
                </div>
                {!isHomePage && <div className={textCenter}>Brand 01</div>}
                <div
                    className={cls(textPrice, {
                        [textCenter]: !isHomePage
                    })}
                >
                    ${price}
                </div>
                {!isHomePage && (
                    <div
                        className={cls(boxBtn, {
                            [leftBtn]: isShowGrid
                        })}
                    >
                        <MyButton
                            content={isLoading ? <Loading /> : 'ADD TO CART'}
                            onClick={() => hangleAddToCart()}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductItem;
