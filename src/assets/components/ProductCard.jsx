import { money } from '../utils/money';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';


export default function ProductCard({ p }) {
const { add } = useCart();
const img = (p.images && p.images[0]) || '/IMG/placeholder.jpg';
return (
<article className="card">
<Link className="card__img" to={`/producto/${p.id}`} aria-label={p.name}>
<img src={img} alt={p.name} loading="lazy" />
</Link>
<div className="card__body">
<div className="muted">{p.category}</div>
<h3 className="t">{p.name}</h3>
<div className="row">
<span className="price">{money(p.price)}</span>
<button type="button" onClick={()=>add(p.id,1)}>Añadir</button>
</div>
</div>
</article>
);
}