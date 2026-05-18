import axios from "axios";

const API = 'https://electrohome-847j.onrender.com';

/**
 * Instancia centralizada de Axios con timeout adaptado a Render Free Tier
 */
const apiInstance = axios.create({
    baseURL: API,
    timeout: 90000, 
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

/**
 * Interceptor de Seguridad: Inyecta Authorization en cada petición automáticamente
 */
apiInstance.interceptors.request.use((config) => {
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');

    if (email && password) {
        // Generamos el hash Base64 e inyectamos directamente en las cabeceras
        const authHeader = 'Basic ' + btoa(`${email.trim()}:${password.trim()}`);
        config.headers.Authorization = authHeader;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// --- MÉTODOS GET ---

export const getProduc = async () => {
    try {
        const response = await apiInstance.get(`/api/productos`);
        return response.data;
    } catch (err) {
        console.error('Error en getProduc:', err);
        throw err;
    }
};

// NUEVO: Método optimizado usando Axios con seguridad integrada para traer las categorías del Sidebar
export const getAllCategorias = async () => {
    try {
        const response = await apiInstance.get(`/api/categorias`);
        return response.data;
    } catch (error) {
        console.error('Error en getAllCategorias:', error);
        throw error;
    }
};

export const getCategorias = async (categoria: string) => {
    try {
        const response = await apiInstance.get(`/api/productos/categoria/${categoria}`);
        return response.data;
    } catch (error) {
        console.error('Error en getCategorias:', error);
        throw error;
    }
};

export const getById = async (id: number) => {
   try {
        const response = await apiInstance.get(`/api/productos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error en getById:', error);
        throw error;
    }
};

// --- MÉTODOS DE ESCRITURA ---

export const guardarProducto = async (productoData: any, fileImage: File) => {
    try {
        const formData = new FormData();
        formData.append('producto', JSON.stringify(productoData));

        if (fileImage) {
            formData.append('imagen', fileImage);
        }

        const response = await apiInstance.post(`/api/productos`, formData, {
            headers: { 
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error detallado en guardarProducto:', error);
        throw error;
    }
};

export const actualizarProductos = async (id: number, productoData: any, fileImagen?: File) => {
    try {
        const formData = new FormData();
        formData.append('producto', JSON.stringify(productoData));

        if (fileImagen) {
            formData.append('imagen', fileImagen);
        }

        const response = await apiInstance.put(`/api/productos/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error('Error en actualizarProductos:', error);
        throw error;
    }
};

export const deleteProducto = async (id: number) => {
    try {
        const response = await apiInstance.delete(`/api/productos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error en deleteProducto:', error);
        throw error;
    }
};