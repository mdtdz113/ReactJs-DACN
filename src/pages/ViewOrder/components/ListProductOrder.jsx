import React from 'react';
import styles from './styles.module.scss';

function ListproductOrder({ products }) {
    // Chỉ lấy class productListContainer từ file styles
    const { productListContainer } = styles;

    if (!products || !Array.isArray(products) || products.length === 0) {
        return (
            <div className={styles.noProducts}>
                <p>Đơn hàng này không có sản phẩm nào.</p>
            </div>
        );
    }

    return (
        // Sử dụng đúng class là productListContainer
        <div className={productListContainer}>
            <h3>Danh sách sản phẩm</h3>
            {/* Thẻ table sẽ tự động nhận style từ class cha */}
            <table>
                <thead>
                    <tr>
                        <th>Tên sản phẩm</th>
                        
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Tổng cộng</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.productId}>
                            <td>{product.name}</td>
                            <td>{product.price.toLocaleString('vi-VN')} VNĐ</td>
                            <td>{product.quantity}</td>
                            <td>
                                {(
                                    product.price * product.quantity
                                ).toLocaleString('vi-VN')}{' '}
                                VNĐ
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListproductOrder;
