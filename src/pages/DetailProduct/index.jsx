import MyHeader from '@components/Header/Header';
import MainLayout from '@components/Layout/Layout';
import styles from './styles.module.scss';
import MyButton from '@components/Button/Button';
import { useContext, useEffect, useState } from 'react';
import { FaRegHeart } from 'react-icons/fa';
import { TfiReload } from 'react-icons/tfi';
import AccordionMenu from '@components/AccordionMenu';
import Imformation from '@/pages/DetailProduct/components/information';
import ReviewProduct from '@/pages/DetailProduct/components/review';
import MyFooter from '@components/Footer/Footer';
import SliderCommon from '@components/SliderCommon/SliderCommon';
import ReactImageMagnifier from 'simple-image-magnifier/react';
import { data, useNavigate, useParams } from 'react-router-dom';
import cls from 'classnames';
import { getDetailProduct } from '@/apis/productServer';
import { use } from 'react';
import Loading from '@components/Loading/Loading';
import { getRelatedProduct } from '@/apis/productServer';
import { handleAddProductToCartCommon } from '@/utils/helper';
import { SideBarContext } from '@/context/SideBarProvider';
import { ToastContext } from '@/context/ToastProvider';
import Cookies from 'js-cookie';
import { addProductToCart } from '@/apis/cartService';

function DetailProduct() {
    const {
        container,
        functionbox,
        specialText,
        btnBack,
        contentSection,
        imgSection,
        TextSection,
        priceText,
        boxSize,
        titleSize,
        size,
        addToCartContainer,
        quantityControl,
        boxImageMethods,
        containermethods,
        imageMethods,
        titleMethods,
        line,
        orLine,
        textOr,
        textSecure,
        textBrand,
        titleBrand,
        decbrand,
        boxIcons,
        cricleIcon,
        isActiceSize,
        Clear,
        activaceDisableBtn,
        loadingCart,
        noData,
        loader
    } = styles;

    const [isLoading, setIsLoading] = useState(true);
    const [sizeSelected, setSizeSelected] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [relatedData, setRelatedData] = useState('');
    const { setIsOpen, setType, hangleGetListProductCart, setDetailsProduct } =
        useContext(SideBarContext);
    const { toast } = useContext(ToastContext);
    const [isLoadingBuyNow, setIsLoadingBuyNow] = useState(false);

    const userId = Cookies.get('userId');
    const [isLoadingBtn, setIsLoadingBtn] = useState(false);
    const navigate = useNavigate();
    const handleSelectSize = (size) => {
        setSizeSelected(size);
    };
    const handleClearSize = () => {
        setSizeSelected('');
    };
    const srcMethods = [
        'https://xstore.8theme.com/elementor2/marseille04/wp-content/themes/xstore/images/woocommerce/payment-icons/visa.jpeg',
        'https://xstore.8theme.com/elementor2/marseille04/wp-content/themes/xstore/images/woocommerce/payment-icons/master-card.jpeg',
        'https://xstore.8theme.com/elementor2/marseille04/wp-content/themes/xstore/images/woocommerce/payment-icons/paypal.jpeg',
        'https://xstore.8theme.com/elementor2/marseille04/wp-content/themes/xstore/images/woocommerce/payment-icons/american-express.jpeg',
        'https://xstore.8theme.com/elementor2/marseille04/wp-content/themes/xstore/images/woocommerce/payment-icons/maestro.jpeg',
        'https://xstore.8theme.com/elementor2/marseille04/wp-content/themes/xstore/images/woocommerce/payment-icons/bitcoin.jpeg'
    ];
    const handleDecrease = () => {
        setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));
    };

    const handleIncrease = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    const [menuSelected, setMenuSelected] = useState(1);
    const dataAccordionMenu = [
        {
            id: 1,
            titleMenu: 'ADDITIONAL INFORMATION',
            content: <Imformation />
        },
        {
            id: 2,
            titleMenu: 'REVIEW 0',
            content: <ReviewProduct />
        }
    ];
    const hangleSetMenuSelected = (id) => {
        setMenuSelected(id);
    };

    const handleRederZoomImage = (src) => {
        return (
            <ReactImageMagnifier
                srcPreview={src}
                srcOriginal={src}
                width={295}
                height={350}
            />
        );
    };
    const param = useParams();

    const [data, setData] = useState();

    const fetchDataDetail = async (id) => {
        try {
            const data = await getDetailProduct(id);

            setData(data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            setData();
        }
    };

    const fetchDataRelatedProducts = async (id) => {
        try {
            const data = await getRelatedProduct(id);
            setRelatedData(data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };
    const handleBuyNow = () => {
        const data = {
            userId,
            productId: param.id,
            quantity,
            size: sizeSelected
        };
        setIsLoadingBuyNow(true);

        addProductToCart(data)
            .then((res) => {
                toast.success('Add Product to cart success!');
                setIsLoading(false);
                navigate('/cart');
                setIsLoadingBuyNow(false);
            })
            .catch((err) => {
                toast.error('Add Product to cart failed!');
                setIsLoading(false);
                setIsLoadingBuyNow(false);
            });
        // navigate('/cart')
    };
    useEffect(() => {
        if (param.id) {
            fetchDataDetail(param.id);
            fetchDataRelatedProducts(param.id);
        }
    }, [param]);
    const handleAdd = () => {
        handleAddProductToCartCommon(
            userId,
            setIsOpen,
            setType,
            toast,
            sizeSelected,
            param.id,
            quantity,
            setIsLoadingBtn,
            hangleGetListProductCart
        );
    };

    return (
        <div>
            <MyHeader />
            <div className={container}>
                <MainLayout>
                    <div className={functionbox}>
                        <div>
                            Trang chủ &gt;{' '}
                            <span className={specialText}>Cửa hàng</span>
                        </div>
                        <div
                            className={btnBack}
                            onClick={() => navigate('/shop')}
                        >
                            Quay lại trang trước
                        </div>
                    </div>

                    {isLoading ? (
                        <div className={loadingCart}>
                            <Loading />
                        </div>
                    ) : (
                        <>
                            {!data ? (
                                <div className={noData}>
                                    <div className={loader}></div>

                                    <div>NO DATA</div>
                                    <div onClick={() => navigate('/shop')}>
                                        <MyButton
                                            content={'BACK TO OUR SHOP'}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className={contentSection}>
                                    <div className={imgSection}>
                                        {data?.images.map((src) =>
                                            handleRederZoomImage(src)
                                        )}
                                    </div>
                                    <div className={TextSection}>
                                        <h1>{data?.name}</h1>
                                        <div className={priceText}>
                                            {data?.price} VND
                                        </div>
                                        <p>{data?.description}</p>
                                        <div className={titleSize}>
                                            Size {sizeSelected}
                                        </div>
                                        <div className={boxSize}>
                                            {data?.size.map(
                                                (itemSize, index) => {
                                                    return (
                                                        <div
                                                            className={cls(
                                                                size,
                                                                {
                                                                    [isActiceSize]:
                                                                        sizeSelected ===
                                                                        itemSize.name
                                                                }
                                                            )}
                                                            key={index}
                                                            onClick={() =>
                                                                handleSelectSize(
                                                                    itemSize.name
                                                                )
                                                            }
                                                        >
                                                            {itemSize.name}
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                        {sizeSelected && (
                                            <p
                                                className={Clear}
                                                onClick={handleClearSize}
                                            >
                                                Clear
                                            </p>
                                        )}
                                        <div className={addToCartContainer}>
                                            <div className={quantityControl}>
                                                <button
                                                    onClick={handleDecrease}
                                                >
                                                    -
                                                </button>
                                                <span>{quantity}</span>
                                                <button
                                                    onClick={handleIncrease}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <MyButton
                                                content={
                                                    isLoadingBtn ? (
                                                        <Loading />
                                                    ) : (
                                                        'ADD TO CART'
                                                    )
                                                }
                                                customClassname={
                                                    !sizeSelected &&
                                                    activaceDisableBtn
                                                }
                                                onClick={handleAdd}
                                            />
                                        </div>

                                        <div className={textOr}>
                                            <div className={line}></div>
                                            <div className={orLine}>OR</div>
                                            <div className={line}></div>
                                        </div>
                                        <MyButton
                                            content={
                                                isLoadingBuyNow ? (
                                                    <Loading />
                                                ) : (
                                                    'BUY NOW'
                                                )
                                            }
                                            customClassname={
                                                !sizeSelected &&
                                                activaceDisableBtn
                                            }
                                            onClick={handleBuyNow}
                                        />
                                        <div className={containermethods}>
                                            <div className={titleMethods}>
                                                Guaranteed <span>safe</span>{' '}
                                                checkout
                                            </div>

                                            <div className={boxImageMethods}>
                                                {srcMethods.map(
                                                    (src, index) => {
                                                        return (
                                                            <img
                                                                src={src}
                                                                alt=''
                                                                key={index}
                                                                className={
                                                                    imageMethods
                                                                }
                                                            />
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                        <div className={textSecure}>
                                            Your Payment is 100% Secure
                                        </div>

                                        <div className={boxIcons}>
                                            <div className={cricleIcon}>
                                                <FaRegHeart />
                                            </div>
                                            <div className={cricleIcon}>
                                                <TfiReload />
                                            </div>
                                        </div>

                                        <div className={textBrand}>
                                            <div className={titleBrand}>
                                                Brand:{' '}
                                            </div>
                                            <div className={decbrand}>
                                                {' '}
                                                Brand 03
                                            </div>
                                        </div>
                                        <div className={textBrand}>
                                            <div className={titleBrand}>
                                                SKU:{' '}
                                            </div>
                                            <div className={decbrand}>
                                                {' '}
                                                87654
                                            </div>
                                        </div>
                                        <div className={textBrand}>
                                            <div className={titleBrand}>
                                                Category:{' '}
                                            </div>
                                            <div className={decbrand}> Men</div>
                                        </div>

                                        {dataAccordionMenu.map(
                                            (item, index) => (
                                                <AccordionMenu
                                                    titleMenu={item.titleMenu}
                                                    contentJsx={item.content}
                                                    key={index}
                                                    onClick={() =>
                                                        hangleSetMenuSelected(
                                                            item.id
                                                        )
                                                    }
                                                    isSelected={
                                                        menuSelected === item.id
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    <div>
                        <h2>Related products</h2>
                        <SliderCommon
                            data={Array.isArray(relatedData) ? relatedData : []}
                            isProductItem={true}
                            showItem={4}
                        />
                    </div>
                </MainLayout>
            </div>

            <MyFooter />
        </div>
    );
}

export default DetailProduct;
