import axios from 'axios';

const instance = axios.create();

instance.setAuthToken = (token) => {
    instance.defaults.headers.common.Authorization = `Token ${token}`;
};

export default instance;
