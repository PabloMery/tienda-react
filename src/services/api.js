import axios from 'axios';

// --- CONFIGURACIÓN DE PUERTOS ---
const API_PRODUCTOS_URL = 'http://localhost:8080/api'; 
const API_USUARIOS_URL = 'http://localhost:8081/api/usuarios';
const API_AUTH_URL = 'http://localhost:3000/api/auth';

// ==========================================
//   SECCIÓN 1: PRODUCTOS
// ==========================================
export const getProductos = async () => {
  try {
    const response = await axios.get(`${API_PRODUCTOS_URL}/productos`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return []; 
  }
};

export const getProductoById = async (id) => {
  try {
    const response = await axios.get(`${API_PRODUCTOS_URL}/productos/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo producto:", error); // Uso 'error' para evitar linter warning
    return null; 
  }
};

export const getProductosPorCategoria = async (categoria) => {
    try {
        const response = await axios.get(`${API_PRODUCTOS_URL}/productos/buscar`, {
            params: { categoria }
        });
        return response.data;
    } catch (error) {
        console.error("Error filtrando productos:", error);
        return [];
    }
};

export const createProducto = async (productoData) => {
  try {
    const response = await axios.post(`${API_PRODUCTOS_URL}/productos`, productoData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await axios.post(`${API_PRODUCTOS_URL}/files/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data; 
  } catch (error) {
    console.error("Error subiendo imagen:", error);
    return null;
  }
};

export const createProductosBatch = async (productos) => {
  try {
    const response = await axios.post(`${API_PRODUCTOS_URL}/productos/batch`, productos);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error en batch:", error);
    return { success: false, error: "Error en carga masiva" };
  }
};

export const deleteProducto = async (id) => {
  try {
    await axios.delete(`${API_PRODUCTOS_URL}/productos/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateProducto = async (id, productoData) => {
  try {
    const response = await axios.put(`${API_PRODUCTOS_URL}/productos/${id}`, productoData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==========================================
//   SECCIÓN 2: USUARIOS Y AUTH (INTEGRADO)
// ==========================================

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_AUTH_URL}/login`, {
            email: credentials.correo || credentials.email,
            password: credentials.pass || credentials.password
        });
        
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        const errorData = error.response?.data;
        const msg = errorData?.error || "Error de conexión";
        // Lanzamos el objeto con la propiedad 'error' para que el componente lo lea
        throw { error: msg }; 
    }
};

export const registerUser = async (userData) => {
    try {
        // 1. Registrar en Node (Auth)
        const authResponse = await axios.post(`${API_AUTH_URL}/register`, {
            email: userData.correo, 
            password: userData.pass
        });

        // 2. Registrar en Java (Perfil) si Node fue exitoso
        if (authResponse.status === 200 || authResponse.status === 201) {
            try {
                await axios.post(API_USUARIOS_URL, {
                    nombre: userData.nombre,
                    correo: userData.correo,
                    pass: "ENCRIPTADA_NODE", // Dummy pass para Java
                    telefono: userData.telefono || "",
                    region: userData.region || "",
                    comuna: userData.comuna || ""
                });
            } catch (javaError) {
                console.error("Error al sincronizar con Java:", javaError);
            }
        }
        return authResponse.data;
    } catch (error) {
        const msg = error.response?.data?.error || "Error en el registro.";
        throw { message: msg };
    }
};

export const getUserProfile = async (email) => {
    if (!email) return null;
    try {
        console.log("📡 Buscando perfil para:", email);
        
        // Endpoint específico /buscar para evitar traer toda la lista
        const response = await axios.get(`${API_USUARIOS_URL}/buscar`, {
            params: { correo: email.trim() }
        });
        
        console.log("✅ Perfil encontrado:", response.data);
        return response.data;

    } catch (error) {
        console.warn("⚠️ Perfil no encontrado en Java (404) o error de conexión:", error.message);
        return null;
    }
};

export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; // O '/inicio-sesion' según tu ruta
};