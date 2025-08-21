import MyButton from '@components/Button/Button';
import styles from '../../styles.module.scss';
import MyButtonWhist from '@components/Button/ButtonWhist';
import { useContext } from 'react';
import { SideBarContext } from '@/context/SideBarProvider';
import { StepperContext } from '@/context/SteperProvider';
import PaymentMethord from '@/pages/Cart/components/contents/PaymenMethord';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();
    const { listProductCart } = useContext(SideBarContext);
    const { setCurrentStep } = useContext(StepperContext);

    const total = listProductCart.reduce((acc, item) => {
        return acc + item.total;
    }, 0);

    const handleProcessCheckOut = () => {
        setCurrentStep(2);
    };

    const handleContinueShopping = () => {
        navigate('/shop');
    };
    return (
        <div className={containerRight}>
            <div className={containerSummary}>
                <div className={title}> TỔNG GIỎ HÀNG</div>
                <div className={textTali}></div>
                <div className={boxTotal}>
                    <div>Tạm tính</div>
                    <div>{total} VND</div>
                </div>
                <div className={boxTotal1}>
                    <div>TỔNG CỘNG</div>
                    <div>{total} VND</div>
                </div>

                <MyButton
                    content={'Tiến hành thanh toán'}
                    onClick={handleProcessCheckOut}
                />

                <MyButtonWhist
                    content={'Tiếp tục mua sắm'}
                    onClick={handleContinueShopping}
                />
            </div>

            <PaymentMethord />
        </div>
    );
}

export default CartSummer;
