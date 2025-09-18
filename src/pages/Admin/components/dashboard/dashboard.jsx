import { useContext, useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import { OurShopContext } from '@/context/OurShopProvider';
import { getAllUser } from '@/apis/authSercice';
import { getAllOrderAdmin } from '@/apis/orderService';
import { getDetailProduct } from '@/apis/productServer';
import { getActivities } from '@/utils/auditLog';

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar
} from 'recharts';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { vi } from 'date-fns/locale';
import styles from './styles.module.scss';

// =========================
// Utils
// =========================
const compact = (n) =>
    new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(
        Number(n) || 0
    );
const formatVND = (n) => (Number(n) || 0).toLocaleString('vi-VN') + ' ₫';

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

function groupRevenue(orders, filterType, startDate, endDate) {
    const m = new Map();
    for (const o of orders) {
        if (o?.status !== 'delivered') continue;
        const d = new Date(o.createdAt || o.updatedAt || Date.now());
        if (filterType === 'custom' && startDate && endDate) {
            if (d < startDate || d > endDate) continue;
        }
        let key = '';
        if (filterType === 'day') key = d.toLocaleDateString('vi-VN');
        else if (filterType === 'month')
            key = `${d.getMonth() + 1}/${d.getFullYear()}`;
        else if (filterType === 'year') key = `${d.getFullYear()}`;
        else key = d.toLocaleDateString('vi-VN');
        const amount = Number(o.totalAmount || o.amounts?.grandTotal || 0);
        m.set(key, (m.get(key) || 0) + amount);
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
            revenueMonth = 0,
            revenueYesterday = 0;
        const now = new Date();
        const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const yesterdayISO = new Date(Date.now() - 86400000)
            .toISOString()
            .slice(0, 10);

        for (const o of orders) {
            if (o?.status !== 'delivered') continue;
            const d = new Date(o.createdAt || o.updatedAt || Date.now());
            const iso = d.toISOString().slice(0, 10);
            const ymKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const amount = Number(o.totalAmount || o.amounts?.grandTotal || 0);
            if (iso === todayISO) revenueToday += amount;
            if (iso === yesterdayISO) revenueYesterday += amount;
            if (ymKey === ym) revenueMonth += amount;
        }

        const dayChange = revenueYesterday
            ? ((revenueToday - revenueYesterday) / revenueYesterday) * 100
            : null;

        return {
            usersCount,
            productsCount,
            ordersCount,
            revenueToday,
            revenueMonth,
            dayChange
        };
    }, [users, orders, products, productsTotal]);

    const revenueSeries = useMemo(
        () => groupRevenue(orders, filterType, startDate, endDate),
        [orders, filterType, startDate, endDate]
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

    return (
        <div className={styles.v2Wrap}>
            {/* KPI */}
            <div className={styles.v2KpiGrid}>
                <KPI title='Người dùng' value={kpi.usersCount} icon='user' />
                <KPI title='Sản phẩm' value={kpi.productsCount} icon='box' />
                <KPI title='Đơn hàng' value={kpi.ordersCount} icon='cart' />
                <KPI
                    title='Doanh thu hôm nay'
                    value={formatVND(kpi.revenueToday)}
                    icon='money'
                    delta={kpi.dayChange}
                />
                <KPI
                    title='Doanh thu tháng'
                    value={formatVND(kpi.revenueMonth)}
                    icon='calendar'
                />
            </div>

            {/* Charts */}
            <div className={styles.v2ChartGrid}>
                <Card title='Doanh thu'>
                    <FilterBox
                        filterType={filterType}
                        setFilterType={setFilterType}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                    />
                    <ResponsiveContainer width='100%' height='100%'>
                        <AreaChart
                            data={revenueSeries}
                            margin={{ left: 8, right: 8, top: 10, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient
                                    id='revGrad'
                                    x1='0'
                                    y1='0'
                                    x2='0'
                                    y2='1'
                                >
                                    <stop
                                        offset='0%'
                                        stopColor='#6366f1'
                                        stopOpacity={0.35}
                                    />
                                    <stop
                                        offset='100%'
                                        stopColor='#6366f1'
                                        stopOpacity={0.02}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray='3 3'
                                stroke='var(--v2-grid)'
                            />
                            <XAxis
                                dataKey='date'
                                tick={{ fill: 'var(--v2-muted)' }}
                                tickMargin={8}
                            />
                            <YAxis
                                tick={{ fill: 'var(--v2-muted)' }}
                                tickFormatter={compact}
                                width={60}
                            />
                            <Tooltip
                                formatter={(v) => formatVND(v)}
                                contentStyle={{
                                    background: '#ffffff',
                                    border: '1px solid var(--v2-border)',
                                    borderRadius: 12,
                                    color: '#0f172a'
                                }}
                                labelStyle={{ color: '#0f172a' }}
                            />
                            <Area
                                type='monotone'
                                dataKey='revenue'
                                stroke='#6366f1'
                                strokeWidth={2.5}
                                fill='url(#revGrad)'
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>

                <Card title='Top sản phẩm bán chạy'>
                    <FilterBox
                        filterType={productFilterType}
                        setFilterType={setProductFilterType}
                        startDate={productStartDate}
                        setStartDate={setProductStartDate}
                        endDate={productEndDate}
                        setEndDate={setProductEndDate}
                    />
                    <ResponsiveContainer width='100%' height='100%'>
                        <BarChart
                            data={topProducts}
                            layout='vertical'
                            margin={{ left: 12, right: 8, top: 10, bottom: 0 }}
                        >
                            <CartesianGrid
                                strokeDasharray='3 3'
                                stroke='var(--v2-grid)'
                            />
                            <XAxis
                                type='number'
                                tick={{ fill: 'var(--v2-muted)' }}
                            />
                            <YAxis
                                type='category'
                                dataKey='name'
                                tick={{ fill: 'var(--v2-muted)' }}
                                width={180}
                            />
                            <Tooltip
                                formatter={(value, name, props) => [
                                    `${value} sản phẩm`,
                                    props.payload.name
                                ]}
                                contentStyle={{
                                    background: '#ffffff',
                                    border: '1px solid var(--v2-border)',
                                    borderRadius: 12,
                                    color: '#0f172a'
                                }}
                                labelStyle={{ color: '#0f172a' }}
                            />
                            <Bar
                                dataKey='qty'
                                fill='#f59e0b'
                                radius={[8, 8, 8, 8]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Activity & Orders */}
            <div className={styles.v2BottomGrid}>
                <Card title='Nhật ký hoạt động'>
                    <ActivityList
                        items={useMemo(() => {
                            const logs = getActivities().slice(0, 20);
                            if (logs.length) return logs;
                            return (orders || []).slice(0, 10).map((o) => ({
                                id: o._id,
                                at: o.createdAt || o.updatedAt,
                                who: 'system',
                                type: 'order',
                                action: 'Đã tạo',
                                meta: {
                                    code: o.code || o._id?.slice(-6),
                                    amount: o.totalAmount
                                }
                            }));
                        }, [orders])}
                    />
                </Card>

                <Card title='Đơn mới nhất'>
                    <LatestOrders orders={(orders || []).slice(0, 8)} />
                </Card>
            </div>

            {loading && <div className={styles.v2Muted}>Đang tải dữ liệu…</div>}
        </div>
    );
}

// =========================
// Reusable UI
// =========================
function Card({ title, children }) {
    return (
        <section className={styles.v2Card}>
            <div className={styles.v2CardHead}>{title}</div>
            <div className={styles.v2CardBody}>{children}</div>
        </section>
    );
}

function KPI({ title, value, icon, delta }) {
    const arrow = delta == null ? null : delta >= 0 ? '▲' : '▼';
    const deltaText =
        delta == null
            ? ''
            : `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}% hôm qua`;
    return (
        <div className={styles.v2Kpi}>
            <div className={styles.v2KpiTop}>
                <span
                    className={`${styles.v2KpiIcon} ${styles[`ic-${icon}`]}`}
                    aria-hidden
                />
                <span className={styles.v2KpiTitle}>{title}</span>
            </div>
            <div className={styles.v2KpiRow}>
                <div className={styles.v2KpiValue}>{value}</div>
                {delta != null && (
                    <span
                        className={`${styles.v2KpiDelta} ${delta >= 0 ? styles.v2Up : styles.v2Down}`}
                    >
                        {arrow} {deltaText}
                    </span>
                )}
            </div>
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
        <div className={styles.v2Filter}>
            <select
                className={styles.v2Select}
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                aria-label='Kiểu lọc'
            >
                <option value='day'>Theo ngày</option>
                <option value='month'>Theo tháng</option>
                <option value='year'>Theo năm</option>
                <option value='custom'>Khoảng thời gian</option>
            </select>
            {filterType === 'custom' && (
                <div className={styles.v2DateRange}>
                    <DatePicker
                        selected={startDate}
                        onChange={setStartDate}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText='Từ ngày'
                        locale={vi}
                        dateFormat='dd/MM/yyyy'
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={setEndDate}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText='Đến ngày'
                        locale={vi}
                        dateFormat='dd/MM/yyyy'
                    />
                </div>
            )}
        </div>
    );
}

function ActivityList({ items = [] }) {
    if (!items.length)
        return <div className={styles.v2Muted}>Chưa có hoạt động nào.</div>;
    return (
        <ul className={styles.v2ActivityUl}>
            {items.map((a, i) => {
                const when = a.at
                    ? new Date(a.at).toLocaleString('vi-VN')
                    : '—';
                const line = (() => {
                    if (a.type === 'product')
                        return `${a.action} sản phẩm ${a?.meta?.name || ''}`;
                    if (a.type === 'user')
                        return `${a.action} người dùng ${a?.meta?.username || ''}`;
                    if (a.type === 'order')
                        return `${a.action} đơn ${a?.meta?.code || ''}${a?.meta?.to ? ` → ${a.meta.to}` : ''}`;
                    return `${a.action} ${a.type}`;
                })();
                return (
                    <li key={a.id || i} className={styles.v2ActivityItem}>
                        <span>{line}</span>
                        <span className={styles.v2ActivityWhen}>{when}</span>
                    </li>
                );
            })}
        </ul>
    );
}

function LatestOrders({ orders = [] }) {
    if (!orders.length)
        return <div className={styles.v2Muted}>Chưa có đơn nào.</div>;
    const statusMap = {
        pending: 'Chưa thanh toán',
        completed: 'Đã thanh toán',
        processing: 'Đã xác nhận',
        shipped: 'Đang giao',
        delivered: 'Đã giao',
        cancelled: 'Đã hủy'
    };
    return (
        <table className={styles.v2Table}>
            <thead>
                <tr>
                    <th>Mã</th>
                    <th>Khách</th>
                    <th>Tổng</th>
                    <th>Trạng thái</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((o) => (
                    <tr key={o._id}>
                        <td>#{o.code || String(o._id).slice(-6)}</td>
                        <td>
                            {[o.firstName, o.lastName]
                                .filter(Boolean)
                                .join(' ') ||
                                o.email ||
                                '—'}
                        </td>
                        <td>{formatVND(o.totalAmount)}</td>
                        <td>
                            <span
                                className={`${styles.v2Status} ${styles['v2-' + (o.status || 'unknown')]}`}
                            >
                                {statusMap[o.status] || o.status}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
