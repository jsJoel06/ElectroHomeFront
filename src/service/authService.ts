import axios from "axios";

const API = 'https://electrohome-847j.onrender.com';

// --- SERVICIOS DE AUTENTICACIÓN ---

export const postLogin = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API}/api/auth/login`, {
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Error en el servicio login:', error);
        throw error;
    }
};

export const PostRegister = async (email: string, password: string) => {
   try {
        const response = await axios.post(`${API}/api/auth/register`, {
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Error en el servicio register:', error);
        throw error;
    }
}

export const postLogout = async () => {
    try {
        // 1. Avisamos al servidor para que invalide la sesión
        const response = await axios.post(`${API}/api/auth/logout`);
        
        // 2. LIMPIEZA LOCAL (Obligatoria para que el frontend reaccione)
        localStorage.removeItem('token'); 
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('email');
        
        return response.data;
    } catch (error) {
        // 3. Corregimos el nombre del error para debugging
        console.error('Error en el servicio logout:', error);
        
        // TIP: Si el servidor falla (ej. 500), igual deberías borrar el localstorage
        // para que el usuario no se quede "atrapado" en una sesión fantasma.
        localStorage.clear(); 
        throw error;
    }
};
