/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'; // <-- 1. Importamos useState y useEffect
import { useLocalStorage } from '../hooks/useLocalStorage';
// import { PRODUCTS } from '../data/products'; // <-- 2. ELIMINAMOS la importación estática
import { getProductos } from '../services/api'; // <-- 3. Importamos nuestra API

const CART_KEY   = 'cart_v2';
const COUPON_KEY = 'cart_coupon_v1';

const CartCtx = createContext();
export const useCart = () => useContext(CartCtx);

// Esta función es pura, no necesita cambios
function clampQty(qty, stock) {
  const s = Number.isFinite(Number(stock)) ? Math.max(0, Number(stock)) : Infinity;
  const q = Math.max(0, Number(qty) || 0);
  return Math.min(q, s);
}

export function CartProvider({ children }) {
  const [cart,   setCart]   = useLocalStorage(CART_KEY, []);
  const [coupon, setCoupon] = useLocalStorage(COUPON_KEY, '');

  // 4. Creamos un estado para guardar la lista completa de productos de la API
  const [productList, setProductList] = useState([]);

  // 5. Usamos useEffect para cargar los productos de la API cuando el CartProvider se monta
  useEffect(() => {
    getProductos().then(data => {
      setProductList(data); // Guardamos la lista de productos en el estado
    });
  }, []); // El [] asegura que solo se ejecute una vez

  
  // 6. Movemos las funciones que dependen de la lista de productos DENTRO del Provider
  //    para que puedan acceder a 'productList'
  
  function findProduct(id) {
    return productList.find(p => p.id === id);
  }

  function computeTotals(cart, couponCode) {
    const detailed = cart.map(item => {
      const p = findProduct(item.id); // Usa la función interna que accede a 'productList'
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

    // (Tu lógica de cupones no cambia)
    let discount = 0;
    const code = (couponCode || '').toUpperCase();
    if (code === 'DESCUENTO10') discount = Math.round(subtotal * 0.10);
    if (code === 'FREESHIP')    discount = 4000;
    if (code === '90PORCIENTO') discount = Math.round(subtotal * 0.90);
    if (discount > subtotal) discount = subtotal;

    const total = subtotal - discount;

    return { detailed, subtotal, discount, total, totalItems, code };
  }

  // 7. Agregamos 'productList' al array de dependencias de useMemo
  //    Esto asegura que el carrito se recalcule si la lista de productos cambia
  const api = useMemo(() => {

    const add = (id, qty = 1) => {
      const p = findProduct(id); // Usa la función interna
      if (!p) return; 

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

    const setQty = (id, qty) => {
      const p = findProduct(id); // Usa la función interna
      if (!p) return;

      setCart(prev => {
        const nextQty = clampQty(qty, p.stock);
        return prev
          .map(x => x.id === id ? { ...x, qty: nextQty } : x)
          .filter(x => (Number(x.qty) || 0) > 0);
      });
    };

    const remove = (id) => setCart(prev => prev.filter(x => x.id !== id));
    const clear = () => setCart([]);

    const getStock = (id) => {
      const p = findProduct(id); // Usa la función interna
      return Number(p?.stock ?? 0);
    };

    const getStockLeft = (id) => {
      const stock = getStock(id);
      const inCart = Number(cart.find(x => x.id === id)?.qty || 0);
      return Math.max(0, stock - inCart);
    };

    const totals = computeTotals(cart, coupon); // Usa la función interna

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
  }, [cart, coupon, setCart, setCoupon, productList]); // <-- 8. Dependemos de productList

  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>;
}