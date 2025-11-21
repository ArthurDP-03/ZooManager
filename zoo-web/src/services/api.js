import axios from 'axios';

// Lê a variável de ambiente ou usa localhost
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5053/api';

const api = axios.create({
    baseURL: apiUrl
});

// Interceptor de Requisição (Anexa o Token)
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Se a API retornar 401 (Não autorizado), significa que o token morreu ou é falso
        if (error.response && error.response.status === 401) {
            console.warn("Sessão expirada ou token inválido. Realizando logout...");
            localStorage.clear(); // Limpa tudo
            window.location.href = '/'; // Força o redirecionamento para o Login
        }
        return Promise.reject(error);
    }
);

export default api;