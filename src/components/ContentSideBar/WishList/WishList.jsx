import ItemProduct from '@components/ContentSideBar/components/ItemProduct/ItemProduct';
import styles from './styles.module.scss';
import { IoIosHeartEmpty } from 'react-icons/io';
import HeaderSidebar from '@components/ContentSideBar/components/HeaderSidebar/HeaderSidebar';
import MyButton from '@components/Button/Button';
import MyButtonWhist from '@components/Button/ButtonWhist';

function WishList() {
    const { container, btnWist } = styles;

    return (
        <div className={container}>
            <div>
                <HeaderSidebar
                    icon={<IoIosHeartEmpty style={{ fontSize: '40px' }} />}
                    title={'Wish List'}
                />
                <ItemProduct />
                <ItemProduct />
            </div>
            <div>
                <div className={btnWist}>
                    <MyButton content={'VIEW WISTLIST'} />
                </div>
                <div>
                    <MyButtonWhist content={'ADD ALL TO CART'} />
                </div>
            </div>
        </div>
    );
}

export default WishList;
