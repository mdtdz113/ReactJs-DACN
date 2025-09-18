import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import styles from './styles.module.scss';
import { StoreContext } from '@/context/storeProvider';

function HeaderAdmin() {
    const {
        headerShell, // khung header (mới)
        container, // layout max-width
        headerLeft,
        headerRight,
        logoIma,
        brandTitle,
        searchBox,
        searchInput,
        iconBtn,
        badge,
        avatarBtn,
        dropdown,
        dropdownItem,
        divider,
        greeting
    } = styles;

    const navigate = useNavigate();
    const { userInfo, handlelogOut } = useContext(StoreContext);

    const [menuOpen, setMenuOpen] = useState(false);
    const [hasNewNoti, setHasNewNoti] = useState(true); // ví dụ: có thông báo mới
    const menuRef = useRef(null);

    const displayName =
        userInfo?.username || Cookies.get('userName') || 'Admin';

    const handleLogoutAndRedirect = () => {
        handlelogOut();
        navigate('/shop');
    };

    // Đóng menu khi click ra ngoài hoặc nhấn ESC
    useEffect(() => {
        const onClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        const onKey = (e) => {
            if (e.key === 'Escape') setMenuOpen(false);
        };
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, []);

    return (
        <header className={headerShell} role='banner'>
            <div className={container}>
                {/* LEFT: Logo + Brand */}
                <div className={headerLeft}>
                    <a
                        className={logoIma}
                        href='/admin'
                        aria-label='Admin home'
                    >
                        <img
                            src='https://xstore.8theme.com/elementor/demos/minimal-electronics/wp-content/uploads/sites/71/2022/02/Logo@2x.png'
                            alt='XStore Admin'
                            loading='lazy'
                            decoding='async'
                        />
                    </a>
                    <span className={brandTitle} aria-hidden>
                        Admin
                    </span>
                </div>

                {/* CENTER: Search */}
                <div className={searchBox} role='search'>
                    <input
                        className={searchInput}
                        type='search'
                        placeholder='Search anything…'
                        aria-label='Search'
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                // TODO: điều hướng trang tìm kiếm của bạn
                                // navigate(`/admin/search?q=${encodeURIComponent(e.currentTarget.value)}`)
                            }
                        }}
                    />
                </div>

                {/* RIGHT: Icon actions + User */}
                <div className={headerRight}>
                    <span className={greeting}>Xin chào: {displayName}</span>

                    {/* Nút thông báo */}
                    <button
                        className={iconBtn}
                        aria-label='Notifications'
                        onClick={() => {
                            // TODO: mở panel thông báo
                            setHasNewNoti(false);
                        }}
                    >
                        {/* chuông SVG để không phụ thuộc lib */}
                        <svg
                            width='20'
                            height='20'
                            viewBox='0 0 24 24'
                            aria-hidden
                        >
                            <path
                                d='M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9'
                                fill='currentColor'
                            />
                        </svg>
                        {hasNewNoti && (
                            <span
                                className={badge}
                                aria-label='New notifications'
                            />
                        )}
                    </button>

                    {/* Avatar + Dropdown */}
                    <div ref={menuRef} style={{ position: 'relative' }}>
                        <button
                            className={avatarBtn}
                            aria-haspopup='menu'
                            aria-expanded={menuOpen}
                            aria-label='User menu'
                            onClick={() => setMenuOpen((v) => !v)}
                        >
                            <img
                                src='https://png.pngtree.com/png-vector/20190223/ourlarge/pngtree-admin-rolls-glyph-black-icon-png-image_691507.jpg'
                                alt=''
                                loading='lazy'
                                decoding='async'
                            />
                        </button>

                        {menuOpen && (
                            <div className={dropdown} role='menu'>
                                <button
                                    className={dropdownItem}
                                    role='menuitem'
                                    onClick={() => navigate('/admin/profile')}
                                >
                                    Hồ sơ
                                </button>
                                <button
                                    className={dropdownItem}
                                    role='menuitem'
                                    onClick={() => navigate('/admin/settings')}
                                >
                                    Cài đặt
                                </button>
                                <div className={divider} role='separator' />
                                <button
                                    className={dropdownItem}
                                    role='menuitem'
                                    onClick={handleLogoutAndRedirect}
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default HeaderAdmin;
