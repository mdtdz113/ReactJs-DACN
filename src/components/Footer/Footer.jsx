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
                <div>Home</div>
                <div>Element</div>
                <div>Shop</div>
                <div>Blog</div>
                <div>About</div>
                <div>Contact Us</div>
                <div>Compare</div>
            </div>
            <div className={content1}>Guaranteed safe ckeckout</div>
            <div className={content1}>
                <img
                    src='https://xstore.b-cdn.net/elementor2/marseille04/wp-content/uploads/sites/2/elementor/thumbs/Icons-123-pzks3go5g30b2zz95xno9hgdw0h3o8xu97fbaqhtb6.png'
                    alt=''
                />
            </div>
            <div className={content1}>Copyright © 2024 XStore theme. Created by 8theme – WordPress WooCommerce themes.</div>
        </div>
    );
}

export default MyFooter;
