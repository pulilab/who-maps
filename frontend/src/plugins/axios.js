import axios from 'axios';

const instance = axios.create();

instance.setAuthToken = (token) => {
    instance.defaults.headers.common.Authorization = `Token ${token}`;
};

instance.setShowPopUp = handler => {
    instance.popUpFunction = handler;
};

instance.setHandleAuthProblem = handler => {
    instance.authProblemFunction = handler;
};

instance.interceptors.request.use(config => {
    return config;
}, error => {
    console.error(error);
    instance.popUpFunction();
    return Promise.reject(error);
});

instance.interceptors.response.use(response => {
    return response;
}, error => {
    if (error && error.response) {
        error.response.status === 401 ? instance.authProblemFunction() : instance.popUpFunction();
    }
    return Promise.reject(error);
});

export default instance;
