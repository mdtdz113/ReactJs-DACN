import { getAllOrderAdmin, updateOrderStatus } from '@/apis/orderService';
import Cookies from 'js-cookie';
import { useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss';

function OrderAdmin() {
    const {
        ListOrders,
        topBar,
        statusBtn,
        statusBtnActive,
        actionsCell,
        confirmLink,
        deleteLink,
        badgePending,
        badgeProcessing,
        badgeShipped,
        badgeDelivered,
        badgeCancelled
    } = styles;

    const [orders, setOrders] = useState([]);
    const [activeStatus, setActiveStatus] = useState('pending');
    const [loading, setLoading] = useState(false);
    const token = Cookies.get('token');

    const fetchOrders = async (status) => {
        setLoading(true);
        try {
            let queryStatus = status;
            if (status === 'pending') {
                queryStatus = ['pending', 'completed'];
            }
            const { data } = await getAllOrderAdmin(token, {
                status: queryStatus
            });
            setOrders(data?.data || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(activeStatus);
    }, [activeStatus]);

    const statusLabel = (s) => {
        switch (s) {
            case 'pending':
                return <span className={badgePending}>Chờ xử lý</span>;
            case 'completed':
                return <span className={badgePending}>Đã thanh toán</span>;
            case 'processing':
                return <span className={badgeProcessing}>Đang xử lý</span>;
            case 'shipped':
                return <span className={badgeShipped}>Đã gửi hàng</span>;
            case 'delivered':
                return <span className={badgeDelivered}>Đã giao hàng</span>;
            case 'cancelled':
                return <span className={badgeCancelled}>Đã hủy</span>;
            default:
                return <span>{s}</span>;
        }
    };

    const nextStatusForConfirm = (current) => {
        if (current === 'pending' || current === 'completed')
            return 'processing';
        if (current === 'processing') return 'shipped';
        if (current === 'shipped') return 'delivered';
        return null;
    };

    // const nextTabAfterConfirm = (next) =>
    //     next === 'processing'
    //         ? 'processing'
    //         : next === 'shipped'
    //           ? 'shipped'
    //           : activeStatus;
    const nextTabAfterConfirm = (next) => next;
    const handleConfirm = async (order) => {
        const next = nextStatusForConfirm(order.status);
        if (!next) return;
        const snapshot = [...orders];
        setOrders((lst) =>
            lst.map((o) => (o._id === order._id ? { ...o, status: next } : o))
        );
        try {
            await updateOrderStatus(order._id, next, token);
            const toTab = nextTabAfterConfirm(next);
            setActiveStatus(toTab);
            fetchOrders(toTab);
        } catch {
            setOrders(snapshot);
            alert('Cập nhật trạng thái thất bại');
        }
    };

    const handleCancel = async (order) => {
        const snapshot = [...orders];
        setOrders((lst) =>
            lst.map((o) =>
                o._id === order._id ? { ...o, status: 'cancelled' } : o
            )
        );
        try {
            await updateOrderStatus(order._id, 'cancelled', token);
            setActiveStatus('cancelled');
            fetchOrders('cancelled');
        } catch {
            setOrders(snapshot);
            alert('Hủy đơn thất bại');
        }
    };

    const tabs = useMemo(
        () => [
            { key: 'pending', label: 'Chờ xử lý' },
            { key: 'processing', label: 'Đang xử lý' },
            { key: 'shipped', label: 'Đã gửi hàng' },
            { key: 'delivered', label: 'Đã giao hàng' },
            { key: 'cancelled', label: 'Đã hủy' }
        ],
        []
    );

    console.log(orders);
    return (
        <div>
            <div className={topBar}>
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        className={`${statusBtn} ${activeStatus === t.key ? statusBtnActive : ''}`}
                        onClick={() => setActiveStatus(t.key)}
                        disabled={loading && activeStatus === t.key}
                        type='button'
                    >
                        {t.label}
                    </button>
                ))}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                    <button
                        type='button'
                        onClick={() =>
                            window.open(
                                '/admin/orders/invoices?status=completed',
                                '_blank'
                            )
                        }
                    >
                        Đã thanh toán
                    </button>
                    <button
                        type='button'
                        onClick={() =>
                            window.open(
                                '/admin/orders/invoices?status=pending',
                                '_blank'
                            )
                        }
                    >
                        Chưa thanh toán
                    </button>
                </div>
            </div>

            <div className={ListOrders}>
                {loading ? (
                    <p>Đang tải...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Khách hàng</th>
                                <th>Địa chỉ</th>
                                <th>Email</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th className={actionsCell}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((item) => (
                                <tr key={item._id}>
                                    <td>#{item.code || item._id.slice(-6)}</td>
                                    <td>
                                        {item.firstName} {item.lastName}
                                    </td>
                                    <td>{item.cities}</td>
                                    <td>{item.email}</td>
                                    <td>{item.totalAmount}</td>
                                    <td>{statusLabel(item.status)}</td>
                                    <td className={actionsCell}>
                                        {nextStatusForConfirm(item.status) && (
                                            <button
                                                className={confirmLink}
                                                onClick={() =>
                                                    handleConfirm(item)
                                                }
                                            >
                                                Xác nhận
                                            </button>
                                        )}
                                        <button
                                            className={deleteLink}
                                            type='button'
                                            onClick={() => handleCancel(item)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        style={{ textAlign: 'center' }}
                                    >
                                        Không có đơn nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
export default OrderAdmin;
