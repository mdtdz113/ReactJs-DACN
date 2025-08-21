import axiosClient from './axiosClient';

const getProduct = async (query) => {
    const { sortType, page, limit } = query;
    const queryLimit = limit === 'all' ? '' : `limit=${limit}`;

    const res = await axiosClient.get(
        `/product?sortType=${sortType}&page=${page}&${queryLimit}`
    );
    return res.data;
};

const getDetailProduct = async (id) => {
    const res = await axiosClient.get(`/product/${id}`);
    return res.data;
};

const getRelatedProduct = async (id) => {
    const res = await axiosClient.get(`/related-products/${id}`);
    return res.data.relatedProducts;
};

const AddProduct = async (data) => {
    return await axiosClient.post('/product', data);
};

const deleteProduct = async (id) => {
    return await axiosClient.delete(`/product/${id}`);
};

const updateProduct = async (id, data) => {
    return await axiosClient.put(`/product/${id}`, data);
};

export {
    getProduct,
    getDetailProduct,
    getRelatedProduct,
    AddProduct,
    deleteProduct,
    updateProduct
};
