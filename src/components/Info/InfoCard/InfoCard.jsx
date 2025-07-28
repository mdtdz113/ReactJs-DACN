import styles from '../styles.module.scss';
import truck from '@icons/svgs/truck.svg';
function InfoCard({ title, description, src }) {
    
    const { containerCard, containerContent } = styles;
    return (
        <div className={containerCard}>
            <img width={40} height={40} src={src} alt='' />
            <div className={containerContent}>
                <div>{title}</div>
                <div>{description}</div>
            </div>
        </div>
    );
}

export default InfoCard;
