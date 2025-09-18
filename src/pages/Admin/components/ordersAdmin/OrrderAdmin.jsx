import { useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import styles from './styles.module.scss';
import { getAllOrderAdmin, updateOrderStatus } from '@/apis/orderService';

function OrderAdmin() {
    const {
        container,
        topBarResponsive,
        tabRow,
        statusBtn,
        statusBtnActive,
        rightActions,
        controlRow,
        searchInput,
        selectInput,
        card,
        tableWrap,
        table,
        actionsCell,
        confirmLink,
        deleteLink,
        badgePending,
        badgeProcessing,
        badgeShipped,
        badgeDelivered,
        badgeCancelled,
        // NEW: pagination styles
        paginationBar,
        pageControls,
        pageBtn,
        pageInfo,
        pageSizeSelect
    } = styles;

    const token = Cookies.get('token');

    const [orders, setOrders] = useState([]);
    const [activeStatus, setActiveStatus] = useState('all');
    const [loading, setLoading] = useState(false);

    // Tìm kiếm + sắp xếp (đã có trước đó)
    const [sortBy, setSortBy] = useState('date_desc'); // date_desc | date_asc | name_asc
    const [search, setSearch] = useState('');

    // NEW: Phân trang (client-side)
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const fetchOrders = async (status) => {
        setLoading(true);
        try {
            let queryStatus = status;
            if (status === 'pending') queryStatus = ['pending', 'completed'];
            if (status === 'all') queryStatus = undefined;
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
        // reset về trang 1 khi đổi tab
        setPage(1);
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

    // Lọc + sắp xếp
    const filteredSorted = useMemo(() => {
        let list = [...orders];

        const q = search.trim().toLowerCase();
        if (q) {
            list = list.filter((o) => {
                const code = (o.code || (o._id ? o._id.slice(-6) : '') || '')
                    .toString()
                    .toLowerCase();
                const email = (o.email || '').toString().toLowerCase();
                const phone = (
                    o.phone ||
                    o.phoneNumber ||
                    o.mobile ||
                    o.tel ||
                    ''
                )
                    .toString()
                    .toLowerCase();
                return (
                    code.includes(q) || email.includes(q) || phone.includes(q)
                );
            });
        }

        list.sort((a, b) => {
            const nameA = (
                [a.firstName, a.lastName].filter(Boolean).join(' ') ||
                a.name ||
                ''
            ).toLowerCase();
            const nameB = (
                [b.firstName, b.lastName].filter(Boolean).join(' ') ||
                b.name ||
                ''
            ).toLowerCase();
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

            if (sortBy === 'name_asc') return nameA.localeCompare(nameB);
            if (sortBy === 'date_asc') return timeA - timeB;
            return timeB - timeA; // date_desc
        });

        return list;
    }, [orders, search, sortBy]);

    // Tính trang hiện tại
    const totalItems = filteredSorted.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    // Nếu thay đổi lọc/sort/search làm số trang giảm, đảm bảo trang hiện tại hợp lệ
    useEffect(() => {
        setPage(1);
    }, [search, sortBy]);

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [totalPages, page]);

    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const pageItems = useMemo(
        () => filteredSorted.slice(startIndex, endIndex),
        [filteredSorted, startIndex, endIndex]
    );

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

    return (
        <div className={container}>
            {/* Tabs + GIỮ NGUYÊN 2 NÚT CŨ */}
            <div className={topBarResponsive}>
                <div className={tabRow}>
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            type='button'
                            className={`${statusBtn} ${activeStatus === t.key ? statusBtnActive : ''}`}
                            onClick={() => setActiveStatus(t.key)}
                            disabled={loading && activeStatus === t.key}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <div className={rightActions}>
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

            {/* Tìm kiếm + sắp xếp */}
            <div className={`${card} ${controlRow}`}>
                <input
                    className={searchInput}
                    type='text'
                    placeholder='Tìm theo mã đơn / email / SĐT…'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className={selectInput}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value='date_desc'>Ngày: Mới → Cũ</option>
                    <option value='date_asc'>Ngày: Cũ → Mới</option>
                    <option value='name_asc'>Tên: A → Z</option>
                </select>
            </div>

            {/* Bảng + phân trang */}
            <div className={card}>
                <div className={tableWrap}>
                    {loading ? (
                        <p>Đang tải...</p>
                    ) : (
                        <>
                            <table className={table}>
                                <thead>
                                    <tr>
                                        <th>Order</th>
                                        <th>Khách hàng</th>
                                        <th className='hide-sm'>Địa chỉ</th>
                                        <th>Email</th>
                                        <th className='hide-sm'>SĐT</th>
                                        <th>Tổng tiền</th>
                                        <th>Trạng thái</th>
                                        <th className={actionsCell}>
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pageItems.map((item) => {
                                        const fullName =
                                            [item.firstName, item.lastName]
                                                .filter(Boolean)
                                                .join(' ') ||
                                            item.name ||
                                            '';
                                        const code =
                                            item.code ||
                                            (item._id
                                                ? item._id.slice(-6)
                                                : '');
                                        const phone =
                                            item.phone ||
                                            item.phoneNumber ||
                                            item.mobile ||
                                            item.tel ||
                                            '';
                                        return (
                                            <tr key={item._id}>
                                                <td>#{code}</td>
                                                <td>{fullName}</td>
                                                <td className='hide-sm'>
                                                    {item.cities ||
                                                        item.address ||
                                                        ''}
                                                </td>
                                                <td>{item.email}</td>
                                                <td className='hide-sm'>
                                                    {phone}
                                                </td>
                                                <td>{item.totalAmount}</td>
                                                <td>
                                                    {statusLabel(item.status)}
                                                </td>
                                                <td className={actionsCell}>
                                                    {nextStatusForConfirm(
                                                        item.status
                                                    ) && (
                                                        <button
                                                            type='button'
                                                            className={
                                                                confirmLink
                                                            }
                                                            onClick={() =>
                                                                handleConfirm(
                                                                    item
                                                                )
                                                            }
                                                        >
                                                            Xác nhận
                                                        </button>
                                                    )}
                                                    {(item.status ===
                                                        'pending' ||
                                                        item.status ===
                                                            'completed') && (
                                                        <button
                                                            type='button'
                                                            className={
                                                                deleteLink
                                                            }
                                                            onClick={() =>
                                                                handleCancel(
                                                                    item
                                                                )
                                                            }
                                                        >
                                                            Hủy
                                                        </button>
                                                    )}
                                                    {/* KHÔNG đụng vào nút In gốc của bạn */}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {!loading && pageItems.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                style={{ textAlign: 'center' }}
                                            >
                                                Không có đơn nào
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination bar */}
                            <div
                                className={paginationBar}
                                aria-label='Phân trang đơn hàng'
                            >
                                <div className={pageInfo}>
                                    Hiển thị{' '}
                                    <b>
                                        {totalItems ? startIndex + 1 : 0}-
                                        {endIndex}
                                    </b>{' '}
                                    / <b>{totalItems}</b> đơn
                                </div>
                                <div className={pageControls}>
                                    <button
                                        type='button'
                                        className={pageBtn}
                                        onClick={() => setPage(1)}
                                        disabled={page === 1}
                                        aria-label='Trang đầu'
                                    >
                                        «
                                    </button>
                                    <button
                                        type='button'
                                        className={pageBtn}
                                        onClick={() =>
                                            setPage((p) => Math.max(1, p - 1))
                                        }
                                        disabled={page === 1}
                                        aria-label='Trang trước'
                                    >
                                        Trước
                                    </button>

                                    <span>
                                        Trang {page}/{totalPages}
                                    </span>

                                    <button
                                        type='button'
                                        className={pageBtn}
                                        onClick={() =>
                                            setPage((p) =>
                                                Math.min(totalPages, p + 1)
                                            )
                                        }
                                        disabled={page === totalPages}
                                        aria-label='Trang sau'
                                    >
                                        Sau
                                    </button>
                                    <button
                                        type='button'
                                        className={pageBtn}
                                        onClick={() => setPage(totalPages)}
                                        disabled={page === totalPages}
                                        aria-label='Trang cuối'
                                    >
                                        »
                                    </button>

                                    <select
                                        className={pageSizeSelect}
                                        value={pageSize}
                                        onChange={(e) => {
                                            setPage(1);
                                            setPageSize(Number(e.target.value));
                                        }}
                                        aria-label='Số dòng mỗi trang'
                                    >
                                        <option value='10'>10 / trang</option>
                                        <option value='20'>20 / trang</option>
                                        <option value='50'>50 / trang</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrderAdmin;
