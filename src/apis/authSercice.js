import axiosClient from './axiosClient';

const register = async (body) => {
    return await axiosClient.post('/register', body);
};
const signIn = async (body) => {
    return await axiosClient.post('/login', body);
};

const getInfo = async (userId) => {
    return await axiosClient.get(
        `/user/info/18e375fc-fb70-4902-b48a-5779bd96ce78`
    );
};
export { register, signIn, getInfo };
