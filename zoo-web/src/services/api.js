import axios from 'axios';

// Cria a conexão com o Back-End
const api = axios.create({
    // Porta: 5053 que está rodando minha api
    baseURL: 'http://localhost:5053/api'
});

export default api;