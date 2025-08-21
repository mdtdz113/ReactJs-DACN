const KEY = 'admin_audit_log';

export function getActivities() {
    try {
        const raw = localStorage.getItem(KEY);
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr : [];
    } catch {
        return [];
    }
}

export function logActivity({ type, action, meta, who }) {
    const now = new Date().toISOString();
    const item = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        type, // 'product' | 'user' | 'order' | ...
        action, // 'create' | 'update' | 'delete' | 'status_change' | 'stock_adjust' | 'lock' | 'unlock'
        meta: meta || {},
        who: who || 'admin',
        at: now
    };
    const prev = getActivities();
    localStorage.setItem(KEY, JSON.stringify([item, ...prev].slice(0, 200)));
}
