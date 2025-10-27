import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { PRODUCTS } from '../data/products';

const CART_KEY = 'cart_v2';
const COUPON_KEY = 'cart_coupon_v1';

const CartCtx = createContext();
export const useCart = () => useContext(CartCtx);

function computeTotals(cart, couponCode) {
  const detailed = cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    const qty = Number(item.qty) || 0;
    return p ? { ...item, qty, product: p, line: p.price * qty } : null;
  }).filter(Boolean);

  const subtotal = detailed.reduce((a, i) => a + i.line, 0);
  let discount = 0;
  const code = (couponCode || '').toUpperCase();
  if (code === 'DESCUENTO10') discount = Math.round(subtotal * 0.10);
  if (code === 'FREESHIP')    discount = 4000;
  if (code === '90PORCIENTO') discount = Math.round(subtotal * 0.90);
  if (discount > subtotal) discount = subtotal;
  const total = subtotal - discount;

  return { detailed, subtotal, discount, total, code };
}

export function CartProvider({ children }) {
  const [cart, setCart] = useLocalStorage(CART_KEY, []);
  const [coupon, setCoupon] = useLocalStorage(COUPON_KEY, '');

  // 👇 suma de cantidades (para el badge)
  const totalItems = cart.reduce((a, i) => a + (Number(i.qty) || 0), 0);

  const api = useMemo(() => ({
    cart,
    coupon,
    totalItems, // 👈 EXPUÉSTALO
    setCoupon: (c) => setCoupon((c || '').toUpperCase()),
    clearCoupon: () => setCoupon(''),
    add: (id, qty = 1) => setCart(prev => {
      const q = Number(qty) || 0;
      const i = prev.findIndex(x => x.id === id);
      if (i >= 0) {
        const copy = [...prev];
        const nextQty = (Number(copy[i].qty) || 0) + q;
        copy[i] = { ...copy[i], qty: nextQty };
        return copy.filter(x => (Number(x.qty) || 0) > 0);
      }
      return q > 0 ? [...prev, { id, qty: q }] : prev;
    }),
    setQty: (id, qty) =>
      setCart(prev =>
        prev
          .map(x => x.id === id ? { ...x, qty: Math.max(0, Number(qty) || 0) } : x)
          .filter(x => (Number(x.qty) || 0) > 0)
      ),
    remove: (id) => setCart(prev => prev.filter(x => x.id !== id)),
    clear: () => setCart([]),
    totals: computeTotals(cart, coupon),
  }), [cart, coupon, setCart, setCoupon, totalItems]);

  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>;
}
