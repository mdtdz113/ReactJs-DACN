import { dataInfo } from '@components/Info/constants';
import InfoCard from '@components/Info/InfoCard/InfoCard';
import MainLayout from '@components/Layout/Layout';
import styles from './styles.module.scss';
function Info() {
    const { conntainer } = styles;
    return (
        <div>
            <MainLayout>
                <div className={conntainer}>
                    {dataInfo.map((item) => {
                        return (
                            <InfoCard
                                title={item.title}
                                description={item.description}
                                src={item.src}
                            />
                        );
                    })}
                </div>
            </MainLayout>
        </div>
    );
}

export default Info;
