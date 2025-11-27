// src/services/cartApi.js
import axios from "axios";

const API_CART_URL = "http://localhost:8082/api/cart";

// Obtiene el userId desde el usuario logueado
function getUserIdFromSession() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const user = JSON.parse(raw);
    // adapta esto al campo real, puede ser user.id, user.userId, etc.
    return user.id || user.userId || user._id || null;
  } catch {
    return null;
  }
}

function authHeaders() {
  const userId = getUserIdFromSession();
  if (!userId) return {};
  return { "X-User-Id": userId };
}

// ---- Llamadas al microservicio ----

export async function fetchCartFromServer() {
  const headers = authHeaders();
  if (!headers["X-User-Id"]) {
    // Invitado => sin carrito en servidor
    return null;
  }
  try {
    const resp = await axios.get(API_CART_URL, { headers });
    return resp.data; // CarritoDTO
  } catch (err) {
    console.warn("⚠️ No se pudo obtener carrito del servidor:", err.message);
    return null;
  }
}

export async function addItemServer(productId, quantity = 1) {
  const headers = authHeaders();
  if (!headers["X-User-Id"]) return null;

  try {
    const resp = await axios.post(
      `${API_CART_URL}/items`,
      { productId, quantity },
      { headers }
    );
    return resp.data; // CarritoDTO
  } catch (err) {
    console.warn("⚠️ Error agregando item en servidor:", err.message);
    return null;
  }
}

export async function updateItemServer(productId, quantity) {
  const headers = authHeaders();
  if (!headers["X-User-Id"]) return null;

  try {
    const resp = await axios.put(
      `${API_CART_URL}/items`,
      { productId, quantity },
      { headers }
    );
    return resp.data;
  } catch (err) {
    console.warn("⚠️ Error actualizando item en servidor:", err.message);
    return null;
  }
}

export async function removeItemServer(productId) {
  const headers = authHeaders();
  if (!headers["X-User-Id"]) return null;

  try {
    const resp = await axios.delete(`${API_CART_URL}/items/${productId}`, {
      headers,
    });
    return resp.data;
  } catch (err) {
    console.warn("⚠️ Error eliminando item en servidor:", err.message);
    return null;
  }
}

export async function clearCartServer() {
  const headers = authHeaders();
  if (!headers["X-User-Id"]) return null;

  try {
    const resp = await axios.delete(API_CART_URL, { headers });
    return resp.data;
  } catch (err) {
    console.warn("⚠️ Error limpiando carrito en servidor:", err.message);
    return null;
  }
}
