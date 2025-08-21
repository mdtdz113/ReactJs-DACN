import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import ListproductOrder from '@/pages/ViewOrder/components/ListProductOrder';
import { getDetailProduct } from '@/apis/productServer';
import { IoMdReturnLeft } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

function DetaiOrder({ order, onClose }) {
    const { container, left, contentText, tiles, des, right, Iconreturn } =
        styles;

    const [detailedProducts, setDetailedProducts] = useState([]);

    useEffect(() => {
        if (order?.items && Array.isArray(order.items)) {
            const fetchAllProductDetails = async () => {
                try {
                    const productDetailsPromises = order.items.map(
                        async (item) => {
                            const productInfo = await getDetailProduct(
                                item.productId
                            );
                            return {
                                ...item,
                                ...productInfo,
                                price: item.price,
                                quantity: item.quantity
                            };
                        }
                    );
                    const fetchedProducts = await Promise.all(
                        productDetailsPromises
                    );
                    setDetailedProducts(fetchedProducts);
                } catch (error) {
                    console.error('Failed to fetch product details:', error);
                }
            };
            fetchAllProductDetails();
        }
    }, [order]);

    if (!order || detailedProducts.length === 0) {
        return <div>Đang tải chi tiết đơn hàng...</div>;
    }

    const cancelOrder = () => {
        navigate('/ViewOrder');
    };

    return (
        <div className={container}>
            <div className={left}>
                <div className={contentText}>
                    <div className={tiles}>Full Name:</div>
                    <div className={des}>
                        {order.firstName} {order.lastName}
                    </div>
                </div>
                <div className={contentText}>
                    <div className={tiles}>Address:</div>
                    <div className={des}>
                        {order.country}, {order.cities}, {order.state},{' '}
                        {order.street}
                    </div>
                </div>
                <div className={contentText}>
                    <div className={tiles}>Email:</div>
                    <div className={des}>{order.email}</div>
                </div>
                <div className={contentText}>
                    <div className={tiles}>Phone:</div>
                    <div className={des}>{order.phone}</div>
                </div>
                <div className={contentText}>
                    <div className={tiles}>Status:</div>
                    <div className={des}>
                        {order.status === 'pending' ? (
                            <span>Chưa thanh toán</span>
                        ) : (
                            <span>Đã thanh toán</span>
                        )}
                    </div>
                </div>
                <div className={contentText}>
                    <div className={tiles}>Total:</div>
                    <div className={des}>{order.totalAmount}</div>
                </div>
                <div className={contentText}>
                    <div className={tiles}>Creation date:</div>
                    <div className={des}>{order.createdAt}</div>
                </div>
                <div className={contentText}>
                    <div className={tiles}>ZipCode:</div>
                    <div className={des}>{order.zipCode}</div>
                </div>

                <div onClick={onClose}>
                    <IoMdReturnLeft className={Iconreturn} />
                </div>
            </div>

            {/* Hiển thị danh sách sản phẩm đã được tải chi tiết */}
            <div className={right}>
                <ListproductOrder products={detailedProducts} />
            </div>
        </div>
    );
}

export default DetaiOrder;
