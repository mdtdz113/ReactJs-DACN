import style from './styles.module.scss';

function Banner() {
    const { container, content, btn } = style;
    return (
        <div className={container}>
            <div className={content}>
                <div>
                    <h1>XStore Marseille04</h1>
                </div>
                <div>
                    Cùng XStore tạo nên những khoảnh khắc lễ hội thật đặc biệt.
                </div>
                <div>
                    <button className={btn}>Đi đến cửa hàng</button>
                </div>
            </div>
        </div>
    );
}

export default Banner;
