import axios from 'axios';

// 1. La URL base de tu API de Spring Boot
const API_URL = 'http://localhost:8080/api';

/**
 * Función para obtener TODOS los productos.
 * (La usaremos en Home.jsx y Productos.jsx)
 */
export const getProductos = async () => {
  try {
    // Hacemos un GET a http://localhost:8080/api/productos
    const response = await axios.get(`${API_URL}/productos`);
    return response.data; // Devolvemos el array de productos
  } catch (error) {
    console.error("Error al obtener productos:", error);
    // Si el backend está apagado o falla, devolvemos un array vacío
    // para que el frontend no se rompa.
    return []; 
  }
};

/**
 * Función para obtener UN producto por su ID.
 * (La usaremos en Detalle.jsx)
 */
export const getProductoById = async (id) => {
  try {
    // Hacemos un GET a http://localhost:8080/api/productos/1 (o el id que sea)
    const response = await axios.get(`${API_URL}/productos/${id}`);
    return response.data; // Devolvemos el objeto del producto
  } catch (error) {
    console.error(`Error al obtener el producto ${id}:`, error);
    return null; // Devolvemos null si no lo encuentra
  }
};

/**
 * Función para obtener productos por categoría.
 * (La usaremos si creamos una vista de categorías)
 */
export const getProductosPorCategoria = async (categoria) => {
    try {
        // Hacemos un GET a http://localhost:8080/api/productos/buscar?categoria=BMX
        const response = await axios.get(`${API_URL}/productos/buscar`, {
            params: { 
              categoria: categoria // Axios lo formatea como ?categoria=BMX
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al buscar categoría ${categoria}:`, error);
        return [];
    }
};

/*
// Aquí podemos dejar listos los otros métodos del CRUD para el futuro
// (para un panel de administrador, por ejemplo)

export const updateProducto = async (id, productoData) => {
  return await axios.put(`${API_URL}/productos/${id}`, productoData);
};

export const deleteProducto = async (id) => {
  return await axios.delete(`${API_URL}/productos/${id}`);
};

export const createProducto = async (productoData) => {
  return await axios.post(`${API_URL}/productos`, productoData);
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