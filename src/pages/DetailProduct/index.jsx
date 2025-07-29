import MyHeader from '@components/Header/Header';
import MainLayout from '@components/Layout/Layout';
import styles from './styles.module.scss';
import MyButton from '@components/Button/Button';
import { useState } from 'react';
import { FaRegHeart } from 'react-icons/fa';
import { TfiReload } from 'react-icons/tfi';
import AccordionMenu from '@components/AccordionMenu';
import Imformation from '@/pages/DetailProduct/components/information';
import ReviewProduct from '@/pages/DetailProduct/components/review';

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
        cricleIcon
    } = styles;

    const srcMethods = [
        'https://xstore.8theme.com/elementor2/marseille04/wp-content/themes/xstore/images/woocommerce/payment-icons/visa.jpeg',
        'https://xstore.8theme.com/elementor2/marseille04/wp-content/themes/xstore/images/woocommerce/payment-icons/master-card.jpeg',
        'https://xstore.8theme.com/elementor2/marseille04/wp-content/themes/xstore/images/woocommerce/payment-icons/paypal.jpeg',
        'https://xstore.8theme.com/elementor2/marseille04/wp-content/themes/xstore/images/woocommerce/payment-icons/american-express.jpeg',
        'https://xstore.8theme.com/elementor2/marseille04/wp-content/themes/xstore/images/woocommerce/payment-icons/maestro.jpeg',
        'https://xstore.8theme.com/elementor2/marseille04/wp-content/themes/xstore/images/woocommerce/payment-icons/bitcoin.jpeg'
    ];

    const [quantity, setQuantity] = useState(1);
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

    return (
        <div>
            <MyHeader />
            <div className={container}>
                <MainLayout>
                    <div className={functionbox}>
                        <div>
                            Home &gt; <span className={specialText}>Shop</span>
                        </div>
                        <div className={btnBack}>Return to previous page</div>
                    </div>

                    <div className={contentSection}>
                        <div className={imgSection}>
                            <img
                                src='https://xstore.8theme.com/elementor2/marseille04/wp-content/uploads/sites/2/2022/12/Image-7.1-min.jpg'
                                alt=''
                            />
                            <img
                                src='https://xstore.8theme.com/elementor2/marseille04/wp-content/uploads/sites/2/2022/12/Image-7.1-min.jpg'
                                alt=''
                            />
                            <img
                                src='https://xstore.8theme.com/elementor2/marseille04/wp-content/uploads/sites/2/2022/12/Image-7.1-min.jpg'
                                alt=''
                            />
                            <img
                                src='https://xstore.8theme.com/elementor2/marseille04/wp-content/uploads/sites/2/2022/12/Image-7.1-min.jpg'
                                alt=''
                            />
                        </div>
                        <div className={TextSection}>
                            <h1>Amet faucibus nunc</h1>
                            <div className={priceText}>
                                $1,879.99 – $1,888.99
                            </div>
                            <p>
                                Amet, elit tellus, nisi odio velit ut. Euismod
                                sit arcu, quisque arcu purus orci leo.
                            </p>
                            <div className={titleSize}>Size</div>
                            <div className={boxSize}>
                                <div className={size}>L</div>
                                <div className={size}>M</div>
                                <div className={size}>S</div>
                            </div>
                            <div className={addToCartContainer}>
                                <div className={quantityControl}>
                                    <button onClick={handleDecrease}>-</button>
                                    <span>{quantity}</span>
                                    <button onClick={handleIncrease}>+</button>
                                </div>
                                <MyButton content={'ADD TO CART'} />
                            </div>

                            <div className={textOr}>
                                <div className={line}></div>
                                <div className={orLine}>OR</div>
                                <div className={line}></div>
                            </div>

                            <div className={containermethods}>
                                <div className={titleMethods}>
                                    Guaranteed <span>safe</span> checkout
                                </div>

                                <div className={boxImageMethods}>
                                    {srcMethods.map((src, index) => {
                                        return (
                                            <img
                                                src={src}
                                                alt=''
                                                key={index}
                                                className={imageMethods}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                            <div className={textSecure}>
                                Your Payment is 100% Secure
                            </div>
                            <MyButton content={'BUY NOW'} />

                            <div className={boxIcons}>
                                <div className={cricleIcon}>
                                    <FaRegHeart />
                                </div>
                                <div className={cricleIcon}>
                                    <TfiReload />
                                </div>
                            </div>

                            <div className={textBrand}>
                                <div className={titleBrand}>Brand: </div>
                                <div className={decbrand}> Brand 03</div>
                            </div>
                            <div className={textBrand}>
                                <div className={titleBrand}>SKU: </div>
                                <div className={decbrand}> 87654</div>
                            </div>
                            <div className={textBrand}>
                                <div className={titleBrand}>Category: </div>
                                <div className={decbrand}> Men</div>
                            </div>

                            {dataAccordionMenu.map((item, index) => (
                                <AccordionMenu
                                    titleMenu={item.titleMenu}
                                    contentJsx={item.content}
                                    key={index}
                                    onClick={() =>
                                        hangleSetMenuSelected(item.id)
                                    }
                                    isSelected={menuSelected === item.id}
                                />
                            ))}
                        </div>
                    </div>
                </MainLayout>
            </div>
        </div>
    );
}

export default DetailProduct;
