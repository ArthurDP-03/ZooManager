import axios from 'axios';

// Cria a conexão com o Back-End
const api = axios.create({
    baseURL: 'http://localhost:5053/api'
});

// ⭐ INTERCEPTOR: Adiciona o Token em todas as requisições ⭐
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
});

export default api;