import styles from './styles.module.scss';
import { useContext, useMemo, useState } from 'react';
import { OurShopContext } from '@/context/OurShopProvider';
import { AddProduct, deleteProduct, updateProduct } from '@/apis/productServer';
import MyButton from '@components/Button/Button';

function ProductAdmin() {
    const {
        productcontainer,
        header,
        btnadd,
        producttable,
        imgplaceholder,
        btnedit,
        btndelete,
        formcontainer,
        formRow,
        formLeft,
        formRight,
        sizeRow,
        formActions,
        overflowItem
    } = styles;

    const { products, fetchProducts, hangleLoadMore, total } =
        useContext(OurShopContext);

    // ---------- State chung ----------
    const [loading, setLoading] = useState(false);

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

    const normalizeSizeName = (name) => (name || '').trim().toUpperCase();
    const isDuplicateSizeAtIndex = (sizes, idx) => {
        const current = normalizeSizeName(sizes[idx]?.name);
        if (!current) return false;
        return sizes.some(
            (s, i) => i !== idx && normalizeSizeName(s.name) === current
        );
    };

    const handleOpenAdd = () => {
        setFormData(defaultForm());
        setIsEditing(false);
        setEditId(null);
        setShowForm(true);
    };

    const handleOpenEdit = (p) => {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (idx, value) => {
        setFormData((prev) => {
            const next = [...prev.images];
            next[idx] = value;
            return { ...prev, images: next };
        });
    };

    const addImageRow = () =>
        setFormData((prev) => ({ ...prev, images: [...prev.images, ''] }));

    const removeImageRow = (idx) =>
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== idx)
        }));

    const handleSizeChange = (idx, field, value) => {
        setFormData((prev) => {
            const next = [...prev.size];
            next[idx][field] = field === 'quantity' ? Number(value) : value;
            return { ...prev, size: next };
        });
    };

    const addSizeRow = () =>
        setFormData((prev) => ({
            ...prev,
            size: [...prev.size, { name: '', quantity: 0 }]
        }));

    const removeSizeRow = (idx) =>
        setFormData((prev) => ({
            ...prev,
            size: prev.size.filter((_, i) => i !== idx)
        }));

    const handleSaveProduct = async () => {
        try {
            setLoading(true);

            const cleanedSizes = (formData.size || [])
                .map((s) => ({
                    name: normalizeSizeName(s.name),
                    quantity: Math.max(0, Number(s.quantity) || 0)
                }))
                .filter((s) => s.name);

            const names = cleanedSizes.map((s) => s.name);
            const dupe = names.find((n, i) => names.indexOf(n) !== i);
            if (dupe) {
                alert(`Tên size bị trùng: ${dupe}. Vui lòng sửa lại.`);
                return;
            }

            const cleanedImages = (formData.images || [])
                .map((i) => (i || '').trim())
                .filter(Boolean);

            const payload = {
                ...formData,
                price: Number(formData.price) || 0,
                images: cleanedImages.length ? cleanedImages : [''],
                size: cleanedSizes
            };

            if (isEditing) {
                await updateProduct(editId, payload);
                alert('Sửa sản phẩm thành công!');
            } else {
                await AddProduct(payload);
                alert('Thêm sản phẩm thành công!');
            }

            setShowForm(false);
            setFormData(defaultForm());
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert('Có lỗi khi lưu sản phẩm.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
        try {
            await deleteProduct(id);
            fetchProducts();
        } catch (e) {
            console.error(e);
            alert('Xóa không thành công.');
        }
    };

    // ---------- Tính tổng tồn kho ----------
    const totalQty = (p) =>
        (p.size || []).reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);

    const formatCurrency = (n) => (Number(n) || 0).toLocaleString('vi-VN');

    // ---------- Điều chỉnh tồn theo size (Modal) ----------
    const [showStockModal, setShowStockModal] = useState(false);
    const [stockProduct, setStockProduct] = useState(null);
    const [sizeDeltas, setSizeDeltas] = useState([]); // [{name, delta}]
    const [reason, setReason] = useState('restock');
    const [note, setNote] = useState('');

    const openStockModal = (p) => {
        setStockProduct(p);
        setSizeDeltas((p.size || []).map((s) => ({ name: s.name, delta: 0 })));
        setReason('restock');
        setNote('');
        setShowStockModal(true);
    };

    const changeDelta = (idx, value) => {
        const v = Number(value) || 0;
        setSizeDeltas((prev) => {
            const next = [...prev];
            next[idx] = { ...next[idx], delta: v };
            return next;
        });
    };

    const nextSizesPreview = useMemo(() => {
        if (!stockProduct) return [];
        const current = [...(stockProduct.size || [])];
        return current.map((s) => {
            const found = sizeDeltas.find(
                (d) => normalizeSizeName(d.name) === normalizeSizeName(s.name)
            );
            const delta = found ? Number(found.delta) || 0 : 0;
            const after = (Number(s.quantity) || 0) + delta;
            return { name: s.name, before: s.quantity, delta, after };
        });
    }, [stockProduct, sizeDeltas]);

    const hasNegativeAfter = nextSizesPreview.some((r) => r.after < 0);
    const hasAnyChange = nextSizesPreview.some((r) => r.delta !== 0);

    // ---------- Lịch sử hành động (localStorage) ----------
    const HISTORY_KEY = (pid) => `stock_history_${pid}`;
    const getHistory = (pid) => {
        try {
            const raw = localStorage.getItem(HISTORY_KEY(pid));
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    };
    const pushHistory = (pid, record) => {
        const old = getHistory(pid);
        localStorage.setItem(
            HISTORY_KEY(pid),
            JSON.stringify([record, ...old])
        );
    };
    const clearHistory = (pid) => {
        localStorage.removeItem(HISTORY_KEY(pid));
    };

    const [openHistoryFor, setOpenHistoryFor] = useState(null); // productId hoặc null

    const openHistory = (p) => {
        setOpenHistoryFor(p._id);
    };
    const closeHistory = () => setOpenHistoryFor(null);

    const submitAdjustStock = async () => {
        if (!stockProduct) return;
        if (!hasAnyChange) {
            alert('Chưa có thay đổi nào.');
            return;
        }
        if (hasNegativeAfter) {
            alert('Một số size sau điều chỉnh bị âm. Vui lòng sửa lại.');
            return;
        }

        try {
            setLoading(true);

            const nextSizes = nextSizesPreview.map((r) => ({
                name: r.name,
                quantity: r.after
            }));

            // Payload tối thiểu (cập nhật size)
            const payload = {
                name: stockProduct.name,
                price: stockProduct.price,
                description: stockProduct.description,
                type: stockProduct.type,
                material: stockProduct.material,
                images: stockProduct.images,
                size: nextSizes
            };

            await updateProduct(stockProduct._id, payload);

            // Lưu lịch sử (gộp theo lần chỉnh)
            const changes = nextSizesPreview
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

            alert('Cập nhật số lượng theo size thành công!');
            setShowStockModal(false);
            setStockProduct(null);
            setSizeDeltas([]);
            setNote('');
            fetchProducts();
        } catch (e) {
            console.error(e);
            alert('Có lỗi khi cập nhật số lượng.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={productcontainer}>
            {/* Header */}
            <div className={header}>
                <h2>Quản lý sản phẩm</h2>
                <button className={btnadd} onClick={handleOpenAdd}>
                    + Thêm sản phẩm mới
                </button>
            </div>

            {/* Form Thêm/Sửa */}
            <div className={styles.scrollContainer}>
                {showForm && (
                    <div className={formcontainer}>
                        <h3>{isEditing ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h3>

                        <div className={formRow}>
                            {/* Trái */}
                            <div className={formLeft}>
                                <h4>Tên sản phẩm</h4>
                                <input
                                    type='text'
                                    name='name'
                                    placeholder='Tên sản phẩm'
                                    value={formData.name}
                                    onChange={handleChange}
                                />

                                <h4>Giá</h4>
                                <input
                                    type='number'
                                    name='price'
                                    placeholder='Giá'
                                    value={formData.price}
                                    onChange={handleChange}
                                    min={0}
                                />

                                <h4>Mô tả</h4>
                                <textarea
                                    name='description'
                                    placeholder='Mô tả'
                                    value={formData.description}
                                    onChange={handleChange}
                                />

                                <h4>Loại sản phẩm</h4>
                                <input
                                    type='text'
                                    name='type'
                                    placeholder='Loại'
                                    value={formData.type}
                                    onChange={handleChange}
                                />

                                <h4>Chất liệu</h4>
                                <input
                                    type='text'
                                    name='material'
                                    placeholder='Chất liệu'
                                    value={formData.material}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Phải */}
                            <div className={formRight}>
                                <h4>Ảnh sản phẩm</h4>
                                {formData.images.map((img, i) => (
                                    <div key={i} className={sizeRow}>
                                        <input
                                            type='text'
                                            placeholder={`Link ảnh ${i + 1}`}
                                            value={img}
                                            onChange={(e) =>
                                                handleImageChange(
                                                    i,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <button
                                            type='button'
                                            onClick={() => removeImageRow(i)}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                ))}
                                <button type='button' onClick={addImageRow}>
                                    + Thêm ảnh
                                </button>

                                <h4>Size &amp; Số lượng</h4>
                                {formData.size.map((s, i) => (
                                    <div key={i} className={sizeRow}>
                                        <input
                                            type='text'
                                            placeholder='VD: S, M, L, XL...'
                                            value={s.name}
                                            onChange={(e) =>
                                                handleSizeChange(
                                                    i,
                                                    'name',
                                                    e.target.value
                                                )
                                            }
                                            onBlur={(e) => {
                                                const normalized =
                                                    normalizeSizeName(
                                                        e.target.value
                                                    );
                                                handleSizeChange(
                                                    i,
                                                    'name',
                                                    normalized
                                                );
                                                const arr = [...formData.size];
                                                arr[i].name = normalized;
                                                if (
                                                    isDuplicateSizeAtIndex(
                                                        arr,
                                                        i
                                                    )
                                                ) {
                                                    alert(
                                                        `Tên size "${normalized}" đã tồn tại. Vui lòng đổi tên khác.`
                                                    );
                                                }
                                            }}
                                        />
                                        <input
                                            type='number'
                                            min={0}
                                            placeholder='Số lượng'
                                            value={s.quantity}
                                            onChange={(e) => {
                                                const val = Math.max(
                                                    0,
                                                    Number(e.target.value) || 0
                                                );
                                                handleSizeChange(
                                                    i,
                                                    'quantity',
                                                    val
                                                );
                                            }}
                                        />
                                        <button
                                            type='button'
                                            onClick={() => removeSizeRow(i)}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                ))}
                                <button type='button' onClick={addSizeRow}>
                                    + Thêm size
                                </button>
                            </div>
                        </div>

                        <div className={formActions}>
                            <button
                                onClick={handleSaveProduct}
                                disabled={loading}
                            >
                                {loading ? 'Đang lưu...' : 'Lưu sản phẩm'}
                            </button>
                            <button
                                type='button'
                                onClick={() => setShowForm(false)}
                                disabled={loading}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                )}
                {/* Bảng sản phẩm */}
                <div className={overflowItem}>
                    <table className={producttable}>
                        <thead>
                            <tr>
                                <th>HÌNH ẢNH</th>
                                <th>VẬT LIỆU</th>
                                <th>TÊN SẢN PHẨM</th>
                                <th>GIÁ (VNĐ)</th>
                                <th>TỒN KHO</th>
                                <th>HÀNH ĐỘNG</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p._id}>
                                    <td>
                                        <div className={imgplaceholder}>
                                            <img src={p.images?.[0]} alt='' />
                                        </div>
                                    </td>
                                    <td>{p.material}</td>
                                    <td>{p.name}</td>
                                    <td>{formatCurrency(p.price)}</td>
                                    <td>
                                        {(p.size || [])
                                            .map(
                                                (s) =>
                                                    `${s.name}: ${s.quantity}`
                                            )
                                            .join(', ')}
                                        {` (Tổng: ${totalQty(p)})`}
                                    </td>
                                    <td>
                                        <button
                                            className={btnedit}
                                            onClick={() => handleOpenEdit(p)}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className={btnedit}
                                            onClick={() => openStockModal(p)}
                                            title='Tăng/giảm tồn theo size'
                                        >
                                            Chỉnh size
                                        </button>
                                        <button
                                            className={btndelete}
                                            onClick={() =>
                                                handleDeleteProduct(p._id)
                                            }
                                        >
                                            Xóa
                                        </button>
                                        <button
                                            className={btnedit}
                                            onClick={() => openHistory(p)}
                                        >
                                            Lịch sử
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {products.length < total && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        style={{ textAlign: 'center' }}
                                    >
                                        <MyButton
                                            content={'Xem thêm'}
                                            onClick={hangleLoadMore}
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Modal Chỉnh size */}
            {showStockModal && stockProduct && (
                <div
                    className={styles.modalBackdrop}
                    onClick={() => setShowStockModal(false)}
                >
                    <div
                        className={styles.modalCard}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Chỉnh số lượng — {stockProduct.name}</h3>

                        <div className={styles.modalSection}>
                            <div className={styles.sizeGridHeader}>
                                <span>Size</span>
                                <span>Tồn hiện tại</span>
                                <span>Điều chỉnh (±)</span>
                                <span>Tồn sau chỉnh</span>
                            </div>

                            {(stockProduct.size || []).map((s, idx) => {
                                const delta = sizeDeltas[idx]?.delta || 0;
                                const after =
                                    (Number(s.quantity) || 0) +
                                    (Number(delta) || 0);
                                return (
                                    <div
                                        key={idx}
                                        className={styles.sizeGridRow}
                                    >
                                        <span>{s.name}</span>
                                        <span>{s.quantity}</span>
                                        <input
                                            type='number'
                                            value={delta}
                                            onChange={(e) =>
                                                changeDelta(idx, e.target.value)
                                            }
                                            placeholder='VD: +5 hoặc -2'
                                        />
                                        <span
                                            className={
                                                after < 0 ? styles.negative : ''
                                            }
                                        >
                                            {after}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className={styles.modalSection}>
                            <label>Lý do</label>
                            <select
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            >
                                <option value='restock'>
                                    Nhập hàng (restock)
                                </option>
                                <option value='inventory_adjustment'>
                                    Điều chỉnh kiểm kê
                                </option>
                                <option value='fix_error'>
                                    Sửa sai số liệu
                                </option>
                                <option value='other'>Khác</option>
                            </select>
                            <label style={{ marginTop: 8 }}>Ghi chú</label>
                            <input
                                type='text'
                                placeholder='Ví dụ: nhận lại hàng lỗi, kiểm kê kho, ...'
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>

                        <div className={styles.modalActions}>
                            <button onClick={() => setShowStockModal(false)}>
                                Hủy
                            </button>
                            <button
                                onClick={submitAdjustStock}
                                disabled={
                                    loading || !hasAnyChange || hasNegativeAfter
                                }
                            >
                                {loading ? 'Đang lưu...' : 'Xác nhận'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Drawer lịch sử */}
            {openHistoryFor && (
                <div className={styles.drawer} role='dialog' aria-modal='true'>
                    <div className={styles.drawerHeader}>
                        <strong>Lịch sử điều chỉnh</strong>
                        <div className={styles.drawerHeaderActions}>
                            <button
                                onClick={() => {
                                    clearHistory(openHistoryFor);
                                }}
                            >
                                Xóa lịch sử
                            </button>
                            <button onClick={closeHistory}>Đóng</button>
                        </div>
                    </div>
                    <div className={styles.drawerBody}>
                        {(() => {
                            const logs = getHistory(openHistoryFor);
                            if (!logs.length) return <em>Chưa có lịch sử.</em>;
                            return (
                                <ul className={styles.historyList}>
                                    {logs.map((r) => {
                                        const when = new Date(
                                            r.at
                                        ).toLocaleString('vi-VN');
                                        return (
                                            <li
                                                key={r.id}
                                                className={styles.historyItem}
                                            >
                                                <div
                                                    className={
                                                        styles.historyHeader
                                                    }
                                                >
                                                    <span
                                                        className={styles.tag}
                                                    >
                                                        {when}
                                                    </span>
                                                    <span
                                                        className={styles.tag}
                                                    >
                                                        {r.by}
                                                    </span>
                                                    <span
                                                        className={styles.tag}
                                                    >
                                                        {r.reason}
                                                    </span>
                                                    {r.note ? (
                                                        <span
                                                            className={
                                                                styles.tagMuted
                                                            }
                                                        >
                                                            {r.note}
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <div
                                                    className={
                                                        styles.historyChanges
                                                    }
                                                >
                                                    {r.changes.map((c, i) => (
                                                        <div
                                                            key={i}
                                                            className={
                                                                styles.changeRow
                                                            }
                                                        >
                                                            <span
                                                                className={
                                                                    styles.changeSize
                                                                }
                                                            >
                                                                {c.name}
                                                            </span>
                                                            <span
                                                                className={
                                                                    styles.changeDelta
                                                                }
                                                            >
                                                                {c.delta > 0
                                                                    ? `+${c.delta}`
                                                                    : c.delta}
                                                            </span>
                                                            <span
                                                                className={
                                                                    styles.changeAfter
                                                                }
                                                            >
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
                </div>
            )}
        </div>
    );
}

export default ProductAdmin;
