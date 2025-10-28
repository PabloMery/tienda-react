import { useCart } from '../context/CartContext';
import { money } from '../utils/money';
import '../styles/estilocarrito.css';
import DatosCliente from '../components/DatosCliente';

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
              {/* Encabezado tipo tabla */}
              <div className="row" style={{fontWeight:600}}>
                <div className="muted">Producto</div>
                <div className="muted" style={{textAlign:'right'}}>Cantidad</div>
                <div className="muted" style={{textAlign:'right'}}>Precio</div>
                <div className="muted" style={{textAlign:'right'}}>Total</div>
              </div>

              {totals.detailed.map((row) => (
                <div className="row" key={row.id}>
                  {/* Col 1: imagen + nombre */}
                  <div style={{display:'flex', alignItems:'center', gap:'.8rem'}}>
                    <div className="ph">
                      {/* si tienes imagen úsala; si no, queda el placeholder */}
                      {row.product.image ? <img src={row.product.image} alt={row.product.name} /> : 'IMG'}
                    </div>
                    <div>
                      <div className="name">{row.product.name}</div>
                      {/* opcional: subtítulo / marca */}
                      {row.product.subtitle && <div className="muted">{row.product.subtitle}</div>}
                    </div>
                  </div>

                  {/* Col 2: cantidad + quitar */}
                  <div className="qtyBox">
                    <input
                      type="number"
                      min="0"
                      value={row.qty}
                      onChange={(e) => onQty(row.id, e.target.value)}
                      aria-label={`Cantidad de ${row.product.name}`}
                    />
                    <button
                      className="iconBtn remove"
                      title="Quitar"
                      aria-label={`Quitar ${row.product.name}`}
                      onClick={() => remove(row.id)}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Col 3: precio unitario */}
                  <div className="price">{money(row.product.price)}</div>

                  {/* Col 4: total línea */}
                  <div className="price">{money(row.line)}</div>
                </div>
              ))}

              {/* acciones debajo de la lista */}
              <div style={{padding:'.8rem 0', display:'grid', gap:'.5rem', borderTop:'1px dashed #e5e7eb', marginTop:'.6rem'}}>
                <button className="btn" style={{background:'transparent', color:'inherit', borderColor:'#e5e7eb'}} onClick={clearCoupon}>
                  Limpiar cupón
                </button>
                <button className="btn" style={{background:'#ef4444', borderColor:'#ef4444'}} onClick={clear}>
                  Vaciar carrito
                </button>
              </div>
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
            <button className="iconBtn" title="Aplicar">✓</button>
          </div>

          <button id="pay" className="btn" disabled={!hasItems}>PAGAR</button>

          <DatosCliente
            title="Resumen del cliente"
            fields={['nombre','correo','region','comuna']}
            className="datos-cliente"
          />
        </aside>
      </section>
    </main>
  );
}
