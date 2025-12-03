// src/context/CartContext.jsx
/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { getProductos } from "../services/api";
import {
  fetchCartFromServer,
  addItemServer,
  updateItemServer,
  removeItemServer,
  clearCartServer,
} from "../services/cartApi";

const CART_KEY = "cart_v2";
const COUPON_KEY = "cart_coupon_v1";

const CartCtx = createContext();
export const useCart = () => useContext(CartCtx);

// Limita cantidad por stock
function clampQty(qty, stock) {
  const s = Number.isFinite(Number(stock)) ? Math.max(0, Number(stock)) : Infinity;
  const q = Math.max(0, Number(qty) || 0);
  return Math.min(q, s);
}

// Lee usuario de sesión
function getSessionUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useLocalStorage(CART_KEY, []); // {id, qty}
  const [coupon, setCoupon] = useLocalStorage(COUPON_KEY, "");
  const [productList, setProductList] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const [sessionUser, setSessionUser] = useState(getSessionUser());

  // Actualizar usuario si cambia localStorage (ej: login/logout)
  useEffect(() => {
    const handler = () => setSessionUser(getSessionUser());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // Cargar productos
  useEffect(() => {
    const loadProducts = async () => {
      const data = await getProductos();
      setProductList(data || []);
      setLoadingProducts(false);
    };
    loadProducts();
  }, []);

  // Si hay usuario con id, sincroniza carrito local con servidor
  useEffect(() => {
    const sync = async () => {
      if (!sessionUser || !sessionUser.id) return;
      setSyncing(true);

      // 1. Obtenemos carrito actual del servidor
      const serverCart = await fetchCartFromServer();

      // 2. Si el servidor aún no tiene items, mandamos lo que haya en local
      if (serverCart && (!serverCart.items || serverCart.items.length === 0) && cart.length > 0) {
        // merge simple: mandamos todos los items locales como "add"
        for (const item of cart) {
          await addItemServer(Number(item.id), Number(item.qty) || 1);
        }
      }

      // 3. Volvemos a leer y dejamos local igual al del servidor
      const updated = await fetchCartFromServer();
      if (updated && Array.isArray(updated.items)) {
        const newCart = updated.items.map((it) => ({
          id: Number(it.productId),
          qty: Number(it.quantity) || 0,
        }));
        setCart(newCart);
      }

      setSyncing(false);
    };

    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionUser?.id]);

  function findProduct(id) {
    const nId = Number(id);
    return productList.find((p) => Number(p.id) === nId);
  }

  function computeTotals(currentCart, couponCode) {
    const detailed = currentCart
      .map((item) => {
        const p = findProduct(item.id);
        if (!p) return null;
        const qty = clampQty(item.qty, p.stock);
        return {
          ...item,
          id: Number(item.id),
          qty,
          product: p,
          line: p.price * qty,
        };
      })
      .filter(Boolean);

    const subtotal = detailed.reduce((a, i) => a + i.line, 0);
    const totalItems = detailed.reduce((a, i) => a + i.qty, 0);

    let discount = 0;
    const code = (couponCode || "").toUpperCase();
    if (code === "DESCUENTO10") discount = Math.round(subtotal * 0.1);
    if (code === "FREESHIP") discount = 4000;
    if (code === "90PORCIENTO") discount = Math.round(subtotal * 0.9);
    if (discount > subtotal) discount = subtotal;

    const total = subtotal - discount;
    return { detailed, subtotal, discount, total, totalItems, code };
  }

  const api = useMemo(() => {
    const isLogged = !!(sessionUser && sessionUser.id);

    const add = async (id, qty = 1) => {
      const p = findProduct(id);
      if (!p) return;

      const nId = Number(id);
      const nQty = Number(qty) || 1;

      // 1) Actualizamos local
      setCart((prev) => {
        const i = prev.findIndex((x) => Number(x.id) === nId);
        if (i >= 0) {
          const current = Number(prev[i].qty) || 0;
          const nextQty = clampQty(current + nQty, p.stock);
          const copy = [...prev];
          copy[i] = { ...copy[i], id: nId, qty: nextQty };
          return copy.filter((x) => (Number(x.qty) || 0) > 0);
        }
        const firstQty = clampQty(nQty, p.stock);
        return firstQty > 0
          ? [...prev, { id: nId, qty: firstQty }]
          : prev;
      });

      // 2) Si está logueado, avisamos al servidor
      if (isLogged) {
        await addItemServer(nId, nQty);
      }
    };

    const setQty = async (id, qty) => {
      const p = findProduct(id);
      if (!p) return;
      const nId = Number(id);
      const nQty = clampQty(qty, p.stock);

      setCart((prev) => {
        const i = prev.findIndex((x) => Number(x.id) === nId);
        if (i < 0) {
          return nQty > 0 ? [...prev, { id: nId, qty: nQty }] : prev;
        }
        const copy = [...prev];
        copy[i] = { ...copy[i], id: nId, qty: nQty };
        return copy.filter((x) => (Number(x.qty) || 0) > 0);
      });

      if (isLogged) {
        await updateItemServer(nId, nQty);
      }
    };

    const remove = async (id) => {
      const nId = Number(id);
      setCart((prev) => prev.filter((x) => Number(x.id) !== nId));

      if (isLogged) {
        await removeItemServer(nId);
      }
    };

    const clear = async () => {
      setCart([]);
      if (isLogged) {
        await clearCartServer();
      }
    };

    const setCouponCode = (code) => setCoupon(code || "");

    const totals = computeTotals(cart, coupon);

    return {
      cart,
      coupon,
      totals,
      totalItems: totals.totalItems,
      add,
      setQty,
      remove,
      clear,
      setCouponCode,
      isLogged,
      sessionUser,
      loading: loadingProducts || syncing,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, coupon, productList, loadingProducts, syncing, sessionUser?.id]);

  if (loadingProducts) {
    return (
      <CartCtx.Provider value={{ cart: [], totals: {}, totalItems: 0 }}>
        <div style={{ padding: 32, textAlign: "center", color: "#ccc" }}>
          Cargando tienda…
        </div>
        {children}
      </CartCtx.Provider>
    );
  }

  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>;
}
