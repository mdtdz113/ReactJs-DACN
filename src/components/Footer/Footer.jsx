import styles from './styles.module.scss';

function MyFooter() {
    const { container, content, content1 } = styles;
    return (
        <div className={container}>
            <div className={content}>
                <img
                    src='https://xstore.b-cdn.net/elementor2/marseille04/wp-content/uploads/sites/2/2022/12/marseille-logo.png'
                    alt=''
                />
            </div>
            <div className={content1}>
                <div>Trang chủ</div>
                <div>Phần tử</div>
                <div>Cửa hàng</div>
                <div>Blog</div>
                <div>Giới thiệu</div>
                <div>Liên hệ</div>
                <div>So sánh</div>
            </div>
            <div className={content1}>Đảm bảo thanh toán an toàn</div>
            <div className={content1}>
                <img
                    src='https://xstore.b-cdn.net/elementor2/marseille04/wp-content/uploads/sites/2/elementor/thumbs/Icons-123-pzks3go5g30b2zz95xno9hgdw0h3o8xu97fbaqhtb6.png'
                    alt=''
                />
            </div>
            <div className={content1}>
                Bản quyền © 2024 XStore theme. Được tạo bởi Mai Đình Trường –
                Chủ đề Commerce cho WordPress.
            </div>
        </div>
    );
}

export default MyFooter;
