// src/pages/Carrito.jsx
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { money } from "../utils/money";
import "../styles/estilocarrito.css";
import DatosCliente from "../components/DatosCliente";

export default function Carrito() {
  const {
    totals,
    setQty,
    remove,
    coupon,
    setCoupon,
    clearCoupon,
    clear,
  } = useCart();

  const hasItems = totals?.detailed?.length > 0;
  const navigate = useNavigate();

  // --- LÓGICA DE IMÁGENES UNIFICADA ---
  // Esta función detecta si la imagen viene del backend (/api) o es local
  const getImageSrc = (imgUrl) => {
    if (!imgUrl) return '/IMG/placeholder.jpg';
    
    // Si viene del backend (puerto 8080), agregamos el dominio completo
    if (imgUrl.startsWith('/api')) {
      return `http://localhost:8080${imgUrl}`;
    }
    
    // Si no, asumimos que es una ruta local (ej: /IMG/...)
    return imgUrl;
  };

  const onQty = (id, v) => {
    const n = Number(v);
    if (!Number.isNaN(n) && n >= 0) setQty(id, n);
  };

  const handlePay = () => {
    if (!hasItems) return;
    // Limpia cupón y carrito
    if (clearCoupon) clearCoupon();
    clear();
    // Navega a la confirmación
    navigate("/pago-exitoso");
  };

  return (
    <main className="wrap">
      <h1 className="title">Mi carrito de compras</h1>

      <section className="cart">
        <div className="panel">
          {!hasItems ? (
            <div className="empty">
              <p>Tu carrito está vacío.</p>
            </div>
          ) : (
            <div className="list">
              {totals.detailed.map((row) => {
                // Obtenemos la primera imagen del array de imágenes del producto
                const firstImage = row.product.images && row.product.images.length > 0 
                  ? row.product.images[0] 
                  : null;

                return (
                  <div className="row" key={row.id}>
                    <div className="prodCell">
                      <div className="ph">
                        <img
                          // Usamos el helper para resolver la URL correcta
                          src={getImageSrc(firstImage)}
                          alt={row.product.name}
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <div className="name">{row.product.name}</div>
                        {row.product.subtitle && (
                          <div className="muted">{row.product.subtitle}</div>
                        )}
                      </div>
                    </div>

                    <div className="qtyBox">
                      <button
                        className="button-icon ghost"
                        aria-label="Disminuir"
                        onClick={() => setQty(row.id, Math.max(0, row.qty - 1))}
                        title="Disminuir"
                      >
                        -
                      </button>

                      <input
                        type="number"
                        min="0"
                        value={row.qty}
                        onChange={(e) => onQty(row.id, e.target.value)}
                        aria-label={`Cantidad de ${row.product.name}`}
                      />

                      <button
                        className="button-icon ghost"
                        aria-label="Aumentar"
                        onClick={() => setQty(row.id, row.qty + 1)}
                        title="Aumentar"
                      >
                        +
                      </button>

                      <button
                        className="button-icon danger"
                        title="Quitar"
                        aria-label={`Quitar ${row.product.name}`}
                        onClick={() => remove(row.id)}
                      >
                        🗑
                      </button>
                    </div>

                    <div className="price">{money(row.product.price)}</div>
                    <div className="price">{money(row.line)}</div>
                  </div>
                );
              })}

              <div className="listActions">
                <button className="button danger" onClick={clear}>
                  Vaciar carrito
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="panel summary">
          <div className="sumLine">
            <strong>TOTAL:</strong>
            <strong id="sum-total">{money(totals.subtotal)}</strong>
          </div>

          <div className="sumLine">
            <span>Descuento</span>
            <span id="sum-disc">-{money(totals.discount || 0)}</span>
          </div>

          <div className="sumLine total">
            <span>Total a pagar</span>
            <span id="sum-pay">{money(totals.total)}</span>
          </div>

          <div className="coupon">
            <input
              id="coupon"
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Ingresa cupón de descuento"
            />
            <button
              className="button-icon primary"
              title="Aplicar"
              onClick={() => {/* opcional: lógica para aplicar cupón */}}
            >
              ✓
            </button>
          </div>

          <div className="listActions">
            <button className="button ghost" onClick={clearCoupon}>
              Limpiar cupón
            </button>

            <button
              id="pay"
              className="button primary"
              disabled={!hasItems}
              onClick={handlePay}
            >
              PAGAR
            </button>
          </div>

          <DatosCliente
            title="Resumen del cliente"
            fields={["nombre", "correo", "region", "comuna"]}
            className="datos-cliente"
          />
        </aside>
      </section>
    </main>
  );
}