import { useCart } from '../context/CartContext';
import { money } from '../utils/money';
import '../styles/estilocarrito.css';

export default function Carrito(){
const { totals, cart, setQty, remove, coupon, setCoupon, clearCoupon, clear } = useCart();
return (
<main>
<h1>Carrito</h1>
{totals.detailed.length === 0 ? (
<p>Tu carrito está vacío.</p>
) : (
<table className="cart">
<thead>
<tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Total</th><th></th></tr>
</thead>
<tbody>
{totals.detailed.map(row => (
<tr key={row.id}>
<td>{row.product.name}</td>
<td>
<input type="number" min="0" value={row.qty} onChange={e=>setQty(row.id, Number(e.target.value)||0)} />
</td>
<td>{money(row.product.price)}</td>
<td>{money(row.line)}</td>
<td><button onClick={()=>remove(row.id)}>X</button></td>
</tr>
))}
</tbody>
<tfoot>
<tr><td colSpan="3" style={{textAlign:'right'}}>Subtotal</td><td>{money(totals.subtotal)}</td></tr>
<tr><td colSpan="3" style={{textAlign:'right'}}>Cupón</td>
<td>
<input value={coupon} onChange={e=>setCoupon(e.target.value)} placeholder="DESCUENTO10 / FREESHIP / 90PORCIENTO" />
{totals.discount>0 && <div>-{money(totals.discount)}</div>}
</td>
</tr>
<tr><td colSpan="3" style={{textAlign:'right'}}><strong>Total</strong></td><td><strong>{money(totals.total)}</strong></td></tr>
</tfoot>
</table>
)}
<div className="row" style={{marginTop:16,gap:8}}>
<button onClick={clearCoupon}>Limpiar cupón</button>
<button onClick={clear}>Vaciar carrito</button>
</div>
</main>
);
}