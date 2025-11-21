import api from './api';

export const getAnimais = () => api.get('/Animal');
export const getAnimalById = (id) => api.get(`/Animal/${id}`);
export const createAnimal = (data) => api.post('/Animal', data);
export const updateAnimal = (id, data) => api.put(`/Animal/${id}`, data);
export const deleteAnimal = (id) => api.delete(`/Animal/${id}`);

// Cuidados dos Animais
export const getCuidados = () => api.get('/Cuidado'); 
export const createCuidado = (data) => api.post('/Cuidado', data);
export const updateCuidado = (id, data) => api.put(`/Cuidado/${id}`, data);
export const deleteCuidado = (id) => api.delete(`/Cuidado/${id}`);

// Catálogos
export const getEspecies = () => api.get('/Catalogos/especies');
export const getHabitats = () => api.get('/Catalogos/habitats');