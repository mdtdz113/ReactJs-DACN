import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { getAllKM } from '@/apis/promotion';
import styles from './styles.module.scss';
import { FaTrash, FaInfoCircle, FaPlus } from 'react-icons/fa';

function Promotion() {
    const [data, setData] = useState([]);

    const getAllpromotion = () => {
        const token = Cookies.get('token');
        if (!token) {
            console.error('Không tìm thấy token!');
            return;
        }
        getAllKM(token)
            .then((res) => setData(res.data.data))
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        getAllpromotion();
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h2>🎉 Danh sách khuyến mãi</h2>
                <button className={styles.addBtn}>
                    <FaPlus /> Thêm khuyến mãi
                </button>
            </div>

            {/* Grid 2 cột */}
            <div className={styles.grid}>
                {data.map((item) => (
                    <div className={styles.card} key={item._id}>
                        <h3>{item.name}</h3>
                        <p>
                            <strong>Bắt đầu:</strong> {item.startAt}
                        </p>
                        <p>
                            <strong>Kết thúc:</strong> {item.endAt}
                        </p>
                        <p className={styles.percent}>Giảm {item.percent}%</p>
                        <div className={styles.actions}>
                            <button className={styles.detailBtn}>
                                <FaInfoCircle /> Chi tiết
                            </button>
                            <button className={styles.deleteBtn}>
                                <FaTrash /> Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Promotion;
