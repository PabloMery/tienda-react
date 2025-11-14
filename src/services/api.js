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