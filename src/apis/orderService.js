import axiosClient from './axiosClient';

// user
export const creactOrder = async (data) => {
    return await axiosClient.post(`/orders`, data);
};
export const getDetailOrder = async (id) => axiosClient.get(`/orders/${id}`);
export const getAllOrder = async (token) =>
    axiosClient.get('/orders', {
        headers: { Authorization: `Bearer ${token}` }
    });
export const getOrderById = async (token, id) =>
    axiosClient.get(`/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
export const deleteOrder = async (token, id) =>
    axiosClient.delete(`/order/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

// admin
export const getAllOrderAdmin = async (token, params = {}) =>
    axiosClient.get('/ordersAll', {
        headers: { Authorization: `Bearer ${token}` },
        params // <= hỗ trợ ?status=processing&from=...&to=...
    });

// Giữ theo cách component đang gọi: updateOrderStatus(orderId, nextStatus, token)
// Dùng POST để khớp backend router
export const updateOrderStatus = async (orderId, status, token) =>
    axiosClient.post(
        `/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
    );
