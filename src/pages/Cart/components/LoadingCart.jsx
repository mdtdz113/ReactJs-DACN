import Loading from '@components/Loading/Loading';
import styles from '../styles.module.scss';
function LoadingCart() {
    const { loadingCart } = styles;
    return (
        <div className={loadingCart}>
            <Loading />
        </div>
    );
}

export default LoadingCart;
