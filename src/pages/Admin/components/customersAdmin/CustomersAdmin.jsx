// CustomersAdmin.jsx
import { useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss';
import {
    getAllUser,
    deleteUser,
    updateUser,
    lockUser,
    createUser
} from '@/apis/authSercice';

function CustomersAdmin() {
    const {
        page,
        pageHeader,
        pageTitle,
        toolbar,
        searchInput,
        addForm,
        input,
        select,
        btn,
        btnPrimary,
        btnGhost,
        btnDanger,
        tableWrap,
        table,
        thead,
        tbody,
        actions,
        tag,
        tagLocked,
        tagOpen,
        empty,
        footer,
        pagination,
        pageBtn,
        pageBtnActive,
        cardList,
        card,
        cardRow,
        cardActions,
        hint
    } = styles;

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // Search + phân trang (client-side để khỏi đổi backend)
    const [query, setQuery] = useState('');
    const [pageIdx, setPageIdx] = useState(1);
    const PAGE_SIZE = 8;

    // form tạo user
    const [newUser, setNewUser] = useState({
        username: '',
        password: '',
        role: 'user'
    });

    // form sửa inline
    const [editing, setEditing] = useState(null); // userId
    const [editData, setEditData] = useState({
        username: '',
        role: 'user',
        password: ''
    });

    const fetchUsers = () => {
        setLoading(true);
        getAllUser()
            .then((res) => setUsers(res.data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // lọc theo từ khóa
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return users;
        return users.filter(
            (u) =>
                u.username?.toLowerCase().includes(q) ||
                u.role?.toLowerCase().includes(q)
        );
    }, [users, query]);

    // tính trang
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const current = useMemo(() => {
        const start = (pageIdx - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, pageIdx]);

    useEffect(() => {
        if (pageIdx > totalPages) setPageIdx(totalPages);
    }, [totalPages, pageIdx]);

    const resetEdit = () => {
        setEditing(null);
        setEditData({ username: '', role: 'user', password: '' });
    };

    const onStartEdit = (u) => {
        setEditing(u._id);
        setEditData({ username: u.username, role: u.role, password: '' });
    };

    const onSaveEdit = async (id) => {
        const payload = { username: editData.username, role: editData.role };
        if (editData.password?.trim())
            payload.password = editData.password.trim();
        await updateUser(id, payload);
        resetEdit();
        fetchUsers();
    };

    const onToggleLock = async (u) => {
        await lockUser(u._id, !u.isLocked);
        fetchUsers();
    };

    const onDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa user này?')) return;
        await deleteUser(id);
        fetchUsers();
    };

    const onCreate = async (e) => {
        e.preventDefault();
        if (!newUser.username.trim() || !newUser.password.trim()) {
            alert('Vui lòng nhập username và password');
            return;
        }
        await createUser(newUser);
        setNewUser({ username: '', password: '', role: 'user' });
        setQuery('');
        setPageIdx(1);
        fetchUsers();
    };

    return (
        <div className={page}>
            {/* Header */}
            <div className={pageHeader}>
                <h1 className={pageTitle}>Quản lý người dùng</h1>
                <div className={toolbar}>
                    <input
                        className={searchInput}
                        placeholder='Tìm theo username hoặc role…'
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setPageIdx(1);
                        }}
                        aria-label='Tìm kiếm người dùng'
                    />
                </div>
            </div>

            {/* Add form (inline, nhẹ nhàng) */}
            <form className={addForm} onSubmit={onCreate}>
                <input
                    className={input}
                    placeholder='Username mới'
                    value={newUser.username}
                    onChange={(e) =>
                        setNewUser({ ...newUser, username: e.target.value })
                    }
                />
                <input
                    className={input}
                    type='password'
                    placeholder='Password'
                    value={newUser.password}
                    onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                    }
                />
                <select
                    className={select}
                    value={newUser.role}
                    onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                    }
                >
                    <option value='user'>User</option>
                    <option value='admin'>Admin</option>
                </select>
                <button className={`${btn} ${btnPrimary}`} type='submit'>
                    Thêm user
                </button>
            </form>

            {/* Bảng trên desktop, thẻ card trên mobile */}
            <div className={tableWrap} aria-live='polite'>
                {loading ? (
                    <div className={hint}>Đang tải…</div>
                ) : filtered.length === 0 ? (
                    <div className={empty}>
                        Không có người dùng nào khớp bộ lọc.
                    </div>
                ) : (
                    <>
                        {/* Desktop: table */}
                        <table className={table} role='table'>
                            <thead className={thead}>
                                <tr>
                                    <th>Username</th>
                                    <th>Vai trò</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody className={tbody}>
                                {current.map((u) => (
                                    <tr key={u._id}>
                                        <td>
                                            {editing === u._id ? (
                                                <input
                                                    className={input}
                                                    value={editData.username}
                                                    onChange={(e) =>
                                                        setEditData({
                                                            ...editData,
                                                            username:
                                                                e.target.value
                                                        })
                                                    }
                                                />
                                            ) : (
                                                u.username
                                            )}
                                        </td>
                                        <td>
                                            {editing === u._id ? (
                                                <select
                                                    className={select}
                                                    value={editData.role}
                                                    onChange={(e) =>
                                                        setEditData({
                                                            ...editData,
                                                            role: e.target.value
                                                        })
                                                    }
                                                >
                                                    <option value='user'>
                                                        User
                                                    </option>
                                                    <option value='admin'>
                                                        Admin
                                                    </option>
                                                </select>
                                            ) : (
                                                u.role
                                            )}
                                        </td>
                                        <td>
                                            <span
                                                className={`${tag} ${u.isLocked ? tagLocked : tagOpen}`}
                                            >
                                                {u.isLocked
                                                    ? 'Đã khóa'
                                                    : 'Đang mở'}
                                            </span>
                                        </td>
                                        <td className={actions}>
                                            {editing === u._id ? (
                                                <>
                                                    <button
                                                        className={`${btn} ${btnPrimary}`}
                                                        type='button'
                                                        onClick={() =>
                                                            onSaveEdit(u._id)
                                                        }
                                                    >
                                                        Lưu
                                                    </button>
                                                    <button
                                                        className={`${btn} ${btnGhost}`}
                                                        type='button'
                                                        onClick={resetEdit}
                                                    >
                                                        Hủy
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className={btn}
                                                        type='button'
                                                        onClick={() =>
                                                            onStartEdit(u)
                                                        }
                                                        aria-label={`Sửa ${u.username}`}
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button
                                                        className={btn}
                                                        type='button'
                                                        onClick={() =>
                                                            onToggleLock(u)
                                                        }
                                                        aria-label={`Khoá/Mở ${u.username}`}
                                                    >
                                                        {u.isLocked
                                                            ? 'Mở khóa'
                                                            : 'Khóa'}
                                                    </button>
                                                    <button
                                                        className={`${btn} ${btnDanger}`}
                                                        type='button'
                                                        onClick={() =>
                                                            onDelete(u._id)
                                                        }
                                                        aria-label={`Xoá ${u.username}`}
                                                    >
                                                        Xóa
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Mobile: cards (hiển thị cùng lúc, ẩn table bằng CSS ở màn nhỏ) */}
                        <div className={cardList} role='list'>
                            {current.map((u) => (
                                <div
                                    className={card}
                                    role='listitem'
                                    key={`card-${u._id}`}
                                >
                                    <div className={cardRow}>
                                        <strong>Username</strong>
                                        {editing === u._id ? (
                                            <input
                                                className={input}
                                                value={editData.username}
                                                onChange={(e) =>
                                                    setEditData({
                                                        ...editData,
                                                        username: e.target.value
                                                    })
                                                }
                                            />
                                        ) : (
                                            <span>{u.username}</span>
                                        )}
                                    </div>
                                    <div className={cardRow}>
                                        <strong>Vai trò</strong>
                                        {editing === u._id ? (
                                            <select
                                                className={select}
                                                value={editData.role}
                                                onChange={(e) =>
                                                    setEditData({
                                                        ...editData,
                                                        role: e.target.value
                                                    })
                                                }
                                            >
                                                <option value='user'>
                                                    User
                                                </option>
                                                <option value='admin'>
                                                    Admin
                                                </option>
                                            </select>
                                        ) : (
                                            <span>{u.role}</span>
                                        )}
                                    </div>
                                    <div className={cardRow}>
                                        <strong>Trạng thái</strong>
                                        <span
                                            className={`${tag} ${u.isLocked ? tagLocked : tagOpen}`}
                                        >
                                            {u.isLocked ? 'Đã khóa' : 'Đang mở'}
                                        </span>
                                    </div>

                                    <div className={cardActions}>
                                        {editing === u._id ? (
                                            <>
                                                <input
                                                    className={input}
                                                    type='password'
                                                    placeholder='(Tùy chọn) Đổi mật khẩu'
                                                    value={editData.password}
                                                    onChange={(e) =>
                                                        setEditData({
                                                            ...editData,
                                                            password:
                                                                e.target.value
                                                        })
                                                    }
                                                />
                                                <button
                                                    className={`${btn} ${btnPrimary}`}
                                                    type='button'
                                                    onClick={() =>
                                                        onSaveEdit(u._id)
                                                    }
                                                >
                                                    Lưu
                                                </button>
                                                <button
                                                    className={`${btn} ${btnGhost}`}
                                                    type='button'
                                                    onClick={resetEdit}
                                                >
                                                    Hủy
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className={btn}
                                                    type='button'
                                                    onClick={() =>
                                                        onStartEdit(u)
                                                    }
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    className={btn}
                                                    type='button'
                                                    onClick={() =>
                                                        onToggleLock(u)
                                                    }
                                                >
                                                    {u.isLocked
                                                        ? 'Mở khóa'
                                                        : 'Khóa'}
                                                </button>
                                                <button
                                                    className={`${btn} ${btnDanger}`}
                                                    type='button'
                                                    onClick={() =>
                                                        onDelete(u._id)
                                                    }
                                                >
                                                    Xóa
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Footer / Pagination */}
            <div className={footer}>
                <div
                    className={pagination}
                    role='navigation'
                    aria-label='Pagination'
                >
                    {Array.from({ length: totalPages }).map((_, i) => {
                        const n = i + 1;
                        const active = n === pageIdx;
                        return (
                            <button
                                key={n}
                                className={`${pageBtn} ${active ? pageBtnActive : ''}`}
                                onClick={() => setPageIdx(n)}
                                aria-current={active ? 'page' : undefined}
                            >
                                {n}
                            </button>
                        );
                    })}
                </div>
                <div className={hint}>
                    Hiển thị {current.length} / {filtered.length} người dùng
                </div>
            </div>
        </div>
    );
}

export default CustomersAdmin;
