import { getAllOrderAdmin, updateOrderStatus } from '@/apis/orderService';
import Cookies from 'js-cookie';
import { useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss';
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
        badgeCancelled,
        chartBox
    } = styles;

    const [orders, setOrders] = useState([]);
    const [activeStatus, setActiveStatus] = useState('all'); // mặc định = all
    const [loading, setLoading] = useState(false);
    const token = Cookies.get('token');
    const [chartData, setChartData] = useState([]);
    const [filterType, setFilterType] = useState('day'); // day, month, year, custom
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const fetchOrders = async (status) => {
        setLoading(true);
        try {
            let queryStatus = status;

            if (status === 'pending') {
                queryStatus = ['pending', 'completed'];
            }
            if (status === 'all') {
                queryStatus = undefined;
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

    const handleConfirm = async (order) => {
        const next = nextStatusForConfirm(order.status);
        if (!next) return;
        const snapshot = [...orders];
        setOrders((lst) =>
            lst.map((o) => (o._id === order._id ? { ...o, status: next } : o))
        );
        try {
            await updateOrderStatus(order._id, next, token);
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
            { key: 'all', label: 'Tất cả' },
            { key: 'pending', label: 'Chờ xử lý' },
            { key: 'processing', label: 'Đang xử lý' },
            { key: 'shipped', label: 'Đã gửi hàng' },
            { key: 'delivered', label: 'Đã giao hàng' },
            { key: 'cancelled', label: 'Đã hủy' }
        ],
        []
    );

    useEffect(() => {
        if (!orders || orders.length === 0) return;

        let grouped = {};
        orders.forEach((order) => {
            const date = new Date(order.createdAt);
            let key = '';

            if (filterType === 'day') key = date.toLocaleDateString();
            else if (filterType === 'month')
                key = `${date.getMonth() + 1}/${date.getFullYear()}`;
            else if (filterType === 'year') key = `${date.getFullYear()}`;
            else key = date.toLocaleDateString();

            if (filterType === 'custom' && startDate && endDate) {
                if (date < startDate || date > endDate) return;
            }

            grouped[key] = (grouped[key] || 0) + 1;
        });

        const result = Object.entries(grouped).map(([key, value]) => ({
            label: key,
            count: value
        }));

        setChartData(result);
    }, [orders, filterType, startDate, endDate]);

    return (
        <div style={{ display: 'flex', gap: '20px' , width: '1700px'}}>
            {/* Bảng đơn hàng bên trái */}
            <div style={{ flex: 2 }}>
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

                    <div
                        style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}
                    >
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
                                        <td>
                                            #{item.code || item._id.slice(-6)}
                                        </td>
                                        <td>
                                            {item.firstName} {item.lastName}
                                        </td>
                                        <td>{item.cities}</td>
                                        <td>{item.email}</td>
                                        <td>{item.totalAmount}</td>
                                        <td>{statusLabel(item.status)}</td>
                                        <td className={actionsCell}>
                                            {nextStatusForConfirm(
                                                item.status
                                            ) && (
                                                <button
                                                    className={confirmLink}
                                                    onClick={() =>
                                                        handleConfirm(item)
                                                    }
                                                >
                                                    Xác nhận
                                                </button>
                                            )}
                                            {(item.status === 'pending' ||
                                                item.status ===
                                                    'completed') && (
                                                <button
                                                    className={deleteLink}
                                                    type='button'
                                                    onClick={() =>
                                                        handleCancel(item)
                                                    }
                                                >
                                                    Xóa
                                                </button>
                                            )}
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

            {/* Biểu đồ bên phải */}
            <div className={chartBox} style={{ flex: 1 }}>
                <h3>Thống kê đơn hàng</h3>
                <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value='day'>Theo ngày</option>
                        <option value='month'>Theo tháng</option>
                        <option value='year'>Theo năm</option>
                        <option value='custom'>Khoảng ngày</option>
                    </select>
                    {filterType === 'custom' && (
                        <div style={{ display: 'flex', gap: 10 }}>
                            <DatePicker
                                selected={startDate}
                                onChange={setStartDate}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText='Từ ngày'
                            />
                            <DatePicker
                                selected={endDate}
                                onChange={setEndDate}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText='Đến ngày'
                            />
                        </div>
                    )}
                </div>
                <ResponsiveContainer width='100%' height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid stroke='#ccc' />
                        <XAxis dataKey='label' />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type='monotone'
                            dataKey='count'
                            stroke='#2563eb'
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default OrderAdmin;
