import style from './styles.module.scss';

function Banner() {
    const { container, content, btn } = style;
    return (
        <div className={container}>
            <div className={content}>
                <div>
                    <h1>XStore Marseille04 Demo</h1>
                </div>
                <div>
                    Make yours celebrations even more special this years with
                    beautiful.
                </div>
                <div>
                    <button className={btn}>Go to shop</button>
                </div>
            </div>
        </div>
    );
}

export default Banner;
