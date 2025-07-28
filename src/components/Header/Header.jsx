import BoxIcon from './BoxIcon/BoxIcon';
import { dataBoxIcon, dataMenu } from './constants';
import style from './styles.module.scss';
import Menu from './Menu/Menu';
import logo from '@icons/images/logo.webp';

import useScrollHandling from '@/hook/useScrollHandling';
import { useEffect } from 'react';
import { useState } from 'react';
import classNames from 'classnames';
import { SideBarContext } from '@/context/SideBarProvider';
import { useContext } from 'react';
import { TfiReload } from 'react-icons/tfi';
import { IoHeartOutline } from 'react-icons/io5';
import { IoCartOutline } from 'react-icons/io5';
function MyHeader() {
    const {
        containerHeader,
        containerBoxIcon,
        containerMenu,
        containerBox,
        container,
        fixedHeader,
        topHeader,
        boxCart,
        quantity
    } = style;

    const { scrollPosition } = useScrollHandling();
    const [fixedPosition, setFixedPosition] = useState(false);
    const { setType, setIsOpen, listProductCart } = useContext(SideBarContext);

    const handleOpenSidebar = (type) => {
        setIsOpen(true);
        setType(type);
    };

    useEffect(() => {
        if (scrollPosition > 80) {
            setFixedPosition(true);
        } else {
            setFixedPosition(false);
        }
    }, [scrollPosition]);

    return (
        <div
            className={classNames(container, topHeader, {
                [fixedHeader]: fixedPosition
            })}
        >
            <div className={containerHeader}>
                <div className={containerMenu}>
                    <div className={containerBoxIcon}>
                        {dataBoxIcon.map((item) => {
                            return (
                                <BoxIcon type={item.type} href={item.href} />
                            );
                        })}
                    </div>
                    <div className={containerMenu}>
                        {dataMenu.slice(0, 3).map((item) => {
                            return (
                                <Menu content={item.content} href={item.href} />
                            );
                        })}
                    </div>
                </div>
                <div>
                    <img
                        src={logo}
                        alt='logo'
                        style={{ width: '153px', height: '53px' }}
                    />
                </div>
                <div className={containerBox}>
                    <div className={containerMenu}>
                        {dataMenu.slice(3, dataMenu.length).map((item) => {
                            return (
                                <Menu content={item.content} href={item.href} />
                            );
                        })}
                    </div>
                    <div className={containerBoxIcon}>
                        <TfiReload
                            style={{ fontSize: '23px' }}
                            onClick={() => handleOpenSidebar('compare')}
                        />
                        <IoHeartOutline
                            style={{ fontSize: '25px' }}
                            onClick={() => handleOpenSidebar('wishlist')}
                        />
                        <div className={boxCart}>
                            <IoCartOutline
                                style={{ fontSize: '25px' }}
                                onClick={() => handleOpenSidebar('cart')}
                            />
                            <div className={quantity}>
                                {listProductCart.length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyHeader;
