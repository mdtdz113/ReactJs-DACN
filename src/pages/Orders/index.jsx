import { useEffect } from 'react';
import { getDetailOrder } from '@/apis/orderService';
import { useLocation } from 'react-router-dom';

function Order() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const id = params.get('id');
    const totalAmount = params.get('totalAmount');

    const qrCodeImage = ` https://qr.sepay.vn/img?acc=VQRQADQRQ2046&bank=MBBank&amount=${totalAmount}&des=${id}`;
    const handleGetDetailOrder = async () => {
        try {
            const res = await getDetailOrder(
                `a0b7b48b-a2b2-4e9f-9958-53a503369a9f`
            );
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        handleGetDetailOrder();
    }, []);
    return (
        <div>
            <img src={qrCodeImage} alt='' />
        </div>
    );
}

export default Order;
