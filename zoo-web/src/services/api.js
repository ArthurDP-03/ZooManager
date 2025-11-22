import axios from 'axios';

const api = axios.create({
    baseURL: '/api' 
});

// Mantemos apenas o tratamento de erro 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            sessionStorage.clear();
            localStorage.clear();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;