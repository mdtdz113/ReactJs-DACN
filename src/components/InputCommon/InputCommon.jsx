import { useState } from 'react';
import styles from './styles.module.scss';
import { IoIosEye } from 'react-icons/io';
import { IoIosEyeOff } from 'react-icons/io';

function InputCommon({ lable, type, isRequied = false, ...props }) {
    const { lableInput, boxInput, container, boxIcon, errMsg } = styles;
    const { formik, id } = props;

    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const isShowTextPassword =
        type === 'password' && showPassword ? 'text' : type;
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const isErr = formik.errors[id] && formik.touched[id];
    const messageFormik = formik.errors[id];


    return (
        <div className={container}>
            <div className={lableInput}>
                {lable} {isRequied && <span>*</span>}
            </div>
            <div className={boxInput}>
                <input
                    type={isShowTextPassword}
                    {...props}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values[id]}
                />
                {isPassword && (
                    <div className={boxIcon} onClick={handleShowPassword}>
                        {showPassword ? <IoIosEyeOff /> : <IoIosEye />}
                    </div>
                )}
                {isErr && <div className={errMsg}>{messageFormik}</div>}
            </div>
        </div>
    );
}

export default InputCommon;
