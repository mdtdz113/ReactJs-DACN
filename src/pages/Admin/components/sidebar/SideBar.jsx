import { useEffect, useRef, useState } from 'react';
import {
    FaTachometerAlt,
    FaBox,
    FaShoppingCart,
    FaUsers,
    FaTags
} from 'react-icons/fa';
import styles from './styles.module.scss';

function SideBar({ onSelect, selected }) {
    const {
        sidebar,
        sidebarHeader,
        collapseBtn,
        menu,
        item,
        active,
        icon,
        label,
        tooltip,
        collapsed
    } = styles;

    const [isCollapsed, setIsCollapsed] = useState(false);
    const listRef = useRef(null);

    const data = [
        { name: 'TRANG CHỦ', value: 1, icon: <FaTachometerAlt /> },
        { name: 'SẢN PHẨM', value: 2, icon: <FaBox /> },
        { name: 'ĐƠN HÀNG', value: 3, icon: <FaShoppingCart /> },
        { name: 'NGƯỜI DÙNG', value: 4, icon: <FaUsers /> },
        { name: 'KHUYẾN MẠI', value: 5, icon: <FaTags /> }
    ];

    // Điều hướng bằng bàn phím (↑ ↓ Enter/Space)
    useEffect(() => {
        const el = listRef.current;
        if (!el) return;
        const items = Array.from(el.querySelectorAll('[data-menu-item]'));
        const onKey = (e) => {
            const current = document.activeElement;
            const idx = items.indexOf(current);
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const next = items[(idx + 1) % items.length];
                next?.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prev = items[(idx - 1 + items.length) % items.length];
                prev?.focus();
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                current?.click();
            }
        };
        el.addEventListener('keydown', onKey);
        return () => el.removeEventListener('keydown', onKey);
    }, []);

    return (
        <aside
            className={`${sidebar} ${isCollapsed ? collapsed : ''}`}
            aria-label='Main navigation'
        >
            <div className={sidebarHeader}>
                <button
                    className={collapseBtn}
                    onClick={() => setIsCollapsed((v) => !v)}
                    aria-pressed={isCollapsed}
                    aria-label={
                        isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
                    }
                    title={isCollapsed ? 'Expand' : 'Collapse'}
                >
                    {isCollapsed ? '»' : '«'}
                </button>
            </div>

            <nav ref={listRef} className={menu} role='navigation'>
                {data.map((m) => (
                    <button
                        key={m.value}
                        data-menu-item
                        className={`${item} ${selected === m.value ? active : ''}`}
                        onClick={() => onSelect?.(m.value)}
                        aria-current={selected === m.value ? 'page' : undefined}
                        title={isCollapsed ? m.name : undefined}
                    >
                        <span className={icon}>{m.icon}</span>
                        <span className={label}>{m.name}</span>
                        {isCollapsed && (
                            <span className={tooltip}>{m.name}</span>
                        )}
                    </button>
                ))}
            </nav>
        </aside>
    );
}

export default SideBar;
