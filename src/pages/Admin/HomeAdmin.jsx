import { useState } from 'react';
import styles from './styles.module.scss';
import HeaderAdmin from '@/pages/Admin/components/HeaderAdmin/HeaderAdmin';

import Dashboard from '@/pages/Admin/components/dashboard/dashboard';
import ProductAdmin from '@/pages/Admin/components/productsAdmin/ProductAdmin';
import SideBar from '@/pages/Admin/components/sidebar/SideBar';
import { OurShopProvider } from '@/context/OurShopProvider';
import CustomersAdmin from '@/pages/Admin/components/customersAdmin/CustomersAdmin';
import OrderAdmin from '@/pages/Admin/components/ordersAdmin/OrrderAdmin';
import Promotion from '@/pages/Admin/components/promotion/Promotion';

function AdminHome() {
    const { container, content } = styles;
    const [selectedItem, setSelectedItem] = useState(1);

    // Hàm này sẽ được truyền xuống Sidebar để cập nhật state
    const handleItemClick = (value) => {
        setSelectedItem(value);
    };
    const renderContent = () => {
        switch (selectedItem) {
            case 1:
                return <Dashboard />;
            case 2:
                return <ProductAdmin />;
            case 3:
                return <OrderAdmin />;
            case 4:
                return <CustomersAdmin />;
            case 5:
                return <Promotion />;

            default:
                return <Dashboard />;
        }
    };
    return (
        <OurShopProvider>
            <HeaderAdmin />

            <div className={container}>
                <SideBar onSelect={handleItemClick} selected={selectedItem} />
                <div className={content}>{renderContent()} </div>
            </div>
        </OurShopProvider>
    );
}

export default AdminHome;
