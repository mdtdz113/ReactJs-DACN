import { deleteItem } from '@/apis/cartService';
import styles from './styles.module.scss';
import { IoClose } from 'react-icons/io5';
import { useContext, useState } from 'react';
import { SideBarContext } from '@/context/SideBarProvider';
import Loading from '@components/Loading/Loading';
function ItemProduct({
    src,
    nameProduct,
    priceProduct,
    skuProduct,
    sizeProduct,
    quantity,
    productId,
    userId
}) {
    const {
        container,
        boxIcon,
        title,
        des,
        boxClose,
        boxContent,
        size,
        price,
        overLayLoading
    } = styles;
    const [isDelete, setIsDelete] = useState(false);
    const { hangleGetListProductCart } = useContext(SideBarContext);
    const hangleRemoveItem = () => {
        setIsDelete(true);
        deleteItem({
            productId,
            userId
        })
            .then((res) => {
                setIsDelete(false);
                hangleGetListProductCart(userId, 'cart');
            })
            .catch((err) => {
                console.log(err);
                setIsDelete(false);
            });
    };
    return (
        <div className={container}>
            <img src={src} alt='' />
            <div className={boxClose} onClick={() => hangleRemoveItem()}>
                <IoClose
                    style={{
                        fontSize: '20px',
                        color: '#c1c1c1'
                    }}
                />
            </div>
            <div className={boxIcon}>
                <div className={title}>{nameProduct}t</div>
                <div className={size}>Size: {sizeProduct}</div>
                <div className={price}>
                    {' '}
                    {quantity} x {priceProduct} VND
                </div>
                <div className={price}>SKU: {skuProduct}</div>
            </div>

            {isDelete && (
                <div className={overLayLoading}>
                    <Loading />
                </div>
            )}
        </div>
    );
}

export default ItemProduct;
