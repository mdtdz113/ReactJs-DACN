import React from 'react';
import styles from '../../styles.module.scss';
import { FaRegTrashCan } from 'react-icons/fa6';
import SelectBox from '@/pages/components/SelectBox';
import LoadingCart from '@/pages/Cart/components/LoadingCart';

function CartTable({ listProductCart, getData, isLoading, getDataDelete }) {
    const showOptions = [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
        { label: '6', value: '6' },
        { label: '7', value: '7' }
    ];
    const { cartTable, product } = styles;
    const handleQuantityChange = (id, newQuantity) => {
        console.log('Update item:', id, 'to quantity:', newQuantity);
    };

    const getValueSelect = (userId, productId, quantity, size) => {
        const data = {
            userId,
            productId,
            quantity,
            size,
            isMultiple: true
        };
        getData(data);
    };
    return (
        <div className={cartTable}>
            <table>
                <thead>
                    <tr>
                        <th>PRODUCT</th>
                        <th></th>
                        <th>PRICE</th>
                        <th>SKU</th>
                        <th>QUANTITY</th>
                        <th>SUBTOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    {listProductCart.map((item) => (
                        <tr key={item.id}>
                            <td className={product}>
                                <img src={item.images[0]} alt={item.name} />
                                <div>
                                    <h4>{item.name}</h4>
                                    <p>Size: {item.size}</p>
                                </div>
                            </td>
                            <td>
                                <FaRegTrashCan
                                    onClick={() =>
                                        getDataDelete({
                                            userId: item.userId,
                                            productId: item.productId
                                        })
                                    }
                                    style={{ cursor: 'pointer' }}
                                />
                            </td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>{item.sku}</td>
                            <td>
                                <SelectBox
                                    options={showOptions}
                                    getValue={(e) =>
                                        getValueSelect(
                                            item.userId,
                                            item.productId,
                                            e,
                                            item.size
                                        )
                                    }
                                    type='show'
                                    defaultValue={item.quantity}
                                />
                            </td>
                            <td>${item.total.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isLoading && <LoadingCart />}
        </div>
    );
}

export default CartTable;
