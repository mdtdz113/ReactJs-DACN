import InputCommon from '@components/InputCommon/InputCommon';
import styles from './styles.module.scss';
import MyButton from '@components/Button/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useContext, useEffect, useState } from 'react';
import { ToastContext } from '@/context/ToastProvider';
import { register, signIn, getInfo } from '@/apis/authSercice';
import Cookies from 'js-cookie';
import { SideBarContext } from '@/context/SideBarProvider';
import { StoreContext } from '@/context/storeProvider';

function Login() {
    const { container, title, boxRememberMe, lostPw } = styles;
    const [isRegister, setIsRegester] = useState(false);
    const { toast } = useContext(ToastContext);
    const [isLoading, setIsLoading] = useState(false);

    const { setIsOpen, hangleGetListProductCart } = useContext(SideBarContext);
    const { setUserId } = useContext(StoreContext);
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
            cfmpassword: Yup.string().oneOf(
                [Yup.ref('password'), null],
                'Passwords must match'
            )
        }),
        onSubmit: async (values) => {
            if (isLoading) return;
            const { email: username, password } = values;
            setIsLoading(true);
            if (isRegister) {
                await register({ username, password })
                    .then((res) => {
                        toast.success(res.data.message);
                        setIsLoading(false);
                    })
                    .catch((err) => {
                        toast.error(err.response.data.message);
                        setIsLoading(false);
                    });
            }
            if (!isRegister) {
                await signIn({ username, password })
                    .then((res) => {
                        setIsLoading(false);
                        console.log(res.data);
                        const { id, token, refreshToken } = res.data;
                        setUserId(id);
                        Cookies.set('userId', id);
                        Cookies.set('token', token);
                        Cookies.set('refreshToken', refreshToken);
                        setIsOpen(false);
                        hangleGetListProductCart(id, 'cart');
                        toast.success(res.data.message);
                    })
                    .catch((err) => {
                        setIsLoading(false);
                        toast.error(err.response.data.message);
                    });
            }
        }
    });
    const handleToggle = () => {
        setIsRegester(!isRegister);
        formik.resetForm();
    };

    return (
        <div className={container}>
            <div className={title}>{isRegister ? 'SIGN UP' : 'SIGN IN'}</div>
            <form onSubmit={formik.handleSubmit}>
                <InputCommon
                    id='email'
                    lable={'Email'}
                    type={'text'}
                    isRequied
                    formik={formik}
                />

                <InputCommon
                    id='password'
                    lable={'Password'}
                    type={'password'}
                    isRequied
                    formik={formik}
                />

                {isRegister && (
                    <InputCommon
                        id='cfmpassword'
                        lable={'Confirm Password'}
                        type={'password'}
                        isRequied
                        formik={formik}
                    />
                )}

                {!isRegister && (
                    <div className={boxRememberMe}>
                        <input type='checkbox' />
                        <span>Remember me</span>
                    </div>
                )}
                <MyButton
                    content={isRegister ? 'REGISTER' : 'LOGIN'}
                    type={'submit'}
                    // onClick={() => toast.success('Đăng nhập thành công')}
                />

                <MyButton
                    content={
                        isRegister
                            ? 'Already have a account?'
                            : "Dont't have a account?"
                    }
                    type='submit'
                    onClick={handleToggle}
                />
                {!isRegister && (
                    <div className={lostPw}>Lost your password</div>
                )}
            </form>
        </div>
    );
}

export default Login;
