import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import styles from './styles.module.scss';
import { StoreContext } from '@/context/storeProvider';

function HeaderAdmin() {
    const {
        headerAdmin,
        container,
        logoIma,
        logoAdmin,
        adminMenu,
        adminSubmenu
    } = styles;
    const navigate = useNavigate();
    const { userInfo, handlelogOut } = useContext(StoreContext);
    const [open, setOpen] = useState(false);

    const displayName =
        userInfo?.username || Cookies.get('userName') || 'Admin';

    const handleLogoutAndRedirect = () => {
        handlelogOut(); // gọi hàm logout có sẵn
        navigate('/shop'); // điều hướng về trang shop
    };

    return (
        <div className={container}>
            <div className={logoIma}>
                <img
                    src='https://xstore.8theme.com/elementor/demos/minimal-electronics/wp-content/uploads/sites/71/2022/02/Logo@2x.png'
                    alt=''
                />
            </div>

            <div className={headerAdmin}>
                <div
                    className={adminMenu}
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}
                >
                    Xin chào: {displayName}
                </div>

                <div className={logoAdmin}>
                    <img
                        src='https://png.pngtree.com/png-vector/20190223/ourlarge/pngtree-admin-rolls-glyph-black-icon-png-image_691507.jpg'
                        alt=''
                    />
                </div>
                <div className={adminSubmenu} onClick={handleLogoutAndRedirect}>
                    ĐĂNG XUẤT
                </div>
            </div>
        </div>
    );
}

export default HeaderAdmin;
