import axios from 'axios';

// 1. La URL base de tu API de Spring Boot
const API_URL = 'http://localhost:8080/api';
const API_URL2 = 'http://localhost:8081/api';


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