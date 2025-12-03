import axios from 'axios';

// --- CONFIGURACIÓN DE PUERTOS ---
const API_PRODUCTOS_URL = 'http://localhost:8080/api'; 
const API_USUARIOS_URL = 'http://localhost:8081/api/usuarios';
const API_AUTH_URL = 'http://localhost:3000/api/auth';
const API_CART_URL     = 'http://localhost:8082/api/cart';
// ================================
//   HELPERS GENERALES
// ================================

/**
 * Devuelve el session_user desde localStorage o null.
 * Estructura guardada en InicioSesion:
 * { id, email, nombre, token }
 */
function getSessionUser() {
  try {
    const raw = localStorage.getItem('session_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Cabeceras para el microservicio Carrito.
 * Usa X-User-Id con el id del usuario logueado.
 */
function getCartHeaders() {
  const session = getSessionUser();
  if (!session?.id) return {};
  return {
    'X-User-Id': session.id,
  };
}
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
    // 1) Registrar en Node (auth)
    const authResponse = await axios.post(`${API_AUTH_URL}/register`, {
      email: userData.correo,
      password: userData.pass, // la misma pass que pusiste en el formulario
    });

    // 2) Registrar en Java (perfil de usuario)
    try {
      await axios.post(API_USUARIOS_URL, {
        nombre: userData.nombre,
        correo: userData.correo,
        pass: userData.pass,              // 🔴 AQUÍ ESTABA EL PROBLEMA
        telefono: userData.telefono || '',
        region: userData.region || '',
        comuna: userData.comuna || '',
      });
    } catch (javaError) {
      // Java puede devolver 409 con { error: "El correo ya está registrado..." }
      const msg =
        javaError.response?.data?.error ||
        'Error creando el perfil en el servicio de usuarios.';
      throw new Error(msg);
    }

    // Si las dos cosas salieron bien, devolvemos lo de Node
    return authResponse.data;
  } catch (error) {
    const msg =
      error.response?.data?.error ||
      error.message ||
      'Error en el registro.';
    // lanzo con message para que el componente lo pueda mostrar
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

// ==========================================
//   SECCIÓN 3: CARRITO (MICROSERVICIO 8082)
// ==========================================

/**
 * Obtiene el carrito remoto del usuario logueado.
 * Si no hay usuario logueado, lanza error.
 */
export const fetchRemoteCart = async () => {
  const headers = getCartHeaders();
  if (!headers['X-User-Id']) {
    throw new Error('No hay usuario logueado para obtener carrito remoto');
  }

  const response = await axios.get(API_CART_URL, { headers });
  return response.data; // CarritoDTO
};

/**
 * Hace merge de la lista local con el carrito remoto.
 * items = [{ productId, quantity }]
 */
export const mergeRemoteCart = async (items) => {
  const headers = getCartHeaders();
  if (!headers['X-User-Id']) {
    throw new Error('No hay usuario logueado para merge de carrito');
  }

  const payload = (items || [])
    .filter((it) => it && it.productId && it.quantity > 0)
    .map((it) => ({
      productId: Number(it.productId),
      quantity: Number(it.quantity),
    }));

  const response = await axios.post(`${API_CART_URL}/merge`, payload, { headers });
  return response.data; // CarritoDTO
};

/**
 * Agrega cantidad a un ítem remoto (POST /items).
 * Si el producto ya existe, el backend suma quantity.
 */
export const addRemoteCartItem = async (productId, quantity = 1) => {
  const headers = getCartHeaders();
  if (!headers['X-User-Id']) return; // usuario invitado -> no hace nada remoto

  const body = {
    productId: Number(productId),
    quantity: Number(quantity),
  };

  const response = await axios.post(`${API_CART_URL}/items`, body, { headers });
  return response.data; // CarritoDTO
};

/**
 * Actualiza la cantidad de un ítem remoto (PUT /items).
 * Se envía la cantidad FINAL (no el delta).
 */
export const updateRemoteCartItem = async (productId, quantity) => {
  const headers = getCartHeaders();
  if (!headers['X-User-Id']) return;

  const body = {
    productId: Number(productId),
    quantity: Number(quantity),
  };

  const response = await axios.put(`${API_CART_URL}/items`, body, { headers });
  return response.data; // CarritoDTO
};

/**
 * Elimina un ítem remoto (DELETE /items/{productId}).
 */
export const removeRemoteCartItem = async (productId) => {
  const headers = getCartHeaders();
  if (!headers['X-User-Id']) return;

  const url = `${API_CART_URL}/items/${Number(productId)}`;
  const response = await axios.delete(url, { headers });
  return response.data; // CarritoDTO
};

/**
 * Limpia el carrito remoto del usuario (DELETE /api/cart).
 */
export const clearRemoteCart = async () => {
  const headers = getCartHeaders();
  if (!headers['X-User-Id']) return;

  const response = await axios.delete(API_CART_URL, { headers });
  return response.data; // CarritoDTO
};