import { createContext, useEffect } from 'react';
import { useState } from 'react';
import { getProduct } from '@/apis/productServer';
import { limit } from 'normalize-range';

export const OurShopContext = createContext();

export const OurShopProvider = ({ children }) => {
    const sortOptions = [
        { label: 'Default sorting', value: '0' },
        { label: 'Sort by popularity', value: '1' },
        { label: 'Sort by averahe rating', value: '2' },
        { label: 'Sort by last test', value: '3' },
        { label: 'Sort by price: low to high', value: '4' },
        { label: 'Sort by price: high to low', value: '5' }
    ];
    const showOptions = [
        { label: '8', value: '8' },
        { label: '12', value: '12' },
        { label: 'ALL', value: 'all' }
    ];
    const [sortId, setSortId] = useState('0');
    const [showId, setShowId] = useState('8');
    const [isShowGrid, setIsShowGrid] = useState(true);

    const [products, setProducts] = useState([]);
    // const [isList, setIsList] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [isLoadMore, setIsLoadMore] = useState(false);
    const hangleLoadMore = () => {
        const query = {
            sortType: sortId,
            page: +page + 1,
            limit: showId
        };
        setIsLoadMore(true);
        getProduct(query)
            .then((res) => {
                setProducts((prew) => {
                    return [...prew, ...res.contents];
                });
                setPage(+res.page);
                setTotal(res.total);
                setIsLoading(false);
                setIsLoadMore(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    };
    const values = {
        sortOptions,
        showOptions,
        setSortId,
        setShowId,
        setIsShowGrid,
        products,
        isShowGrid,
        hangleLoadMore,
        total,
        isLoadMore
    };

    useEffect(() => {
        const query = {
            sortType: sortId,
            page: 1,
            limit: showId
        };
        setIsLoading(true);
        getProduct(query)
            .then((res) => {
                setProducts(res.contents);
                setTotal(res.total);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    }, [sortId, showId]);

    return (
        <OurShopContext.Provider value={values}>
            {children}
        </OurShopContext.Provider>
    );
};
