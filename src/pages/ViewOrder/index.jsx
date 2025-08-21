import MyHeader from '@components/Header/Header';
import { OurShopProvider } from '@/context/OurShopProvider';
import Cookies from 'js-cookie';
import { getAllOrder } from '@/apis/orderService';
import { useEffect, useState } from 'react';
import MainLayout from '@components/Layout/Layout';
import styles from './styles.module.scss';
import MyFooter from '@components/Footer/Footer';
import { getOrderById } from '@/apis/orderService';
import DetaiOrder from '@/pages/ViewOrder/components/DetailOrder';
import { deleteOrder } from '@/apis/orderService';

function ViewOrder() {
    const {
        container,
        functionbox,
        specialText,
        btnBack,
        BannerOrder,
        ListOrders,
        status
    } = styles;

    const [orders, setOrders] = useState([]);
    const handleBackPreviousPage = () => {
        window.history.back();
    };
    const [isOpenTable, setIsOpenTable] = useState(false);
    const [orderById, setOrderById] = useState([]);
    const [productOrder, setProductOrder] = useState([]);
    const fetchOrders = () => {
        const token = Cookies.get('token');
        if (!token) {
            console.error('Không tìm thấy token!');
            return;
        }

        getAllOrder(token)
            .then((res) => {
                setOrders(res.data.data);
            })
            .catch((err) => console.error(err));
    };
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrderById = (id) => {
        const token = Cookies.get('token');
        if (!token) {
            console.log('Không tin=mf thấy token');
            return;
        }

        getOrderById(token, id)
            .then((res) => {
                setOrderById(res.data.data);
                setIsOpenTable(true);
            })
            .catch((err) => console.error(err));
    };

    const deleteOrderById = (id) => {
        const token = Cookies.get('token');
        if (!token) {
            console.log('Không tim thấy token');
            return;
        }
        deleteOrder(token, id);
        fetchOrders();
    };

    return (
        <OurShopProvider>
            <div>
                <MyHeader />

                <MainLayout>
                    {' '}
                    <div className={container}>
                        <div className={functionbox}>
                            <div>
                                {' '}
                                Home &gt;{' '}
                                <span className={specialText}>Order</span>
                            </div>
                            <div
                                className={btnBack}
                                onClick={() => handleBackPreviousPage()}
                            >
                                {' '}
                                Return to previous page{' '}
                            </div>
                        </div>

                        <div className={BannerOrder}>
                            <img
                                src='https://xstore.b-cdn.net/elementor2/marseille04/wp-content/uploads/sites/2/2022/12/Background.jpeg'
                                alt=''
                            />
                        </div>

                        {!isOpenTable ? (
                            <div className={ListOrders}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Address</th>
                                            <th>Email</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                            <th>Detail</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    {item.firstName}{' '}
                                                    {item.lastName}
                                                </td>
                                                <td>{item.cities}</td>
                                                <td>{item.email}</td>
                                                <td>{item.totalAmount}</td>
                                                <td>
                                                    {item.status ===
                                                        'pending' && (
                                                        <span>Chờ xử lý</span>
                                                    )}
                                                    {item.status ===
                                                        'processing' && (
                                                        <span>Đang xử lý</span>
                                                    )}
                                                    {item.status ===
                                                        'shipped' && (
                                                        <span>Đã gửi hàng</span>
                                                    )}
                                                    {item.status ===
                                                        'delivered' && (
                                                        <span>
                                                            Đã giao hàng
                                                        </span>
                                                    )}
                                                    {item.status ===
                                                        'cancelled' && (
                                                        <span>Đã hủy</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <a
                                                        onClick={() =>
                                                            fetchOrderById(
                                                                item._id
                                                            )
                                                        }
                                                    >
                                                        Xem chi tiết
                                                    </a>
                                                </td>
                                                <td>
                                                    <a
                                                        onClick={() =>
                                                            deleteOrderById(
                                                                item._id
                                                            )
                                                        }
                                                    >
                                                        Xóa
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div>
                                <DetaiOrder
                                    order={orderById}
                                    onClose={() => setIsOpenTable(false)}
                                />
                            </div>
                        )}
                    </div>
                </MainLayout>
            </div>
            <MyFooter />
        </OurShopProvider>
    );
}

export default ViewOrder;
