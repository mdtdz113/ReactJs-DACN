import { useLocation, useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import { useEffect, useRef, useState } from 'react';
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
    const navigate = useNavigate();

    const id = params.get('id');
    const totalAmount = params.get('totalAmount');

    // ❗️Bỏ dấu cách thừa trước URL
    const qrCodeImage = `https://qr.sepay.vn/img?acc=VQRQADQRQ2046&bank=MBBank&amount=${totalAmount}&des=${id}`;

    const [isSuccess, setIsSuccess] = useState(false);
    const timerRef = useRef(null);
    const mountedRef = useRef(true);

    const handleGetDetailOrder = async () => {
        if (!id) return;
        try {
            const res = await getDetailOrder(id);
            const status = res?.data?.data?.status;

            // Cập nhật cờ success (nếu bạn cần hiển thị trong UI)
            setIsSuccess(status === 'success');

            // Khi khác pending => dừng poll và điều hướng
            if (status && status !== 'pending') {
                if (timerRef.current) clearInterval(timerRef.current);

                // Điều hướng theo từng trạng thái
                if (status === 'success' || status === 'delivered') {
                    navigate(`/order-success?id=${id}`);
                } else if (status === 'processing' || status === 'shipped') {
                    // tuỳ ý: có thể điều hướng sang trang “đang xử lý”
                    navigate(`/order-processing?id=${id}`);
                } else if (status === 'cancelled' || status === 'failed') {
                    navigate(`/order-failed?id=${id}`);
                } else {
                    // fallback
                    navigate(`/ViewOrder`);
                }
            }
        } catch (error) {
            console.error(error);
            // tuỳ ý: có thể điều hướng sang trang lỗi
            // navigate('/error');
        }
    };

    useEffect(() => {
        mountedRef.current = true;

        // Gọi ngay 1 lần khi mount
        handleGetDetailOrder();

        // Sau đó poll mỗi 5s
        timerRef.current = setInterval(handleGetDetailOrder, 5000);

        // Cleanup khi unmount
        return () => {
            mountedRef.current = false;
            if (timerRef.current) clearInterval(timerRef.current);
        };
        // Nếu id thay đổi, khởi động poll lại
    }, [id]);

    return (
        <div className={container}>
            <div className={containerLeft}>
                <div>Mã QR để thanh toán</div>
                <img src={qrCodeImage} alt='QR for payment' />
                <p>Sử dụng ứng dụng ngân hàng để quét mã QR</p>
            </div>

            <div className={containerRight}>
                <h3>Chi tiết thanh toán</h3>
                <div className={BorderBox}>
                    <div className={contentIagme}>
                        <div className={itemIagme}>
                            <img
                                src='https://icolor.vn/wp-content/uploads/2024/08/mbbank-logo-5.png'
                                alt='MB Bank'
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
                        <div className={titleDes}>0889535303</div>
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
