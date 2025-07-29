import { useContext } from 'react';
import styles from './styles.module.scss';
import { SideBarContext } from '@/context/SideBarProvider';
import classNames from 'classnames';
import { IoMdClose } from 'react-icons/io';
import Login from '@components/ContentSideBar/Login/Login';
import Compare from '@components/ContentSideBar/Compare/Compare';
import WishList from '@components/ContentSideBar/WishList/WishList';
import Cart from '@components/ContentSideBar/Cart/Cart';
import DetailProducts from '@components/ContentSideBar/DetailProduct/DetailProducts';
function SideBar() {
    const { container, overlay, sideBar, slideSideBar, boxIcon } = styles;
    const { isOpen, setIsOpen, type } = useContext(SideBarContext);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleRenderContent = () => {
        switch (type) {
            case 'login':
                return <Login />;
            case 'compare':
                return <Compare />;
            case 'wishlist':
                return <WishList />;
            case 'cart':
                return <Cart />;
            case 'detail':
                return <DetailProducts />;
            default:
                break;
        }
    };
    return (
        <div className={container}>
            <div
                className={classNames({
                    [overlay]: isOpen
                })}
                onClick={handleToggle}
            ></div>

            <div
                className={classNames(sideBar, {
                    [slideSideBar]: isOpen
                })}
            >
                {isOpen && (
                    <div className={boxIcon}>
                        <IoMdClose />
                    </div>
                )}
                {handleRenderContent()}
            </div>
        </div>
    );
}

export default SideBar;
