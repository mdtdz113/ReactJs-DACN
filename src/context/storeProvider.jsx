import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { createContext } from 'react';
import { getInfo } from '@/apis/authSercice';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);

    const [userId, setUserId] = useState(Cookies.get('userId'));

    const handlelogOut = () => {
        Cookies.remove('userId');
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        setUserInfo(null);
        // window.location.reload();
    };

    useEffect(() => {
        if (userId) {
            getInfo(userId)
                .then((res) => {
                    setUserInfo(res.data.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [userId]);

    return (
        <StoreContext.Provider value={{ userInfo, handlelogOut, setUserId }}>
            {children}
        </StoreContext.Provider>
    );
};
