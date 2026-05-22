import axios from "axios";

// La baseURL debe ser la raíz del recurso
const API_URL = 'https://electrohome-847j.onrender.com/api/categorias';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');

    if (email && password) {
        config.auth = {
            username: email.trim(),
            password: password.trim()
        };
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// --- FUNCIONES CRUD ACTUALIZADAS ---

export const getCategorias = async () => {
    try {
        // Al usar '/' se concatena con la baseURL
        const response = await api.get('');
        return response.data;
    }
    catch (error) {
        console.error('Error en getCategorias:', error);
        throw error;
    }
};

export const saveCategoria = async (categoria: { nombre: string }) => {
    try {
        // Solo enviamos el cuerpo, la ruta ya está en la baseURL
        const response = await api.post('/', categoria);
        return response.data;
    } catch (error) {
        console.error('Error en saveCategoria:', error);
        throw error;
    }
};

export const editCategoria = async (id: number, categoria: { nombre: string }) => {
    try {
        // IMPORTANTE: Ahora coincide con @PutMapping("/{id}") del backend
        const response = await api.put(`/${id}`, categoria);
        return response.data;
    } catch (error) {
        console.error('Error en editCategoria:', error);
        throw error;
    }
};

export const deleteCategoria = async (id: number) => {
    try {
        // IMPORTANTE: Ahora coincide con @DeleteMapping("/{id}") del backend
        const response = await api.delete(`/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error en deleteCategoria:', error);
        throw error;
    }
};