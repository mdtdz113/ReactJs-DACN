import axiosClient from './axiosClient';

const register = async (body) => {
    return await axiosClient.post('/register', body);
};
const signIn = async (body) => {
    return await axiosClient.post('/login', body);
};

const getInfo = async (userId) => {
    return await axiosClient.get(`/user/info/${userId}`);
};

const getAllUser = async (token) => {
    return await axiosClient.get('/user/All', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const deleteUser = async (id) => {
    return await axiosClient.delete(`/user/${id}`);
};

const updateUser = (userId, payload) =>
    axiosClient.put(`/user/${userId}`, payload);
const lockUser = (userId, isLocked) =>
    axiosClient.put(`/user/${userId}/lock`, { isLocked });
const createUser = (payload) => axiosClient.post(`/user/admin`, payload);
export {
    register,
    signIn,
    getInfo,
    getAllUser,
    deleteUser,
    updateUser,
    lockUser,
    createUser
};
