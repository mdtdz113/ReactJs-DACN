import HeaderSidebar from '@components/ContentSideBar/components/HeaderSidebar/HeaderSidebar';
import { TfiReload } from 'react-icons/tfi';
import styles from './styles.module.scss';
import ItemProduct from '@components/ContentSideBar/components/ItemProduct/ItemProduct';
import MyButton from '@components/Button/Button';
function Compare() {
    const { container, btn, boxContent } = styles;

    return (
        <div className={container}>
            <div className={boxContent}>
                <HeaderSidebar
                    icon={<TfiReload style={{ fontSize: '40px' }} />}
                    title={'COMPARE'}
                />
                <ItemProduct />
                <ItemProduct />
            </div>
            <div className={btn}>
                <MyButton content={'VIEW COMPARE'} />
            </div>
        </div>
    );
}

export default Compare;
