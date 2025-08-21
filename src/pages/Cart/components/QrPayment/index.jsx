import { useLocation } from 'react-router-dom';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { getDetailOrder } from '@/apis/orderService';

function QrPayment() {
    const {
        container,
        containerRight,
        itemIagme,
        contentIagme,
        itemIagmeText,
        BorderBox,
        contentText,
        titleName,
        titleDes,
        titleNameND,
        containerLeft
    } = styles;
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const [isSuccess, setIsSucess] = useState(false);

    const id = params.get('id');
    const totalAmount = params.get('totalAmount');

    const qrCodeImage = ` https://qr.sepay.vn/img?acc=VQRQADQRQ2046&bank=MBBank&amount=${totalAmount}&des=${id}`;

    let interval;

    const handleGetDetailOrder = async () => {
        if (!id) return;

        try {
            const res = await getDetailOrder(id);
            if(res.data.data.status !== 'pending'){
                clearInterval(interval);
            }

            if(res.data.data.status === 'success'){
                setIsSucess(true);
            }else{
                setIsSucess(false);
            }
            console.log(res)
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        interval = setInterval(() => {
            handleGetDetailOrder();
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, []);
    return (
        <div className={container}>
            <div className={containerLeft}>
                <div>Mã QR để thanh toán</div>
                <img src={qrCodeImage} alt='' />
                <p>Sửa dụng ứng dụng ngân hàng để quét mã qr</p>
            </div>
            <div className={containerRight}>
                <h3>Chi tiết thanh toán</h3>
                <div className={BorderBox}>
                    <div className={contentIagme}>
                        <div className={itemIagme}>
                            <img
                                src='https://icolor.vn/wp-content/uploads/2024/08/mbbank-logo-5.png'
                                alt=''
                            />
                        </div>
                        <div>
                            <p className={itemIagmeText}>MB Bank</p>
                            <p>Chuyển khoản ngân hàng</p>
                        </div>
                    </div>
                    <div className={contentText}>
                        <div className={titleName}>Chủ tài khoản</div>
                        <div className={titleDes}>MAI DINH TRUONG</div>
                    </div>

                    <div className={contentText}>
                        <div className={titleName}>Số tài khoản</div>
                        <div className={titleDes}>eafsefedfse</div>
                    </div>

                    <div className={contentText}>
                        <div className={titleName}>Số tiền</div>
                        <div className={titleDes}>{totalAmount} VND</div>
                    </div>

                    <div className={contentText}>
                        <div className={titleName}>Nội dung chuyển khoản</div>
                        <div className={titleNameND}>{id}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QrPayment;
