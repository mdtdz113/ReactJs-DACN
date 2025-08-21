import PaymentMethord from '@/pages/Cart/components/contents/PaymenMethord';
import styles from './styles.module.scss';
import { SideBarContext } from '@/context/SideBarProvider';
import { useContext, useState } from 'react';
import MyButton from '@components/Button/Button';
import { useNavigate } from 'react-router-dom';

function RightBody({
    handleExternalSubmit,
    onSubmit,
    getValues,
    handleCreateOrderCOD
}) {
    const { rightbody, title, Item, Items, totalPrice, checkBtn, btnCheckOn } =
        styles;

    const { listProductCart } = useContext(SideBarContext);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const navigate = useNavigate();
    const total = listProductCart.reduce((acc, item) => {
        return acc + item.total;
    }, 0);

    const handlePlaceOrderClick = async () => {
        if (!paymentMethod) {
            alert('Vui lòng chọn phương thức thanh toán');
            return;
        }

        if (paymentMethod === 'cod') {
            // Tạo đơn COD ngay
            await handleCreateOrderCOD();
            navigate('/ViewOrder');
        } else if (paymentMethod === 'qr') {
            // Giữ nguyên luồng QR code
            handleExternalSubmit();
        }
    };
    return (
        <div className={rightbody}>
            <p className={title}>ĐƠN HÀNG CỦA BẠN</p>

            <div className={Items}>
                {listProductCart.map((item, index) => (
                    <div className={Item}>
                        <div>
                            <img src={item.images[0]} alt='' />
                        </div>
                        <div>
                            <p>{item.name}</p>
                            <p>
                                {item.quantity} x {item.price}
                            </p>
                            <p> Size: {item.size}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className={totalPrice}>
                <p>Tổng tiền</p>
                <p>{total} VND</p>
            </div>
            <div className={checkBtn}>
                <div className={btnCheckOn}>
                    <input
                        type='radio'
                        id='qr'
                        name='fav_language'
                        value='qr'
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label htmlFor='qr'>Thanh toán bàng mã QR</label>
                </div>

                <div className={btnCheckOn}>
                    <input
                        type='radio'
                        id='cod'
                        name='fav_language'
                        value='cod'
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        disabled={total > 1000000}
                    />
                    <label htmlFor='cod'>Thanh toán khi nhận hàng</label>
                </div>
            </div>

            <MyButton content={'ĐẶT HÀNG'} onClick={handlePlaceOrderClick} />
            <PaymentMethord />
        </div>
    );
}

export default RightBody;
