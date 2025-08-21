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
import { useNavigate } from 'react-router-dom';

function Login() {
    const { container, title, boxRememberMe, lostPw } = styles;
    const [isRegister, setIsRegester] = useState(false);
    const { toast } = useContext(ToastContext);
    const [isLoading, setIsLoading] = useState(false);

    const { setIsOpen, hangleGetListProductCart } = useContext(SideBarContext);
    const { setUserId } = useContext(StoreContext);
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Email không hợp lệ')
                .required('Vui lòng nhập email'),
            password: Yup.string()
                .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
                .required('Vui lòng nhập mật khẩu'),
            cfmpassword: Yup.string().oneOf(
                [Yup.ref('password'), null],
                'Mật khẩu xác nhận không khớp'
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
                        console.log(res.data.role);
                        if (res.data.role === 'admin') {
                            navigate('/admin');
                            const { id, token, refreshToken } = res.data;
                            Cookies.set('userId', id);
                            Cookies.set('token', token);
                            Cookies.set('refreshToken', refreshToken);
                            setIsOpen(false);
                        } else {
                            const { id, token, refreshToken } = res.data;
                            setUserId(id);
                            Cookies.set('userId', id);
                            Cookies.set('token', token);
                            Cookies.set('refreshToken', refreshToken);
                            setIsOpen(false);
                            hangleGetListProductCart(id, 'cart');
                            toast.success(res.data.message);
                            window.location.reload();
                        }
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
            <div className={title}>{isRegister ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP'}</div>
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
                    lable={'Mật khẩu'}
                    type={'password'}
                    isRequied
                    formik={formik}
                />

                {isRegister && (
                    <InputCommon
                        id='cfmpassword'
                        lable={'Xác nhận mật khẩu'}
                        type={'password'}
                        isRequied
                        formik={formik}
                    />
                )}

                {!isRegister && (
                    <div className={boxRememberMe}>
                        <input type='checkbox' />
                        <span>Ghi nhớ đăng nhập</span>
                    </div>
                )}
                <MyButton
                    content={isRegister ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP'}
                    type={'submit'}
                    // onClick={() => toast.success('Đăng nhập thành công')}
                />

                <MyButton
                    content={
                        isRegister
                            ? 'Bạn đã có tài khoản?'
                            : 'Bạn chưa có tài khoản?'
                    }
                    type='submit'
                    onClick={handleToggle}
                />
                {!isRegister && <div className={lostPw}>Quên mật khẩu?</div>}
            </form>
        </div>
    );
}

export default Login;
