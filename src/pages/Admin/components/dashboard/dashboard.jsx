import { useContext, useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import { OurShopContext } from '@/context/OurShopProvider';
import { getAllUser } from '@/apis/authSercice';
import { getAllOrderAdmin } from '@/apis/orderService';
import { getDetailProduct } from '@/apis/productServer';
import { getActivities } from '@/utils/auditLog';

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar
} from 'recharts';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './styles.module.scss';

// =========================
// Utils
// =========================
function formatVND(n) {
    return (Number(n) || 0).toLocaleString('vi-VN');
}

// Cache tên sản phẩm
const productNameCache = new Map();

async function fetchProductName(productId) {
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
}

async function attachProductNames(orders) {
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
}

// =========================
// Grouping functions
// =========================
function groupRevenue(orders, filterType, startDate, endDate) {
    const m = new Map();
    for (const o of orders) {
        if (o?.status !== 'delivered') continue;
        const d = new Date(o.createdAt || o.updatedAt || Date.now());
        let key = '';

        if (filterType === 'day') key = d.toLocaleDateString('vi-VN');
        else if (filterType === 'month')
            key = `${d.getMonth() + 1}/${d.getFullYear()}`;
        else if (filterType === 'year') key = `${d.getFullYear()}`;
        else key = d.toLocaleDateString('vi-VN');

        if (filterType === 'custom' && startDate && endDate) {
            if (d < startDate || d > endDate) continue;
        }

        const amount = Number(o.totalAmount || o.amounts?.grandTotal || 0);
        m.set(key, (m.get(key) || 0) + amount);
    }
    return Array.from(m.entries()).map(([date, revenue]) => ({
        date,
        revenue
    }));
}

function revenueByMonth(orders, filterType, startDate, endDate) {
    const m = new Map();
    for (const o of orders) {
        if (o?.status !== 'delivered') continue;
        const d = new Date(o.createdAt || o.updatedAt);
        if (filterType === 'custom' && startDate && endDate) {
            if (d < startDate || d > endDate) continue;
        }
        const ymKey =
            filterType === 'year'
                ? `${d.getFullYear()}`
                : `${d.getMonth() + 1}/${d.getFullYear()}`;
        const amount = Number(o.totalAmount || o.amounts?.grandTotal || 0);
        m.set(ymKey, (m.get(ymKey) || 0) + amount);
    }
    return Array.from(m.entries()).map(([date, revenue]) => ({
        date,
        revenue
    }));
}

function topProductsFiltered(orders, filterType, startDate, endDate, topN = 5) {
    const count = new Map();
    for (const o of orders) {
        if (o?.status !== 'delivered') continue;
        const d = new Date(o.createdAt || o.updatedAt);
        if (filterType === 'custom' && startDate && endDate) {
            if (d < startDate || d > endDate) continue;
        }
        for (const it of o.items || []) {
            const pid = it.productId || it.product || it._id;
            const qty = Number(it.qty || it.quantity || it.amount || 0);
            if (!pid || !qty) continue;
            const name = it.name || `Sản phẩm ${String(pid).slice(-6)}`;
            const prev = count.get(pid) || { name, qty: 0 };
            prev.qty += qty;
            prev.name = name;
            count.set(pid, prev);
        }
    }
    return Array.from(count.values())
        .sort((a, b) => b.qty - a.qty)
        .slice(0, topN);
}

// =========================
// Component
// =========================
export default function Dashboard() {
    const token = Cookies.get('token');
    const {
        products,
        total: productsTotal,
        fetchProducts
    } = useContext(OurShopContext);

    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [filterType, setFilterType] = useState('day');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [monthFilterType, setMonthFilterType] = useState('month');
    const [monthStartDate, setMonthStartDate] = useState(null);
    const [monthEndDate, setMonthEndDate] = useState(null);

    const [productFilterType, setProductFilterType] = useState('month');
    const [productStartDate, setProductStartDate] = useState(null);
    const [productEndDate, setProductEndDate] = useState(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const u = await getAllUser();
                const o = await getAllOrderAdmin(token, {});
                if (!products?.length) await fetchProducts?.();
                if (!mounted) return;
                setUsers(u?.data?.data || []);
                const withNames = await attachProductNames(o?.data?.data || []);
                setOrders(withNames);
            } catch (e) {
                console.error(e);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []); // eslint-disable-line

    // KPI
    const kpi = useMemo(() => {
        const usersCount = users.length;
        const productsCount = Number(productsTotal || products?.length || 0);
        const ordersCount = orders.length;

        const todayISO = new Date().toISOString().slice(0, 10);
        let revenueToday = 0,
            revenueMonth = 0;
        const now = new Date();
        const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        for (const o of orders) {
            if (o?.status !== 'delivered') continue;
            const d = new Date(o.createdAt || o.updatedAt || Date.now());
            const iso = d.toISOString().slice(0, 10);
            const ymKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const amount = Number(o.totalAmount || o.amounts?.grandTotal || 0);
            if (iso === todayISO) revenueToday += amount;
            if (ymKey === ym) revenueMonth += amount;
        }
        return {
            usersCount,
            productsCount,
            ordersCount,
            revenueToday,
            revenueMonth
        };
    }, [users, orders, products, productsTotal]);

    // Data series
    const revenueSeries = useMemo(
        () => groupRevenue(orders, filterType, startDate, endDate),
        [orders, filterType, startDate, endDate]
    );
    const revenueMonthSeries = useMemo(
        () =>
            revenueByMonth(
                orders,
                monthFilterType,
                monthStartDate,
                monthEndDate
            ),
        [orders, monthFilterType, monthStartDate, monthEndDate]
    );
    const topProducts = useMemo(
        () =>
            topProductsFiltered(
                orders,
                productFilterType,
                productStartDate,
                productEndDate,
                5
            ),
        [orders, productFilterType, productStartDate, productEndDate]
    );

    // Activities
    const activities = useMemo(() => {
        const logs = getActivities().slice(0, 20);
        if (logs.length) return logs;
        return (orders || []).slice(0, 10).map((o) => ({
            id: o._id,
            at: o.createdAt || o.updatedAt,
            who: 'system',
            type: 'order',
            action: 'Đã tạo',
            meta: { code: o.code || o._id?.slice(-6), amount: o.totalAmount }
        }));
    }, [orders]);

    return (
        <div className={styles.wrapper}>
            {/* KPI */}
            <div className={styles.kpiGrid}>
                <KPI title='Người dùng' value={kpi.usersCount} />
                <KPI title='Sản phẩm' value={kpi.productsCount} />
                <KPI title='Đơn hàng' value={kpi.ordersCount} />
                <KPI
                    title='Doanh thu hôm nay'
                    value={formatVND(kpi.revenueToday) + ' ₫'}
                />
                <KPI
                    title='Doanh thu tháng'
                    value={formatVND(kpi.revenueMonth) + ' ₫'}
                />
            </div>

            {/* Charts */}
            <div className={styles.chartGrid}>
                {/* Doanh thu */}
                <ChartPanel title='Doanh thu'>
                    <FilterBox
                        filterType={filterType}
                        setFilterType={setFilterType}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                    />
                    <ResponsiveContainer width='100%' height='100%'>
                        <LineChart data={revenueSeries}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey='date' />
                            <YAxis />
                            <Tooltip formatter={(v) => `${formatVND(v)} ₫`} />
                            <Line
                                type='monotone'
                                dataKey='revenue'
                                stroke='#2563eb'
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartPanel>

                {/* Doanh thu tháng */}
                {/* <ChartPanel title='Doanh thu tháng'>
                    <FilterBox
                        filterType={monthFilterType}
                        setFilterType={setMonthFilterType}
                        startDate={monthStartDate}
                        setStartDate={setMonthStartDate}
                        endDate={monthEndDate}
                        setEndDate={setMonthEndDate}
                    />
                    <ResponsiveContainer width='100%' height='100%'>
                        <LineChart data={revenueMonthSeries}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey='date' />
                            <YAxis />
                            <Tooltip formatter={(v) => `${formatVND(v)} ₫`} />
                            <Line
                                type='monotone'
                                dataKey='revenue'
                                stroke='#10b981'
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartPanel> */}

                {/* Top sản phẩm */}
                <ChartPanel title='Top sản phẩm bán chạy'>
                    <FilterBox
                        filterType={productFilterType}
                        setFilterType={setProductFilterType}
                        startDate={productStartDate}
                        setStartDate={setProductStartDate}
                        endDate={productEndDate}
                        setEndDate={setProductEndDate}
                    />
                    <ResponsiveContainer width='100%' height='100%'>
                        <BarChart data={topProducts}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey='name' />
                            <YAxis />
                            <Tooltip
                                formatter={(value, name, props) => [
                                    `${value} sản phẩm`,
                                    props.payload.name
                                ]}
                            />
                            <Bar dataKey='qty' fill='#f59e0b' />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartPanel>
            </div>

            {/* Activity & Orders */}
            <div className={styles.bottomGrid}>
                <div className={styles.activityList}>
                    <h3 className={styles.cardTitle}>Nhật ký hoạt động</h3>
                    <ActivityList items={activities} />
                </div>
                <div className={styles.latestOrders}>
                    <h3 className={styles.cardTitle}>Đơn mới nhất</h3>
                    <LatestOrders orders={(orders || []).slice(0, 8)} />
                </div>
            </div>

            {loading && <div className={styles.muted}>Đang tải dữ liệu…</div>}
        </div>
    );
}

// =========================
// Reusable components
// =========================
function KPI({ title, value }) {
    return (
        <div className={styles.kpiCard}>
            <div className={styles.kpiTitle}>{title}</div>
            <div className={styles.kpiValue}>{value}</div>
        </div>
    );
}

function FilterBox({
    filterType,
    setFilterType,
    startDate,
    setStartDate,
    endDate,
    setEndDate
}) {
    return (
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
            >
                <option value='day'>Theo ngày</option>
                <option value='month'>Theo tháng</option>
                <option value='year'>Theo năm</option>
                <option value='custom'>Khoảng thời gian</option>
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
    );
}

function ChartPanel({ title, children }) {
    return (
        <div className={styles.chartPanel}>
            <h3 className={styles.cardTitle}>{title}</h3>
            <div className={styles.chartBody}>{children}</div>
        </div>
    );
}

function ActivityList({ items = [] }) {
    if (!items.length)
        return <div className={styles.muted}>Chưa có hoạt động nào.</div>;
    return (
        <ul className={styles.activityUl}>
            {items.map((a, i) => {
                const when = a.at
                    ? new Date(a.at).toLocaleString('vi-VN')
                    : '—';
                const line = (() => {
                    if (a.type === 'product')
                        return `${a.action} sản phẩm ${a?.meta?.name || ''}`;
                    if (a.type === 'user')
                        return `${a.action} user ${a?.meta?.username || ''}`;
                    if (a.type === 'order')
                        return `${a.action} đơn ${a?.meta?.code || ''}${a?.meta?.to ? ` → ${a.meta.to}` : ''}`;
                    return `${a.action} ${a.type}`;
                })();
                return (
                    <li key={a.id || i} className={styles.activityItem}>
                        <span>{line}</span>
                        <span className={styles.activityWhen}>{when}</span>
                    </li>
                );
            })}
        </ul>
    );
}

function LatestOrders({ orders = [] }) {
    if (!orders.length)
        return <div className={styles.muted}>Chưa có đơn nào.</div>;
    const statusMap = {
        pending: 'Chưa thanh toán',
        processing: 'Đã xác nhận',
        shipped: 'Đang giao',
        delivered: 'Đã giao',
        cancelled: 'Đã hủy'
    };
    return (
        <table className={styles.table}>
            <thead>
                <tr className={styles.theadRow}>
                    <th>Mã</th>
                    <th>Khách</th>
                    <th>Tổng</th>
                    <th>Trạng thái</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((o) => (
                    <tr key={o._id} className={styles.tbodyRow}>
                        <td>#{o.code || String(o._id).slice(-6)}</td>
                        <td>
                            {[o.firstName, o.lastName]
                                .filter(Boolean)
                                .join(' ') ||
                                o.email ||
                                '—'}
                        </td>
                        <td>{formatVND(o.totalAmount)} VND</td>
                        <td>{statusMap[o.status] || o.status}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
