import { useContext, useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import { OurShopContext } from '@/context/OurShopProvider';
import { getAllUser } from '@/apis/authSercice';
import { getAllOrderAdmin } from '@/apis/orderService';
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

import styles from './styles.module.scss';

function formatVND(n) {
    return (Number(n) || 0).toLocaleString('vi-VN');
}

function sumByDay(orders = []) {
    const m = new Map();
    for (const o of orders) {
        if (o?.status !== 'delivered') continue;
        const d = new Date(o.createdAt || o.updatedAt || Date.now());
        const key = new Date(d.getFullYear(), d.getMonth(), d.getDate())
            .toISOString()
            .slice(0, 10);
        const amount = Number(o.totalAmount || o.amounts?.grandTotal || 0);
        m.set(key, (m.get(key) || 0) + amount);
    }
    const days = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        days.push({ date: key, revenue: m.get(key) || 0 });
    }
    return days;
}

function topProductsFromOrders(orders = [], topN = 5) {
    const count = new Map();
    for (const o of orders) {
        for (const it of o.items || []) {
            const pid = it.productId || it.product || it._id;
            const qty = Number(it.qty || it.quantity || it.amount || 0);
            if (!pid || !qty) continue;
            const name =
                it.name || it.productName || `#${String(pid).slice(-6)}`;
            const prev = count.get(pid) || { name, qty: 0 };
            prev.qty += qty;
            prev.name = prev.name || name;
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

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const u = await getAllUser();
                const o = await getAllOrderAdmin(token, {
                    /* limit: 500 */
                });
                if (!products?.length) await fetchProducts?.();
                if (!mounted) return;
                setUsers(u?.data?.data || []);
                setOrders(o?.data?.data || []);
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

    const revenueSeries = useMemo(() => sumByDay(orders), [orders]);
    const topProducts = useMemo(
        () => topProductsFromOrders(orders, 5),
        [orders]
    );

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
            {/* KPI cards */}
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
                <div className={styles.chartPanel}>
                    <h3 className={styles.cardTitle}>Doanh thu 30 ngày</h3>
                    <div className={styles.chartBody}>
                        <ResponsiveContainer width='100%' height='100%'>
                            <LineChart data={revenueSeries}>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis dataKey='date' tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    formatter={(v) => `${formatVND(v)} ₫`}
                                />
                                <Line
                                    type='monotone'
                                    dataKey='revenue'
                                    stroke='#2563eb'
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={styles.chartPanel}>
                    <h3 className={styles.cardTitle}>Top sản phẩm bán chạy</h3>
                    <div className={styles.chartBody}>
                        <ResponsiveContainer width='100%' height='100%'>
                            <BarChart data={topProducts}>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis dataKey='name' tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey='qty' fill='#10b981' />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent activity & Latest orders */}
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

function KPI({ title, value }) {
    return (
        <div className={styles.kpiCard}>
            <div className={styles.kpiTitle}>{title}</div>
            <div className={styles.kpiValue}>{value}</div>
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
