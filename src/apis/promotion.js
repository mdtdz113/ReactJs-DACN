import axiosClient from './axiosClient';

const getAllKM = async (token) =>
    axiosClient.get(`/promotions/campaigns`, {
        headers: { Authorization: `Bearer ${token}` }
    });
const createKM = (token, data) => {
    return axios.post('/promotion', data, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
export { getAllKM, createKM };
