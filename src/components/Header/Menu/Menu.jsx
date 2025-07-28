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
        if (content === 'Sign in' && !userInfo) {
            setIsOpen(true);
            setType('login');
        }
        if(content === 'Our Shop'){
            navigate('/shop')
        }
    };

    const handleRenderText = (content) => {
        if (content === 'Sign in' && userInfo) {
            return `Hello: ${userInfo?.username}`;
        } else {
            return content;
        }
    };
    const handleGover = () => {
        if (content === 'Sign in' && userInfo) {
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
                    LOG OUT
                </div>
            )}
        </div>
    );
}

export default Menu;
