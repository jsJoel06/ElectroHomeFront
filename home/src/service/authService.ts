import axios from "axios";

const API_URL = "https://electrohome-847j.onrender.com";

// 1. Creamos una instancia centralizada
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial para conectar con tu Java SecurityConfig
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Interceptor: Esto "inyecta" la seguridad automáticamente en CADA petición
api.interceptors.request.use((config) => {
  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");

  if (email && password) {
    // Como usas httpBasic en Spring, enviamos el hash Base64
    const authHeader = 'Basic ' + btoa(`${email}:${password}`);
    config.headers.Authorization = authHeader;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- SERVICIOS DE AUTENTICACIÓN ACTUALIZADOS ---

export const postLogin = async (email: string, password: string) => {
  try {
    // Usamos 'api' en lugar de 'axios' global
    const response = await api.post(`/api/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error en el servicio login:", error);
    throw error;
  }
};

export const PostRegister = async (email: string, password: string) => {
  try {
    const response = await api.post(`/api/auth/register`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error en el servicio register:", error);
    throw error;
  }
};

export const postLogout = async () => {
  try {
    const response = await api.post(`/api/auth/logout`);
    return response.data;
  } catch (error) {
    console.error("Error en el servicio logout:", error);
    throw error;
  } finally {
    // Limpiamos siempre al salir
    localStorage.removeItem("password");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("email");
    localStorage.removeItem("authority");
  }
};

// --- SERVICIOS DE PRODUCTOS (Asegúrate de usarlos así) ---

export const getProducts = async () => {
  try {
    // Gracias al interceptor, esta llamada ya lleva la seguridad incluida
    const response = await api.get("/api/productos");
    return response.data;
  } catch (error) {
    console.error("Error cargando productos:", error);
    throw error;
  }
};