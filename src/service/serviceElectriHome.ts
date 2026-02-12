import axios from "axios";

const API = 'https://electrohome-847j.onrender.com'

/**
 * Creamos la instancia con un timeout largo.
 * Render Free Tier tarda en "despertar", si Axios no espera, da Network Error.
 */
const apiInstance = axios.create({
    baseURL: API,
    timeout: 30000, // 30 segundos de espera
    headers: {
        'Accept': 'application/json',
    }
});

/**
 * Interceptor de Seguridad mejorado.
 * Inyecta el header Authorization de forma explícita.
 */
apiInstance.interceptors.request.use((config) => {
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');

    if (email && password) {
        // Configuramos la autenticación básica
        config.auth = {
            username: email.trim(),
            password: password.trim()
        };
        // Forzamos que se envíen las credenciales en peticiones cross-origin
        config.withCredentials = true; 
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
        console.error('Error en getCategorias:', error);
        throw error;
    }
}

// --- MÉTODOS DE ESCRITURA (ARREGLADOS PARA MATCH CON JAVA STRING PARAM) ---

export const guardarProducto = async (productoData: any, fileImage: File) => {
    try {
        const formData = new FormData();
        
        // 1. Convertimos el objeto a un String de texto simple.
        // En Java lo recibes como @RequestParam("producto") String productoJson
        formData.append('producto', JSON.stringify(productoData));

        if (fileImage) {
            formData.append('imagen', fileImage);
        }

        const response = await apiInstance.post(`/api/productos`, formData, {
            headers: { 
                // Al enviar FormData, NO es obligatorio poner el Content-Type manualmente, 
                // Axios y el navegador lo calculan con el "boundary" necesario.
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error detallado en postProducto:', error);
        throw error;
    }
};

export const actualizarProductos = async (id: number, productoData: any, fileImagen?: File) => {
    try {
        const formData = new FormData();
        
        // Lo mismo aquí: enviamos el JSON como String para que el ObjectMapper de Java no explote
        formData.append('producto', JSON.stringify(productoData));

        if (fileImagen) {
            formData.append('imagen', fileImagen);
        }

        const response = await apiInstance.put(`/api/productos/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error('Error en putProducto:', error);
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