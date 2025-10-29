/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { PRODUCTS } from '../data/products';

const CART_KEY   = 'cart_v2';
const COUPON_KEY = 'cart_coupon_v1';

const CartCtx = createContext();
export const useCart = () => useContext(CartCtx);

/* ------------------ Helpers internos ------------------ */
function findProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

function clampQty(qty, stock) {
  const s = Number.isFinite(Number(stock)) ? Math.max(0, Number(stock)) : Infinity;
  const q = Math.max(0, Number(qty) || 0);
  return Math.min(q, s);
}

/** Recalcula líneas y totales (clamp seguro por si algo quedó fuera de rango) */
function computeTotals(cart, couponCode) {
  const detailed = cart.map(item => {
    const p = findProduct(item.id);
    if (!p) return null;

    const qty = clampQty(item.qty, p.stock);
    return {
      ...item,
      qty,
      product: p,
      line: p.price * qty
    };
  }).filter(Boolean);

  const subtotal   = detailed.reduce((a, i) => a + i.line, 0);
  const totalItems = detailed.reduce((a, i) => a + i.qty, 0);

  // Cupones
  let discount = 0;
  const code = (couponCode || '').toUpperCase();
  if (code === 'DESCUENTO10') discount = Math.round(subtotal * 0.10);
  if (code === 'FREESHIP')    discount = 4000;
  if (code === '90PORCIENTO') discount = Math.round(subtotal * 0.90);
  if (discount > subtotal) discount = subtotal;

  const total = subtotal - discount;

  return { detailed, subtotal, discount, total, totalItems, code };
}

/* ---------------------- Provider ---------------------- */
export function CartProvider({ children }) {
  const [cart,   setCart]   = useLocalStorage(CART_KEY, []);
  const [coupon, setCoupon] = useLocalStorage(COUPON_KEY, '');

  const api = useMemo(() => {
    /* -- Mutadores con límite por stock -- */

    /** Agregar respetando stock del producto */
    const add = (id, qty = 1) => {
      const p = findProduct(id);
      if (!p) return; // ID inválido → no hace nada

      setCart(prev => {
        const i = prev.findIndex(x => x.id === id);
        if (i >= 0) {
          const current = Number(prev[i].qty) || 0;
          const nextQty = clampQty(current + qty, p.stock);
          const copy = [...prev];
          copy[i] = { ...copy[i], qty: nextQty };
          return copy.filter(x => (Number(x.qty) || 0) > 0);
        }
        const firstQty = clampQty(qty, p.stock);
        return firstQty > 0 ? [...prev, { id, qty: firstQty }] : prev;
      });
    };

    /** Cambiar cantidad respetando stock del producto */
    const setQty = (id, qty) => {
      const p = findProduct(id);
      if (!p) return;

      setCart(prev => {
        const nextQty = clampQty(qty, p.stock);
        return prev
          .map(x => x.id === id ? { ...x, qty: nextQty } : x)
          .filter(x => (Number(x.qty) || 0) > 0);
      });
    };

    /** Eliminar ítem */
    const remove = (id) => setCart(prev => prev.filter(x => x.id !== id));

    /** Vaciar carrito */
    const clear = () => setCart([]);

    /** Stock disponible para un producto (helper para UI) */
    const getStock = (id) => {
      const p = findProduct(id);
      return Number(p?.stock ?? 0);
    };

    /** Cuánto stock queda considerando lo que hay en el carrito */
    const getStockLeft = (id) => {
      const stock = getStock(id);
      const inCart = Number(cart.find(x => x.id === id)?.qty || 0);
      return Math.max(0, stock - inCart);
    };

    /** Totales (incluye totalItems para badge) */
    const totals = computeTotals(cart, coupon);

    return {
      cart,
      coupon,
      totals,
      totalItems: totals.totalItems,           // usa los totales (clamp ya aplicado)
      setCoupon: (c) => setCoupon((c || '').toUpperCase()),
      clearCoupon: () => setCoupon(''),

      add,
      setQty,
      remove,
      clear,

      // helpers opcionales para la UI
      getStock,
      getStockLeft,
    };
  }, [cart, coupon, setCart, setCoupon]);

  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>;
}
