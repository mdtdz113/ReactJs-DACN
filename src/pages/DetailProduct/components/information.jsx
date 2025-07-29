import styles from '../styles.module.scss';

function Imformation() {
    const dataInfo = [
        { id: 1, title: 'Size', content: 'S, M, L' },
        { id: 1, title: 'Msaterial', content: 'Fleece' },
        { id: 1, title: 'Color', content: 'Black, Blue' }
    ];

    const { itemInfo, containerInfo } = styles;
    return (
        <div className={containerInfo}>
            {dataInfo.map((item, index) => {
                return (
                    <div key={index} className={itemInfo}>
                        <div>{item.title}</div>
                        <div>{item.content}</div>
                    </div>
                );
            })}
        </div>
    );
}

export default Imformation;
