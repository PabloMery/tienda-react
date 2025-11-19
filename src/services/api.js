import axios from 'axios';

// 1. La URL base de tu API de Spring Boot
const API_URL = 'http://localhost:8080/api';
const API_URL2 = 'http://localhost:8081/api';
const API_AUTH_URL = 'http://localhost:3000/api/auth'; 


export const getProductos = async () => {
  try {

    const response = await axios.get(`${API_URL}/productos`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener productos:", error);

    return []; 
  }
};


export const getProductoById = async (id) => {
  try {

    const response = await axios.get(`${API_URL}/productos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el producto ${id}:`, error);
    return null; 
  }
};


export const getProductosPorCategoria = async (categoria) => {
    try {
       
        const response = await axios.get(`${API_URL}/productos/buscar`, {
            params: { 
              categoria: categoria
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al buscar categoría ${categoria}:`, error);
        return [];
    }
};

/**
 * ¡FUNCIÓN NUEVA!
 * Envía un nuevo producto al backend.
  @param {object} productoData - Los datos del producto desde el formulario.
 */
export const createProducto = async (productoData) => {
  try {
    // Usamos POST a /api/productos, como probamos en Postman
    const response = await axios.post(`${API_URL}/productos`, productoData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error al crear el producto:", error.response);
    
    // Aquí devolvemos el mensaje de error de validación del backend
    // (Ej: "El nombre no puede estar vacío")
    const errorMessage = error.response?.data || "Error desconocido al crear el producto.";
    return { success: false, error: errorMessage };
  }
};
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    // Enviamos al puerto 8080 (Productos/Archivos)
    const response = await axios.post(`${API_URL}/files/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    // Devuelve algo como: "/api/files/12345_mifoto.jpg"
    return response.data; 
  } catch (error) {
    console.error("Error subiendo imagen:", error);
    return null;
  }
};

// Crear múltiples productos a la vez (para el nuevo formulario)
export const createProductosBatch = async (productos) => {
  try {
    const response = await axios.post(`${API_URL}/productos/batch`, productos);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error batch:", error);
    return { success: false, error: "Error al crear productos" };
  }
};

/**
 * Elimina un producto por su ID.
 */
export const deleteProducto = async (id) => {
  try {
    // DELETE http://localhost:8080/api/productos/123
    await axios.delete(`${API_URL}/productos/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return { success: false, error: error.response?.data || error.message };
  }
};

/**
 * Actualiza un producto existente.
 * (Lo usaremos cuando crees la página de Edición)
 */
export const updateProducto = async (id, productoData) => {
  try {
    const response = await axios.put(`${API_URL}/productos/${id}`, productoData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return { success: false, error: error.response?.data || error.message };
  }
};



// src/services/api.js

// ... (aquí arriba están las funciones existentes como getProductos) ...

// --- NUEVOS SERVICIOS DE USUARIOS ---

/**
 * Registra un nuevo usuario enviando los datos al backend.
 */
export const registrarUsuario = async (datosUsuario) => {
  try {
    const response = await axios.post(`${API_URL2}/usuarios`, datosUsuario);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      throw new Error("El correo electrónico ya está registrado.");
    }
    console.error("Error al registrar usuario:", error);
    throw new Error("No se pudo completar el registro. Inténtalo más tarde.");
  }
};

/**
 * Valida las credenciales de un usuario contra el backend.
 */
export const iniciarSesion = async (credenciales) => {
  try {
    const response = await axios.post(`${API_URL2}/usuarios/login`, credenciales);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Correo o contraseña incorrectos.");
    }
    console.error("Error al iniciar sesión:", error);
    throw new Error("Error en el servidor al intentar iniciar sesión.");
  }
};





// --- Autenticación (Node) ---
export const loginUser = async (credentials) => {
    try {
        // credentials: { username: 'email@ejemplo.com', password: '...' }
        const response = await axios.post(`${API_AUTH_URL}/login`, credentials);
        
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: "Error de conexión (Node)" };
    }
};

export const registerUser = async (userData) => {
    try {
        // 1. Registrar en Node (Auth - Seguridad)
        const authPayload = {
            username: userData.email, // Node espera 'username'
            password: userData.password
        };
        const authResponse = await axios.post(`${API_AUTH_URL}/register`, authPayload);

        // 2. Registrar en Java (Perfil - Datos personales) puerto 8081
        if (authResponse.status === 200 || authResponse.status === 201) {
            const userPayload = {
                nombre: userData.nombre,
                correo: userData.email, // Java espera 'correo'
                pass: "encriptada_en_node", // Mandamos un placeholder a Java ya que Node tiene la real
                telefono: userData.telefono || "",
                region: "",
                comuna: ""
            };
            await axios.post(API_URL2, userPayload);
        }

        return authResponse.data;
    } catch (error) {
        console.error("Error en registro:", error);
        throw error.response ? error.response.data : { message: "Error al registrar" };
    }
};