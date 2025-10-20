import { useParams } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { money } from '../utils/money';
import '../styles/estilodetalleProductos.css';

export default function Detalle(){
const { id } = useParams();
const p = PRODUCTS.find(x => x.id === Number(id));
const { add } = useCart();
if (!p) return <main><p>Producto no encontrado.</p></main>;
return (
<main className="detalle">
<div className="galeria">
{(p.images||['/IMG/placeholder.jpg']).map((src,i)=>(
<img key={i} src={src} alt={`${p.name} ${i+1}`} loading="lazy" />
))}
</div>
<div className="info">
<h1>{p.name}</h1>
<p className="muted">{p.category}</p>
<p className="price">{money(p.price)}</p>
<button onClick={()=>add(p.id,1)}>Añadir al carrito</button>
</div>
</main>
);
}