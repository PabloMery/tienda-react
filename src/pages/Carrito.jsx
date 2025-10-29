import { useCart } from '../context/CartContext';
import { money } from '../utils/money';
import '../styles/estilocarrito.css';
import DatosCliente from '../components/DatosCliente';
import { productMainImage } from "../utils/images";

export default function Carrito() {
  const { totals, setQty, remove, coupon, setCoupon, clearCoupon, clear } = useCart();
  const hasItems = totals?.detailed?.length > 0;

  const onQty = (id, v) => {
    const n = Number(v);
    if (!Number.isNaN(n) && n >= 0) setQty(id, n);
  };

  return (
    <main className="wrap">
      <h1 className="title">Mi carrito de compras</h1>

      <section className="cart">
        {/* PANEL IZQUIERDO: LISTA */}
        <div className="panel">
          {!hasItems ? (
            <div className="empty">
              <p>Tu carrito está vacío.</p>
            </div>
          ) : (
            <div className="list">

              {totals.detailed.map((row) => (
                <div className="row" key={row.id}>
                  {/* Col 1: imagen + nombre */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem' }}>
                    <div className="ph">
                      <img src={productMainImage(row.product)} alt={row.product.name} loading="lazy" />
                    </div>

                    <div>
                      <div className="name">{row.product.name}</div>
                      {row.product.subtitle && (
                        <div className="muted">{row.product.subtitle}</div>
                      )}
                    </div>
                  </div>

                  {/* Col 2: cantidad + quitar */}
                  <div className="qtyBox">
                    <button
                      className="iconBtn ghost"
                      aria-label="Disminuir"
                      onClick={() => setQty(row.id, Math.max(0, row.qty - 1))}
                    >
                      −
                    </button>

                    <input
                      type="number"
                      min="0"
                      value={row.qty}
                      onChange={(e) => onQty(row.id, e.target.value)}
                      aria-label={`Cantidad de ${row.product.name}`}
                    />

                    <button
                      className="iconBtn ghost"
                      aria-label="Aumentar"
                      onClick={() => setQty(row.id, row.qty + 1)}
                    >
                      +
                    </button>

                    <button
                      className="iconBtn danger"
                      title="Quitar"
                      aria-label={`Quitar ${row.product.name}`}
                      onClick={() => remove(row.id)}
                    >
                      🗑
                    </button>
                  </div>

                  {/* Col 3: precio unitario */}
                  <div className="price">Precio Unitario: {money(row.product.price)}</div>

                  {/* Col 4: total línea */}
                  <div className="price">Total: {money(row.line)}</div>
                </div>
              ))}

              {/* Acciones debajo de la lista */}

            </div>
          )}
        </div>

        {/* PANEL DERECHO: RESUMEN */}
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
            <button className="iconBtn primary" title="Aplicar">
              ✓
            </button>
          </div>
            <div className="listActions">
              <button id="pay" className="btn primary" disabled={!hasItems}>
                PAGAR
              </button>
              
              <button className="btn ghost" onClick={clearCoupon}>
                Limpiar cupón
              </button>
              <button className="btn danger" onClick={clear}>
                Vaciar carrito
              </button>
            </div>

          <DatosCliente
            title="Resumen del cliente"
            fields={['nombre', 'correo', 'region', 'comuna']}
            className="datos-cliente"
          />
        </aside>
      </section>
    </main>
  );
}
