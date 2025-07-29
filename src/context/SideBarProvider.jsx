import { createContext, useEffect } from 'react';
import { useState } from 'react';
import { getCart } from '@/apis/cartService';
import Cookies from 'js-cookie';
export const SideBarContext = createContext();

export const SideBarProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState('');
    const userId = Cookies.get('userId');
    const [listProductCart, setListProductCart] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [detailsProduct, setDetailsProduct] = useState(null);
    const hangleGetListProductCart = (userId, type) => {
        if (userId && type === 'cart') {
            setIsLoading(true);
            getCart(userId)
                .then((res) => {
                    setListProductCart(res.data.data);
                    setIsLoading(false);
                })
                .catch((err) => {
                    setListProductCart([]);
                    setIsLoading(false);
                });
        }
    };
    const value = {
        isOpen,
        setIsOpen,
        type,
        setType,
        hangleGetListProductCart,
        listProductCart,
        isLoading,
        setIsLoading,
        userId,
        detailsProduct,
        setDetailsProduct
    };
    useEffect(() => {
        hangleGetListProductCart(userId, 'cart');
    }, []);
    return (
        <SideBarContext.Provider value={value}>
            {children}
        </SideBarContext.Provider>
    );
};
