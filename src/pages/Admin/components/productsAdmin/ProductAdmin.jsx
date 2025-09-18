import styles from './styles.module.scss';
import { useContext, useMemo, useState, useEffect } from 'react';
import { OurShopContext } from '@/context/OurShopProvider';
import { AddProduct, deleteProduct, updateProduct } from '@/apis/productServer';
import MyButton from '@components/Button/Button';

function ProductAdmin() {
    const {
        // layout & header
        productcontainer,
        toolbar,
        title,
        toolActions,
        searchBox,
        input,
        select,
        // table
        tableWrap,
        producttable,
        imgplaceholder,
        // buttons
        btnPrimary,
        btnGhost,
        btnWarn,
        btnSmall,
        // form
        panel,
        panelHead,
        panelBody,
        formGrid,
        formCol,
        field,
        actions,
        // pill
        pill,
        pillMuted,
        // modal
        modalBackdrop,
        modalCard,
        modalHead,
        modalBody,
        modalFoot,
        sizeGrid,
        sizeRow,
        negative,
        // drawer history
        drawer,
        drawerHead,
        drawerBody,
        chip,
        chipMuted,
        historyList,
        historyItem,
        // states
        empty,
        loading
    } = styles;

    const { products, fetchProducts, hangleLoadMore, total } =
        useContext(OurShopContext);

    // ---------- State chung ----------
    const [loadingData, setLoadingData] = useState(false);
    const [query, setQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    useEffect(() => {
        // lần đầu làm tươi
        (async () => {
            setLoadingData(true);
            await fetchProducts?.();
            setLoadingData(false);
        })();
    }, []);

    // ---------- Form tạo / sửa ----------
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState(() => defaultForm());

    function defaultForm() {
        return {
            name: '',
            price: '',
            description: '',
            type: '',
            material: '',
            images: [''],
            size: [
                { name: 'S', quantity: 0 },
                { name: 'M', quantity: 0 },
                { name: 'L', quantity: 0 }
            ]
        };
    }

    const normalize = (s) => (s || '').trim().toUpperCase();
    const isDupAt = (sizes, idx) => {
        const cur = normalize(sizes[idx]?.name);
        if (!cur) return false;
        return sizes.some((s, i) => i !== idx && normalize(s.name) === cur);
    };

    const openAdd = () => {
        setFormData(defaultForm());
        setIsEditing(false);
        setEditId(null);
        setShowForm(true);
    };
    const openEdit = (p) => {
        setFormData({
            name: p.name,
            price: p.price,
            description: p.description,
            type: p.type,
            material: p.material,
            images: [...(p.images || [])],
            size: [...(p.size || [])]
        });
        setIsEditing(true);
        setEditId(p._id);
        setShowForm(true);
    };

    const onChangeField = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const onChangeImage = (idx, value) =>
        setFormData((p) => ({
            ...p,
            images: p.images.map((v, i) => (i === idx ? value : v))
        }));
    const addImageRow = () =>
        setFormData((p) => ({ ...p, images: [...p.images, ''] }));
    const removeImage = (idx) =>
        setFormData((p) => ({
            ...p,
            images: p.images.filter((_, i) => i !== idx)
        }));

    const changeSize = (idx, field, value) =>
        setFormData((prev) => ({
            ...prev,
            size: prev.size.map((s, i) =>
                i === idx
                    ? {
                          ...s,
                          [field]:
                              field === 'quantity'
                                  ? Math.max(0, Number(value) || 0)
                                  : value
                      }
                    : s
            )
        }));
    const addSize = () =>
        setFormData((p) => ({
            ...p,
            size: [...p.size, { name: '', quantity: 0 }]
        }));
    const removeSize = (idx) =>
        setFormData((p) => ({
            ...p,
            size: p.size.filter((_, i) => i !== idx)
        }));

    const saveProduct = async () => {
        try {
            setLoadingData(true);
            const sizes = (formData.size || [])
                .map((s) => ({
                    name: normalize(s.name),
                    quantity: Math.max(0, Number(s.quantity) || 0)
                }))
                .filter((s) => s.name);
            const names = sizes.map((s) => s.name);
            const dupe = names.find((n, i) => names.indexOf(n) !== i);
            if (dupe) {
                alert(`Tên size bị trùng: ${dupe}`);
                return;
            }
            const images = (formData.images || [])
                .map((i) => (i || '').trim())
                .filter(Boolean);
            const payload = {
                ...formData,
                price: Number(formData.price) || 0,
                images: images.length ? images : [''],
                size: sizes
            };
            if (isEditing) {
                await updateProduct(editId, payload);
                alert('Đã cập nhật sản phẩm.');
            } else {
                await AddProduct(payload);
                alert('Đã thêm sản phẩm.');
            }
            setShowForm(false);
            setFormData(defaultForm());
            await fetchProducts?.();
        } catch (e) {
            console.error(e);
            alert('Có lỗi khi lưu sản phẩm.');
        } finally {
            setLoadingData(false);
        }
    };

    const deleteProd = async (id) => {
        if (!window.confirm('Xóa sản phẩm này?')) return;
        try {
            setLoadingData(true);
            await deleteProduct(id);
            await fetchProducts?.();
        } catch (e) {
            console.error(e);
            alert('Xóa không thành công.');
        } finally {
            setLoadingData(false);
        }
    };

    const totalQty = (p) =>
        (p.size || []).reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);
    const vnd = (n) => (Number(n) || 0).toLocaleString('vi-VN');

    // ---------- Điều chỉnh tồn theo size ----------
    const [stockOpen, setStockOpen] = useState(false);
    const [stockProduct, setStockProduct] = useState(null);
    const [deltas, setDeltas] = useState([]); // [{name, delta}]
    const [reason, setReason] = useState('restock');
    const [note, setNote] = useState('');

    const openStock = (p) => {
        setStockProduct(p);
        setDeltas((p.size || []).map((s) => ({ name: s.name, delta: 0 })));
        setReason('restock');
        setNote('');
        setStockOpen(true);
    };
    const setDelta = (idx, value) =>
        setDeltas((prev) =>
            prev.map((d, i) =>
                i === idx ? { ...d, delta: Number(value) || 0 } : d
            )
        );

    const previewRows = useMemo(() => {
        if (!stockProduct) return [];
        return (stockProduct.size || []).map((s) => {
            const f = deltas.find(
                (d) => normalize(d.name) === normalize(s.name)
            );
            const delta = f ? Number(f.delta) || 0 : 0;
            const after = (Number(s.quantity) || 0) + delta;
            return { name: s.name, before: s.quantity, delta, after };
        });
    }, [stockProduct, deltas]);

    const invalidAfter = previewRows.some((r) => r.after < 0);
    const anyChange = previewRows.some((r) => r.delta !== 0);

    // ---------- Lịch sử (localStorage) ----------
    const HK = (pid) => `stock_history_${pid}`;
    const getHistory = (pid) => {
        try {
            const raw = localStorage.getItem(HK(pid));
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    };
    const pushHistory = (pid, record) => {
        const old = getHistory(pid);
        localStorage.setItem(HK(pid), JSON.stringify([record, ...old]));
    };
    const clearHistory = (pid) => localStorage.removeItem(HK(pid));
    const [openHistoryFor, setOpenHistoryFor] = useState(null);

    const submitAdjust = async () => {
        if (!stockProduct) return;
        if (!anyChange) {
            alert('Chưa có thay đổi.');
            return;
        }
        if (invalidAfter) {
            alert('Có size bị âm sau điều chỉnh.');
            return;
        }
        try {
            setLoadingData(true);
            const nextSizes = previewRows.map((r) => ({
                name: r.name,
                quantity: r.after
            }));
            const payload = { ...stockProduct, size: nextSizes };
            await updateProduct(stockProduct._id, payload);
            const changes = previewRows
                .filter((r) => r.delta !== 0)
                .map((r) => ({
                    name: r.name,
                    delta: r.delta,
                    before: r.before,
                    after: r.after
                }));
            pushHistory(stockProduct._id, {
                id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                at: new Date().toISOString(),
                by: window?.currentUserName || 'admin',
                reason,
                note: note?.trim() || null,
                changes
            });
            alert('Đã cập nhật số lượng theo size.');
            setStockOpen(false);
            setStockProduct(null);
            setDeltas([]);
            setNote('');
            await fetchProducts?.();
        } catch (e) {
            console.error(e);
            alert('Có lỗi khi cập nhật.');
        } finally {
            setLoadingData(false);
        }
    };

    // ---------- Lọc & tìm kiếm ----------
    const filtered = (products || []).filter((p) => {
        const matchQ =
            !query || p.name?.toLowerCase().includes(query.toLowerCase());
        const matchType =
            !typeFilter || p.type?.toLowerCase() === typeFilter.toLowerCase();
        return matchQ && matchType;
    });

    return (
        <div className={productcontainer}>
            {/* Toolbar */}
            <div className={toolbar}>
                <div className={title}>Quản lý sản phẩm</div>
                <div className={toolActions}>
                    <div className={searchBox} role='search'>
                        <input
                            className={input}
                            type='search'
                            placeholder='Tìm theo tên sản phẩm…'
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <select
                            className={select}
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            aria-label='Lọc theo loại'
                        >
                            <option value=''>Tất cả loại</option>
                            <option value='Áo'>Áo</option>
                            <option value='Quần'>Quần</option>
                            <option value='Phụ kiện'>Phụ kiện</option>
                        </select>
                    </div>
                    <button
                        className={`${btnGhost} ${btnSmall}`}
                        onClick={() => {
                            setLoadingData(true);
                            fetchProducts?.().finally(() =>
                                setLoadingData(false)
                            );
                        }}
                    >
                        Làm mới
                    </button>
                    <button className={btnPrimary} onClick={openAdd}>
                        + Thêm sản phẩm
                    </button>
                </div>
            </div>

            {/* Form thêm/sửa */}
            {showForm && (
                <section className={panel}>
                    <div className={panelHead}>
                        {isEditing ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
                    </div>
                    <div className={panelBody}>
                        <div className={formGrid}>
                            <div className={formCol}>
                                <label className={field}>
                                    Tên sản phẩm
                                    <input
                                        name='name'
                                        value={formData.name}
                                        onChange={onChangeField}
                                        placeholder='VD: Áo thun cổ tròn'
                                    />
                                </label>
                                <label className={field}>
                                    Giá (VNĐ)
                                    <input
                                        type='number'
                                        min={0}
                                        name='price'
                                        value={formData.price}
                                        onChange={onChangeField}
                                        placeholder='VD: 199000'
                                    />
                                </label>
                                <label className={field}>
                                    Mô tả
                                    <textarea
                                        name='description'
                                        value={formData.description}
                                        onChange={onChangeField}
                                        placeholder='Mô tả ngắn gọn…'
                                        rows={4}
                                    />
                                </label>
                                <label className={field}>
                                    Loại
                                    <input
                                        name='type'
                                        value={formData.type}
                                        onChange={onChangeField}
                                        placeholder='VD: Áo / Quần / Phụ kiện'
                                    />
                                </label>
                                <label className={field}>
                                    Chất liệu
                                    <input
                                        name='material'
                                        value={formData.material}
                                        onChange={onChangeField}
                                        placeholder='VD: Cotton 100%'
                                    />
                                </label>
                            </div>
                            <div className={formCol}>
                                <div className={field}>
                                    <div>Ảnh sản phẩm</div>
                                    {formData.images.map((img, i) => (
                                        <div key={i} className={sizeRow}>
                                            <input
                                                value={img}
                                                onChange={(e) =>
                                                    onChangeImage(
                                                        i,
                                                        e.target.value
                                                    )
                                                }
                                                placeholder={`Link ảnh ${i + 1}`}
                                            />
                                            <button
                                                className={btnGhost}
                                                onClick={() => removeImage(i)}
                                                type='button'
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        className={btnGhost}
                                        type='button'
                                        onClick={addImageRow}
                                    >
                                        + Thêm ảnh
                                    </button>
                                </div>

                                <div className={field}>
                                    <div>Size & số lượng</div>
                                    {formData.size.map((s, i) => (
                                        <div key={i} className={sizeRow}>
                                            <input
                                                value={s.name}
                                                onChange={(e) =>
                                                    changeSize(
                                                        i,
                                                        'name',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder='VD: S, M, L…'
                                                onBlur={(e) => {
                                                    const n = normalize(
                                                        e.target.value
                                                    );
                                                    changeSize(i, 'name', n);
                                                    const arr = [
                                                        ...formData.size
                                                    ];
                                                    arr[i].name = n;
                                                    if (isDupAt(arr, i))
                                                        alert(
                                                            `Tên size "${n}" đã tồn tại.`
                                                        );
                                                }}
                                            />
                                            <input
                                                type='number'
                                                min={0}
                                                value={s.quantity}
                                                onChange={(e) =>
                                                    changeSize(
                                                        i,
                                                        'quantity',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder='Số lượng'
                                            />
                                            <button
                                                className={btnGhost}
                                                type='button'
                                                onClick={() => removeSize(i)}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        className={btnGhost}
                                        type='button'
                                        onClick={addSize}
                                    >
                                        + Thêm size
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className={actions}>
                            <button
                                className={btnPrimary}
                                onClick={saveProduct}
                                disabled={loadingData}
                            >
                                {loadingData ? 'Đang lưu…' : 'Lưu'}
                            </button>
                            <button
                                className={btnGhost}
                                onClick={() => setShowForm(false)}
                                disabled={loadingData}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* Danh sách */}
            <div className={tableWrap}>
                <table className={producttable}>
                    <thead>
                        <tr>
                            <th>HÌNH ẢNH</th>
                            <th>LOẠI</th>
                            <th>TÊN</th>
                            <th>GIÁ (VNĐ)</th>
                            <th>TỒN KHO</th>
                            <th>HÀNH ĐỘNG</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((p) => (
                            <tr key={p._id}>
                                <td>
                                    <div className={imgplaceholder}>
                                        <img
                                            src={p.images?.[0]}
                                            alt={p.name || ''}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <span className={pill}>
                                        {p.type || '—'}
                                    </span>
                                    <span className={pillMuted}>
                                        {p.material || ''}
                                    </span>
                                </td>
                                <td>{p.name}</td>
                                <td>{vnd(p.price)}</td>
                                <td>
                                    {(p.size || [])
                                        .map((s) => `${s.name}:${s.quantity}`)
                                        .join(', ')}{' '}
                                    {` (Tổng: ${totalQty(p)})`}
                                </td>
                                <td>
                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: 8,
                                            flexWrap: 'wrap'
                                        }}
                                    >
                                        <button
                                            className={`${btnGhost} ${btnSmall}`}
                                            onClick={() => openEdit(p)}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className={`${btnGhost} ${btnSmall}`}
                                            onClick={() => openStock(p)}
                                            title='Điều chỉnh tồn theo size'
                                        >
                                            Chỉnh size
                                        </button>
                                        <button
                                            className={`${btnWarn} ${btnSmall}`}
                                            onClick={() => deleteProd(p._id)}
                                        >
                                            Xóa
                                        </button>
                                        <button
                                            className={`${btnGhost} ${btnSmall}`}
                                            onClick={() =>
                                                setOpenHistoryFor(p._id)
                                            }
                                        >
                                            Lịch sử
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={6}>
                                    <div className={empty}>
                                        Không tìm thấy sản phẩm phù hợp.
                                    </div>
                                </td>
                            </tr>
                        )}
                        {filtered.length && products.length < total ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center' }}>
                                    <MyButton
                                        content={'Xem thêm'}
                                        onClick={hangleLoadMore}
                                    />
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>

            {loadingData && <div className={loading}>Đang tải dữ liệu…</div>}

            {/* Modal chỉnh size */}
            {stockOpen && stockProduct && (
                <div
                    className={modalBackdrop}
                    onClick={() => setStockOpen(false)}
                >
                    <div
                        className={modalCard}
                        onClick={(e) => e.stopPropagation()}
                        role='dialog'
                        aria-modal='true'
                    >
                        <div className={modalHead}>
                            Chỉnh số lượng — {stockProduct.name}
                        </div>
                        <div className={modalBody}>
                            <div className={sizeGrid}>
                                <div className={sizeRow}>
                                    <strong>Size</strong>
                                    <strong>Tồn</strong>
                                    <strong>Điều chỉnh (±)</strong>
                                    <strong>Sau chỉnh</strong>
                                </div>
                                {(stockProduct.size || []).map((s, idx) => {
                                    const delta = deltas[idx]?.delta || 0;
                                    const after =
                                        (Number(s.quantity) || 0) +
                                        (Number(delta) || 0);
                                    return (
                                        <div key={idx} className={sizeRow}>
                                            <span>{s.name}</span>
                                            <span>{s.quantity}</span>
                                            <input
                                                type='number'
                                                value={delta}
                                                onChange={(e) =>
                                                    setDelta(
                                                        idx,
                                                        e.target.value
                                                    )
                                                }
                                                placeholder='VD: +5 hoặc -2'
                                            />
                                            <span
                                                className={
                                                    after < 0 ? negative : ''
                                                }
                                            >
                                                {after}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div
                                style={{
                                    display: 'grid',
                                    gap: 8,
                                    marginTop: 12
                                }}
                            >
                                <label>
                                    Lý do
                                    <select
                                        value={reason}
                                        onChange={(e) =>
                                            setReason(e.target.value)
                                        }
                                    >
                                        <option value='restock'>
                                            Nhập hàng
                                        </option>
                                        <option value='inventory_adjustment'>
                                            Điều chỉnh kiểm kê
                                        </option>
                                        <option value='fix_error'>
                                            Sửa sai số liệu
                                        </option>
                                        <option value='other'>Khác</option>
                                    </select>
                                </label>
                                <label>
                                    Ghi chú
                                    <input
                                        value={note}
                                        onChange={(e) =>
                                            setNote(e.target.value)
                                        }
                                        placeholder='Ví dụ: nhận lại hàng lỗi…'
                                    />
                                </label>
                            </div>
                        </div>
                        <div className={modalFoot}>
                            <button
                                className={btnGhost}
                                onClick={() => setStockOpen(false)}
                            >
                                Hủy
                            </button>
                            <button
                                className={btnPrimary}
                                onClick={submitAdjust}
                                disabled={
                                    loadingData || !anyChange || invalidAfter
                                }
                            >
                                {loadingData ? 'Đang lưu…' : 'Xác nhận'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Drawer lịch sử */}
            {openHistoryFor && (
                <aside className={drawer} role='dialog' aria-modal='true'>
                    <div className={drawerHead}>
                        <strong>Lịch sử điều chỉnh</strong>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button
                                className={btnGhost}
                                onClick={() => {
                                    clearHistory(openHistoryFor);
                                }}
                            >
                                Xóa lịch sử
                            </button>
                            <button
                                className={btnPrimary}
                                onClick={() => setOpenHistoryFor(null)}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                    <div className={drawerBody}>
                        {(() => {
                            const logs = getHistory(openHistoryFor);
                            if (!logs.length) return <em>Chưa có lịch sử.</em>;
                            return (
                                <ul className={historyList}>
                                    {logs.map((r) => {
                                        const when = new Date(
                                            r.at
                                        ).toLocaleString('vi-VN');
                                        return (
                                            <li
                                                key={r.id}
                                                className={historyItem}
                                            >
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        gap: 6,
                                                        flexWrap: 'wrap'
                                                    }}
                                                >
                                                    <span className={chip}>
                                                        {when}
                                                    </span>
                                                    <span className={chip}>
                                                        {r.by}
                                                    </span>
                                                    <span className={chip}>
                                                        {r.reason}
                                                    </span>
                                                    {r.note ? (
                                                        <span
                                                            className={
                                                                chipMuted
                                                            }
                                                        >
                                                            {r.note}
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <div style={{ marginTop: 6 }}>
                                                    {r.changes.map((c, i) => (
                                                        <div
                                                            key={i}
                                                            style={{
                                                                display: 'grid',
                                                                gridTemplateColumns:
                                                                    '60px 1fr 1fr',
                                                                gap: 8,
                                                                fontSize: 14
                                                            }}
                                                        >
                                                            <span>
                                                                {c.name}
                                                            </span>
                                                            <span>
                                                                {c.delta > 0
                                                                    ? `+${c.delta}`
                                                                    : c.delta}
                                                            </span>
                                                            <span>
                                                                {typeof c.before ===
                                                                'number'
                                                                    ? `(${c.before} → ${c.after})`
                                                                    : ''}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            );
                        })()}
                    </div>
                </aside>
            )}
        </div>
    );
}

export default ProductAdmin;
