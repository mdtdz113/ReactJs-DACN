import { TfiLayoutGrid4 } from 'react-icons/tfi';
import { CiBoxList } from 'react-icons/ci';
import styles from '../OurShop/styles.module.scss';
import cls from 'classnames';
import { useContext } from 'react';
import { OurShopContext } from '@/context/OurShopProvider';
import SelectBox from '@/pages/components/SelectBox';
function Filter() {
    const { containerFilter, boxIcon, boxItems, selextBox, sort, show } =
        styles;
    const { showOptions, sortOptions, setSortId, setShowId, setIsShowGrid } =
        useContext(OurShopContext);

    const getValueSelect = (value, type) => {
        if (type === 'sort') {
            setSortId(value);
        } else {
            setShowId(value);
        }
    };

    const handleGetShowGrid = (type) => {
        if (type === 'grid') {
            setIsShowGrid(true);
        } else {
            setIsShowGrid(false);
        }
    };
    return (
        <div className={containerFilter}>
            <div className={boxIcon}>
                {/* <select className={cls(selextBox, sort)}>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>                 
                </select> */}
                <SelectBox
                    options={sortOptions}
                    getValue={getValueSelect}
                    type='sort'
                />
                <div />
                <div className={boxItems}>
                    <TfiLayoutGrid4
                        style={{ fontSize: '25px', cursor: 'pointer' }}
                        onClick={() => handleGetShowGrid('grid')}
                    />
                    <div
                        style={{
                            height: '25px',
                            width: '1px',
                            backgroundColor: '#e1e1e1'
                        }}
                    ></div>
                    <CiBoxList
                        style={{ fontSize: '25px', cursor: 'pointer' }}
                        onClick={() => handleGetShowGrid('list')}
                    />
                </div>
            </div>
            <div className={boxIcon}>
                <div>Show</div>
                {/* <select className={cls(selextBox, show)}>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                </select> */}
                <SelectBox
                    options={showOptions}
                    getValue={getValueSelect}
                    type='show'
                />
            </div>
        </div>
    );
}

export default Filter;
