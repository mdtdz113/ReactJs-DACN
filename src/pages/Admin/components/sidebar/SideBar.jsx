import { useState } from 'react';
import {
    FaTachometerAlt,
    FaBox,
    FaShoppingCart,
    FaUsers
} from 'react-icons/fa';
import styles from './styles.module.scss';

function SideBar({ onSelect, selected }) {
    const { container, item, active } = styles;

    const data = [
        { name: 'DASHBOARD', value: 1, icon: <FaTachometerAlt /> },
        { name: 'PRODUCTS', value: 2, icon: <FaBox /> },
        { name: 'ORDERS', value: 3, icon: <FaShoppingCart /> },
        { name: 'CUSTOMERS', value: 4, icon: <FaUsers /> },
        
    ];

    return (
        <div className={container}>
            {data.map((itemMenu, index) => (
                <div
                    key={index}
                    className={`${item} ${selected === itemMenu.value ? active : ''}`}
                    onClick={() => onSelect(itemMenu.value)}
                >
                    <span className={styles.icon}>{itemMenu.icon}</span>
                    <span>{itemMenu.name}</span>
                </div>
            ))}
        </div>
    );
}

export default SideBar;
