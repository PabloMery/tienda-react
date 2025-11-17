import axios from 'axios';

// La URL base de tu backend Spring Boot
const API_URL = 'http://localhost:8080/api';

/**
 * Obtiene la lista completa de productos desde el backend.
 * (Usado en Home.jsx, Productos.jsx y CartContext.jsx)
 */
export const getProductos = async () => {
  try {
    const response = await axios.get(`${API_URL}/productos`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    // Si falla (ej: backend apagado), devuelve un array vacío
    // para que la tienda no se rompa.
    return []; 
  }
};

/**
 * Obtiene un solo producto por su ID.
 * (Usado en Detalle.jsx)
 */
export const getProductoById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/productos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener producto ${id}:`, error);
    return null; // Devuelve null si no lo encuentra o hay error
  }
};

/**
 * Obtiene productos filtrados por categoría.
 * (No lo hemos implementado aún en el frontend, pero lo dejamos listo)
 */
export const getProductosPorCategoria = async (categoria) => {
    try {
        // Apunta a tu endpoint: /api/productos/buscar?categoria=BMX
        const response = await axios.get(`${API_URL}/productos/buscar`, {
            params: { categoria: categoria }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al buscar categoría ${categoria}:`, error);
        return [];
    }
};

// --- Métodos del CRUD que usaremos en el futuro (ej: admin) ---

/*
export const updateProducto = async (id, productoData) => {
  return await axios.put(`${API_URL}/productos/${id}`, productoData);
};

export const deleteProducto = async (id) => {
  return await axios.delete(`${API_URL}/productos/${id}`);
};
*/









// src/services/api.js

// ... (aquí arriba están las funciones existentes como getProductos) ...

// --- NUEVOS SERVICIOS DE USUARIOS ---

/**
 * Registra un nuevo usuario enviando los datos al backend.
 */
export const registrarUsuario = async (datosUsuario) => {
  try {
    const response = await axios.post(`${API_URL}/usuarios`, datosUsuario);
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
    const response = await axios.post(`${API_URL}/usuarios/login`, credenciales);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Correo o contraseña incorrectos.");
    }
    console.error("Error al iniciar sesión:", error);
    throw new Error("Error en el servidor al intentar iniciar sesión.");
  }
};