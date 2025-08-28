// src/pages/BulkInvoicesPage/index.jsx
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getAllOrderAdmin } from '@/apis/orderService';

import './bulk-invoices.scss';
import { getDetailProduct } from '@/apis/productServer';

// ===== Helpers tiền tệ =====
const toInt = (v) => {
    if (v === 0 || v === '0') return 0;
    if (typeof v === 'number') return v;
    if (v == null) return 0;
    const digits = String(v).replace(/[^\d]/g, '');
    return digits ? parseInt(digits, 10) : 0;
};
const VND = (n) =>
    new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(toInt(n));

// ===== Helpers hiển thị tên sản phẩm =====
const shortId = (id) => {
    if (!id) return '—';
    const s = String(id);
    return s.length > 12 ? `${s.slice(0, 6)}…${s.slice(-4)}` : s;
};
const productLabelFallback = (it) =>
    `Mã: ${shortId(it?.productId)}${it?.size ? ` | Size: ${it.size}` : ''}`;

// Cache tên theo productId để tránh gọi trùng
const productNameCache = new Map();

// Lấy tên sản phẩm theo productId (nhiều backend có cấu trúc khác nhau)
const fetchProductName = async (productId) => {
    if (!productId) return null;
    if (productNameCache.has(productId)) return productNameCache.get(productId);
    try {
        const res = await getDetailProduct(productId);
        const name =
            res?.data?.name ??
            res?.data?.data?.name ??
            res?.name ??
            res?.title ??
            res?.productName ??
            null;
        productNameCache.set(productId, name || null);
        return name || null;
    } catch {
        productNameCache.set(productId, null);
        return null;
    }
};

// Gắn name vào items của mỗi order dựa theo productId
const attachProductNames = async (orders) => {
    const ids = Array.from(
        new Set(
            orders.flatMap((o) =>
                (Array.isArray(o.items) ? o.items : [])
                    .map((it) => it?.productId)
                    .filter(Boolean)
            )
        )
    );
    await Promise.all(ids.map((id) => fetchProductName(id)));
    return orders.map((o) => ({
        ...o,
        items: (Array.isArray(o.items) ? o.items : []).map((it) => ({
            ...it,
            name: it?.name ?? productNameCache.get(it?.productId) ?? null
        }))
    }));
};

// ===== Thông tin nơi gửi cố định (in trên hóa đơn) =====
const sender = {
    name: 'CÔNG TY XSTORE',
    address: '123 CAU GIAY HA NOI',
    phone: '0889535303',
    tax: 'MST: 0312xxxxxx'
};

export default function BulkInvoicesPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);

    // ?status=pending | completed | pending+completed
    const status = (params.get('status') || 'pending').trim();
    const token = Cookies.get('token');

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const statusList = useMemo(
        () =>
            status
                .split('+')
                .map((s) => s.trim())
                .filter(Boolean),
        [status]
    );

    // Tải danh sách đơn theo status, rồi gắn tên sản phẩm
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                let all = [];
                for (const s of statusList) {
                    const { data } = await getAllOrderAdmin(token, {
                        status: s
                    });
                    all = all.concat(data?.data || []);
                }
                // loại trùng theo _id
                const uniq = Array.from(
                    new Map(all.map((o) => [o._id, o])).values()
                );
                // gắn name sản phẩm theo productId
                const withNames = await attachProductNames(uniq);
                setOrders(withNames);
            } finally {
                setLoading(false);
            }
        })();
    }, [status, token, statusList.length]);

    // Tự động bật hộp thoại in sau khi load xong (có thể bỏ nếu không muốn)
    useEffect(() => {
        if (!loading && orders.length) {
            setTimeout(() => window.print(), 300);
        }
    }, [loading, orders.length]);

    if (loading) {
        return (
            <div className='bulk-wrap'>
                <p>Đang tải đơn hàng...</p>
            </div>
        );
    }
    if (!orders.length) {
        return (
            <div className='bulk-wrap'>
                <div className='no-print toolbar'>
                    <button onClick={() => window.print()}>In</button>
                    <button
                        onClick={() =>
                            navigate('/admin/orders/invoices?status=completed')
                        }
                    >
                        Đã thanh toán
                    </button>
                    <button
                        onClick={() =>
                            navigate('/admin/orders/invoices?status=pending')
                        }
                    >
                        Chưa thanh toán
                    </button>
                    <button
                        onClick={() =>
                            navigate(
                                '/admin/orders/invoices?status=pending+completed'
                            )
                        }
                    >
                        In tất cả
                    </button>
                </div>
                <p>Không có đơn để in</p>
            </div>
        );
    }

    return (
        <div className='bulk-wrap'>
            {/* Toolbar (không in) */}
            <div className='no-print toolbar'>
                <button onClick={() => window.print()}>In</button>
                <button
                    onClick={() =>
                        navigate('/admin/orders/invoices?status=completed')
                    }
                >
                    Đã thanh toán
                </button>
                <button
                    onClick={() =>
                        navigate('/admin/orders/invoices?status=pending')
                    }
                >
                    Chưa thanh toán
                </button>
                <button
                    onClick={() =>
                        navigate(
                            '/admin/orders/invoices?status=pending+completed'
                        )
                    }
                >
                    In tất cả
                </button>
            </div>

            {orders.map((order) => {
                const fullName =
                    `${order.firstName || ''} ${order.lastName || ''}`.trim();
                const receiverAddress = [
                    order.street,
                    order.state,
                    order.cities,
                    order.country
                ]
                    .filter(Boolean)
                    .join(', ');

                // Danh sách sản phẩm
                const items = Array.isArray(order.items) ? order.items : [];

                // Tính tạm tính từ items
                const subTotal = items.reduce((sum, it) => {
                    const price = toInt(it?.price);
                    const qty = toInt(it?.quantity) || 1;
                    return sum + price * qty;
                }, 0);

                // Phí ship / giảm giá
                const shipping = toInt(order?.shippingFee);
                const discount = toInt(
                    order?.discountAmount || order?.discount
                );

                // Tổng tiền từ backend (nếu có), fallback: sub + ship - discount
                const totalFromBackend = toInt(order?.totalAmount);
                const computedTotal = Math.max(
                    0,
                    subTotal + shipping - discount
                );

                // Chỉ coi là view "đã thanh toán" khi status = 'completed' (không kèm pending)
                const isPaidView =
                    statusList.length === 1 && statusList[0] === 'completed';

                // Theo yêu cầu: completed -> hiển thị 0; pending -> hiển thị bình thường
                const displayedSubTotal = isPaidView ? 0 : subTotal;
                const baseGrand = totalFromBackend || computedTotal;
                const displayedGrand = isPaidView ? 0 : baseGrand;

                return (
                    <div className='invoice a4' key={order._id}>
                        <header className='inv-header'>
                            <div>
                                <h1>HÓA ĐƠN BÁN HÀNG</h1>
                                <p>
                                    Mã đơn hàng:{' '}
                                    <b>{order.code || order._id}</b>
                                </p>
                                <p>
                                    Ngày:{' '}
                                    {new Date(
                                        order.createdAt || Date.now()
                                    ).toLocaleString('vi-VN')}
                                </p>
                                {order?.paymentInfo?.paidAt && (
                                    <p>
                                        Đã thanh toán lúc:{' '}
                                        {new Date(
                                            order.paymentInfo.paidAt
                                        ).toLocaleString('vi-VN')}
                                    </p>
                                )}
                            </div>
                            <div className='inv-brand'>
                                <div className='brand-name'>{sender.name}</div>
                                <div>{sender.address}</div>
                                <div>Điện thoại: {sender.phone}</div>
                                <div>{sender.tax}</div>
                            </div>
                        </header>

                        <section className='inv-parties'>
                            <div className='party'>
                                <div className='party-title'>
                                    Nơi gửi (cố định)
                                </div>
                                <div>
                                    <b>{sender.name}</b>
                                </div>
                                <div>{sender.address}</div>
                                <div>Điện thoại: {sender.phone}</div>
                                <div>{sender.tax}</div>
                            </div>
                            <div className='party'>
                                <div className='party-title'>Nơi nhận</div>
                                <div>
                                    <b>{fullName || 'Khách hàng'}</b>
                                </div>
                                <div>{receiverAddress || '—'}</div>
                                <div>Email: {order.email || '—'}</div>
                                <div>Điện thoại: {order.phone || '—'}</div>
                            </div>
                        </section>

                        <section className='inv-items'>
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{ width: '8%' }}>#</th>
                                        <th>Sản phẩm</th>
                                        <th style={{ width: '14%' }}>
                                            Đơn giá
                                        </th>
                                        <th style={{ width: '6%' }}>SL</th>
                                        <th style={{ width: '6%' }}>Size</th>
                                        <th style={{ width: '16%' }}>
                                            Thành tiền
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((it, idx) => {
                                        const price = toInt(it?.price);
                                        const qty = toInt(it?.quantity) || 1;
                                        const lineTotal = price * qty;
                                        // Hiển thị tên từ API; nếu không có thì fallback productId + size
                                        const name =
                                            it?.name ||
                                            it?.productName ||
                                            productLabelFallback(it);

                                        const size = it?.size;
                                        return (
                                            <tr key={`${order._id}-${idx}`}>
                                                <td>{idx + 1}</td>
                                                <td>{name}</td>
                                                <td
                                                    style={{
                                                        textAlign: 'right'
                                                    }}
                                                >
                                                    {VND(price)}
                                                </td>
                                                <td
                                                    style={{
                                                        textAlign: 'right'
                                                    }}
                                                >
                                                    {qty}
                                                </td>
                                                <td>{size}</td>
                                                <td
                                                    style={{
                                                        textAlign: 'right'
                                                    }}
                                                >
                                                    {VND(lineTotal)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {items.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                style={{ textAlign: 'center' }}
                                            >
                                                Không có sản phẩm
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </section>

                        <section className='inv-total'>
                            <div className='total-line'>
                                <span>Tạm tính</span>
                                <b>{VND(displayedSubTotal)}</b>
                            </div>

                            {shipping ? (
                                <div className='total-line'>
                                    <span>Phí vận chuyển</span>
                                    <b>{VND(isPaidView ? 0 : shipping)}</b>
                                </div>
                            ) : null}

                            {discount ? (
                                <div className='total-line'>
                                    <span>Giảm giá</span>
                                    <b>
                                        {isPaidView
                                            ? '-₫0'
                                            : `-${VND(discount)}`}
                                    </b>
                                </div>
                            ) : null}

                            <div className='total-line grand'>
                                <span>Tổng tiền</span>
                                <b>{VND(displayedGrand)}</b>
                            </div>
                        </section>

                        <footer className='inv-footer'>
                            <div>Người bán hàng</div>
                            <div>Người mua hàng</div>
                        </footer>
                    </div>
                );
            })}
        </div>
    );
}
