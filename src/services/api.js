import axios from 'axios';

// --- CONFIGURACIÓN DE PUERTOS ---
// 1. Microservicio de Productos/Proyectos (Java Spring Boot)
const API_PRODUCTOS_URL = 'http://localhost:8080/api'; 

// 2. Microservicio de Usuarios (Java Spring Boot)
const API_USUARIOS_URL = 'http://localhost:8081/api/usuarios';

// 3. Microservicio de Autenticación (Node.js)
const API_AUTH_URL = 'http://localhost:3000/api/auth';


// ==========================================
//   SECCIÓN 1: GESTIÓN DE PRODUCTOS (Puerto 8080)
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
    console.error(`Error al obtener el producto ${id}:`, error);
    return null; 
  }
};

export const getProductosPorCategoria = async (categoria) => {
    try {
        const response = await axios.get(`${API_PRODUCTOS_URL}/productos/buscar`, {
            params: { categoria: categoria }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al buscar categoría ${categoria}:`, error);
        return [];
    }
};

export const createProducto = async (productoData) => {
  try {
    const response = await axios.post(`${API_PRODUCTOS_URL}/productos`, productoData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error al crear el producto:", error.response);
    const errorMessage = error.response?.data || "Error desconocido al crear el producto.";
    return { success: false, error: errorMessage };
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
    console.error("Error batch:", error);
    return { success: false, error: "Error al crear productos" };
  }
};

export const deleteProducto = async (id) => {
  try {
    await axios.delete(`${API_PRODUCTOS_URL}/productos/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return { success: false, error: error.response?.data || error.message };
  }
};

export const updateProducto = async (id, productoData) => {
  try {
    const response = await axios.put(`${API_PRODUCTOS_URL}/productos/${id}`, productoData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return { success: false, error: error.response?.data || error.message };
  }
};


// ==========================================
//   SECCIÓN 2: AUTENTICACIÓN Y USUARIOS (Integrado)
// ==========================================

/**
 * LOGIN INTEGRADO:
 * Valida las credenciales contra el microservicio de Node.js (Puerto 3000)
 * que maneja la encriptación segura.
 */
export const loginUser = async (credentials) => {
    try {
        // Node espera { email, password }
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
        console.error("Error en login:", error);
        throw error.response ? error.response.data : { error: "Error de conexión con el servidor de autenticación" };
    }
};

/**
 * REGISTRO INTEGRADO (Doble paso):
 * 1. Crea la cuenta segura en Node.js (Puerto 3000 - auth_db)
 * 2. Guarda el perfil en Java (Puerto 8081 - usuarios_tangana)
 */
export const registerUser = async (userData) => {
    try {
        // PASO 1: Registrar en Node (Auth - Seguridad)
        const authPayload = {
            email: userData.correo, 
            password: userData.pass
        };
        
        const authResponse = await axios.post(`${API_AUTH_URL}/register`, authPayload);

        // PASO 2: Registrar en Java (Perfil - Datos personales)
        // Solo si el paso 1 fue exitoso
        if (authResponse.status === 200 || authResponse.status === 201) {
            const userPayload = {
                nombre: userData.nombre,
                correo: userData.correo,
                // Enviamos un string dummy a Java porque la contraseña real está en Node
                pass: "ENCRIPTADA_EN_MICROSERVICIO_AUTH", 
                telefono: userData.telefono || "",
                region: userData.region || "",
                comuna: userData.comuna || ""
            };
            
            // Llamada directa al endpoint del controlador Java
            await axios.post(API_USUARIOS_URL, userPayload);
        }

        return authResponse.data;
    } catch (error) {
        console.error("Error en registro integrado:", error);
        const msg = error.response?.data?.error || "Error al intentar registrar el usuario.";
        throw { message: msg };
    }
};

/**
 * OBTENER PERFIL (OPTIMIZADO):
 * Busca un usuario específico por correo en el backend de Java.
 */
export const getUserProfile = async (email) => {
    if (!email) return null;

    try {
        console.log("📡 Consultando API Java para:", email);
        
        // Usamos el endpoint específico de búsqueda
        const response = await axios.get(`${API_USUARIOS_URL}/buscar`, {
            params: { correo: email.trim() } // Importante: trim() para evitar errores por espacios
        });
        
        console.log("✅ Usuario encontrado:", response.data);
        return response.data;

    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.warn("⚠️ El usuario no existe en la BD Java (404 Not Found).");
        } else {
            console.error("❌ Error de conexión con Java:", error);
        }
        return null;
    }
};


// Función auxiliar para cerrar sesión
export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/inicio-sesion';
};