import styles from './styles.module.scss';

function InputCustom({
    lable,
    type,
    dataOption,
    isRequired = false,
    register,
    isShowLabel = true,
    isError = false
}) {
    const { container, lableClass } = styles;

    const renderInput = () => {
        if (type === 'text' || type === 'email' || type === 'tel') {
            return <input type={type} placeholder={lable} {...register} />;
        } else {
            // For select dropdowns
            return (
                <select {...register} defaultValue=''>
                    <option value='' disabled>
                        {lable}
                    </option>
                    {dataOption?.map((item, index) => (
                        <option value={item.value} key={index}>
                            {item.label}
                        </option>
                    ))}
                </select>
            );
        }
    };

    return (
        <div className={container}>
            {isShowLabel && (
                <label className={lableClass}>
                    {lable} {isRequired && <span>*</span>}
                </label>
            )}
            {renderInput()}
            {isError && <span className='error'>{isError.message}</span>}
        </div>
    );
}

export default InputCustom;
