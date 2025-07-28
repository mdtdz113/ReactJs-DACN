import styles from '../OurShop/styles.module.scss';

function SelectBox({ options, getValue, type, defaultValue }) {
    const { selextBox } = styles;
    return (
        <select
            className={selextBox}
            onChange={(e) => getValue(e.target.value, type)}
            value={defaultValue}
        >
            {options.map((option) => { 
                return (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                );
            })}
        </select>
    );
}

export default SelectBox;
