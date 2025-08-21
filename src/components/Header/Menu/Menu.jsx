import { useContext, useState } from 'react';
import styles from '../styles.module.scss';
import { SideBarContext } from '@/context/SideBarProvider';
import { StoreContext } from '@/context/storeProvider';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function Menu({ content, href }) {
    const { menu, submenu } = styles;
    const { setIsOpen, setType } = useContext(SideBarContext);
    const { userInfo, handlelogOut } = useContext(StoreContext);
    const [isShowSubMenu, setIsShowSubMenu] = useState(false);
    const navigate = useNavigate();

    const handleClickShowLogin = () => {
        if (content === 'Đăng nhập' && !userInfo) {
            setIsOpen(true);
            setType('login');
        }
        if (content === 'Cửa hàng') {
            navigate('/shop');
        }

        if (content === 'Giới thiệu') {
            navigate('/about-us');
        }
        if (content === 'Trang chủ') {
            navigate('/');
        }

        if (content === 'Đơn hàng') {
            navigate('/ViewOrder');
        }
    };

    const handleRenderText = (content) => {
        if (content === 'Đăng nhập' && userInfo) {
            return `Xin chào: ${userInfo?.username}`;
        } else {
            return content;
        }
    };
    const handleGover = () => {
        if (content === 'Đăng nhập' && userInfo) {
            setIsShowSubMenu(true);
        }
    };
    // const handleLognOut = () => {
    //     Cookies.remove('userId');
    //     Cookies.remove('token');
    //     Cookies.remove('refreshToken');
    //     window.location.reload();
    //     setIsShowSubMenu(false);

    // };
    return (
        <div
            className={menu}
            onMouseEnter={handleGover}
            onClick={handleClickShowLogin}
        >
            {handleRenderText(content)}
            {isShowSubMenu && (
                <div
                    onMouseLeave={() => setIsShowSubMenu(false)}
                    className={submenu}
                    onClick={handlelogOut}
                >
                    ĐĂNG XUẤT
                </div>
            )}
        </div>
    );
}

export default Menu;
