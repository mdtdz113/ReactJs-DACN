import MyButton from '@components/Button/Button';
import styles from '../../styles.module.scss';
import MyButtonWhist from '@components/Button/ButtonWhist';
import { useContext } from 'react';
import { SideBarContext } from '@/context/SideBarProvider';

function CartSummer() {
    const {
        containerSummary,
        title,
        boxTotal,
        boxTotal1,
        textTali,
        space,
        containermethods,
        titleMethods,
        containerRight,
        boxImageMethods,
        imageMethods,
        textSecure
    } = styles;
    const { listProductCart } = useContext(SideBarContext);

    const srcMethods = [
        'https://xstore.8theme.com/elementor2/marseille04/wp-content/themes/xstore/images/woocommerce/payment-icons/visa.jpeg',
        'https://xstore.8theme.com/elementor2/marseille04/wp-content/themes/xstore/images/woocommerce/payment-icons/master-card.jpeg',
        'https://xstore.8theme.com/elementor2/marseille04/wp-content/themes/xstore/images/woocommerce/payment-icons/paypal.jpeg',
        'https://xstore.8theme.com/elementor2/marseille04/wp-content/themes/xstore/images/woocommerce/payment-icons/american-express.jpeg',
        'https://xstore.8theme.com/elementor2/marseille04/wp-content/themes/xstore/images/woocommerce/payment-icons/maestro.jpeg',
        'https://xstore.8theme.com/elementor2/marseille04/wp-content/themes/xstore/images/woocommerce/payment-icons/bitcoin.jpeg'
    ];

    const total = listProductCart.reduce((acc, item) => {
        return acc + item.total;
    }, 0);
    return (
        <div className={containerRight}>
            <div className={containerSummary}>
                <div className={title}> CART TOTALS</div>
                <div className={textTali}></div>
                <div className={boxTotal}>
                    <div>Subtotal</div>
                    <div>${total}</div>
                </div>
                <div className={boxTotal1}>
                    <div>TOTAL</div>
                    <div>${total}</div>
                </div>

                <MyButton content={'Proceed to Checkout'} />

                <MyButtonWhist content={'Continue Shopping'} />
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
            <div className={textSecure}>Your Payment is 100% Secure</div>
        </div>
    );
}

export default CartSummer;
