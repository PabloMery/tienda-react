/* eslint-disable react-refresh/only-export-components */
// src/context/CartContext.jsx
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';

import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  getProductos,
  mergeRemoteCart,
  addRemoteCartItem,
  updateRemoteCartItem,
  removeRemoteCartItem,
  clearRemoteCart,
} from '../services/api';

const CART_KEY = 'cart_v2';
const COUPON_KEY = 'cart_coupon_v1';

const CartCtx = createContext();
export const useCart = () => useContext(CartCtx);

// ==========================
//   HELPERS
// ==========================

function clampQty(qty, stock) {
  const s = Number.isFinite(Number(stock)) ? Math.max(0, Number(stock)) : Infinity;
  const q = Math.max(0, Number(qty) || 0);
  return Math.min(q, s);
}

function getSessionUserId() {
  try {
    const raw = localStorage.getItem('session_user');
    if (!raw) return null;
    const session = JSON.parse(raw);
    return session?.id ?? null;
  } catch {
    return null;
  }
}

// ==========================
//   PROVIDER
// ==========================

export function CartProvider({ children }) {
  const [cart, setCart] = useLocalStorage(CART_KEY, []);
  const [coupon, setCoupon] = useLocalStorage(COUPON_KEY, '');

  // Lista de productos desde el backend
  const [productList, setProductList] = useState([]);

  // Loading general de productos
  const [loading, setLoading] = useState(true);

  // Flag para no hacer merge remoto más de una vez
  const [hasSyncedRemote, setHasSyncedRemote] = useState(false);

  // 1) Cargamos productos al iniciar
  useEffect(() => {
    const loadProductData = async () => {
      try {
        const data = await getProductos();
        setProductList(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Error cargando productos para el carrito:', e);
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, []);

  // 2) Al tener usuario logueado + carrito local, hacer MERGE inicial con backend
  useEffect(() => {
    if (hasSyncedRemote) return;

    const userId = getSessionUserId();
    if (!userId) return; // invitado, no sincronizamos
    if (!cart || cart.length === 0) {
      setHasSyncedRemote(true);
      return;
    }

    const doMerge = async () => {
      try {
        const itemsToMerge = cart
          .filter((i) => i && i.id && i.qty > 0)
          .map((i) => ({
            productId: i.id,
            quantity: i.qty,
          }));

        if (itemsToMerge.length > 0) {
          await mergeRemoteCart(itemsToMerge);
        }
      } catch (err) {
        console.error('Error haciendo merge de carrito remoto:', err);
      } finally {
        setHasSyncedRemote(true);
      }
    };

    doMerge();
  }, [cart, hasSyncedRemote]);

  // ==========================
  //   FUNCIONES INTERNAS
  // ==========================

  function findProduct(id) {
    return productList.find((p) => p.id === id);
  }

  function computeTotals(cartState, couponCode) {
    const detailed = cartState
      .map((item) => {
        const p = findProduct(item.id);
        if (!p) return null;

        const qty = clampQty(item.qty, p.stock);
        return {
          ...item,
          qty,
          product: p,
          line: p.price * qty,
        };
      })
      .filter(Boolean);

    const subtotal = detailed.reduce((a, i) => a + i.line, 0);
    const totalItems = detailed.reduce((a, i) => a + i.qty, 0);

    // Lógica de cupones
    let discount = 0;
    const code = (couponCode || '').toUpperCase();
    if (code === 'DESCUENTO10') discount = Math.round(subtotal * 0.1);
    if (code === 'FREESHIP') discount = 4000;
    if (code === '90PORCIENTO') discount = Math.round(subtotal * 0.9);
    if (discount > subtotal) discount = subtotal;

    const total = subtotal - discount;

    return { detailed, subtotal, discount, total, totalItems, code };
  }

  // ==========================
  //   API EXTERNA DEL CONTEXTO
  // ==========================

  const api = useMemo(() => {
    const add = (id, qty = 1) => {
      const p = findProduct(id);
      if (!p) return;

      // 1) Actualizamos local
      setCart((prev) => {
        const i = prev.findIndex((x) => x.id === id);
        if (i >= 0) {
          const current = Number(prev[i].qty) || 0;
          const nextQty = clampQty(current + qty, p.stock);
          const copy = [...prev];
          copy[i] = { ...copy[i], qty: nextQty };
          return copy.filter((x) => (Number(x.qty) || 0) > 0);
        }
        const firstQty = clampQty(qty, p.stock);
        return firstQty > 0 ? [...prev, { id, qty: firstQty }] : prev;
      });

      // 2) Enviamos al microservicio si hay usuario
      const userId = getSessionUserId();
      if (userId) {
        addRemoteCartItem(id, qty).catch((err) =>
          console.error('Error agregando item al carrito remoto:', err)
        );
      }
    };

    const setQty = (id, qty) => {
      const p = findProduct(id);
      if (!p) return;

      const nextQty = clampQty(qty, p.stock);

      // 1) Actualizamos local
      setCart((prev) =>
        prev
          .map((x) => (x.id === id ? { ...x, qty: nextQty } : x))
          .filter((x) => (Number(x.qty) || 0) > 0)
      );

      // 2) Actualizamos remoto
      const userId = getSessionUserId();
      if (!userId) return;

      if (nextQty <= 0) {
        // si quedó en 0, elimina
        removeRemoteCartItem(id).catch((err) =>
          console.error('Error eliminando item remoto en setQty:', err)
        );
      } else {
        updateRemoteCartItem(id, nextQty).catch((err) =>
          console.error('Error actualizando cantidad remota:', err)
        );
      }
    };

    const remove = (id) => {
      // 1) Local
      setCart((prev) => prev.filter((x) => x.id !== id));

      // 2) Remoto
      const userId = getSessionUserId();
      if (userId) {
        removeRemoteCartItem(id).catch((err) =>
          console.error('Error eliminando item remoto:', err)
        );
      }
    };

    const clear = () => {
      // 1) Local
      setCart([]);

      // 2) Remoto
      const userId = getSessionUserId();
      if (userId) {
        clearRemoteCart().catch((err) =>
          console.error('Error limpiando carrito remoto:', err)
        );
      }
    };

    const getStock = (id) => {
      const p = findProduct(id);
      return Number(p?.stock ?? 0);
    };

    const getStockLeft = (id) => {
      const stock = getStock(id);
      const inCart = Number(cart.find((x) => x.id === id)?.qty || 0);
      return Math.max(0, stock - inCart);
    };

    const totals = computeTotals(cart, coupon);

    return {
      cart,
      coupon,
      totals,
      totalItems: totals.totalItems,
      setCoupon: (c) => setCoupon((c || '').toUpperCase()),
      clearCoupon: () => setCoupon(''),
      add,
      setQty,
      remove,
      clear,
      getStock,
      getStockLeft,
    };
  }, [cart, coupon, setCart, setCoupon, productList]);

  // ==========================
  //   RENDER
  // ==========================

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#111',
          color: 'white',
        }}
      >
        <h2>Cargando Tienda...</h2>
      </div>
    );
  }

  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>;
}
