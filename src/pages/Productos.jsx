import { useMemo, useState } from 'react';
import { PRODUCTS } from '../data/products';
import ProductGrid from '../components/ProductGrid';


export default function Productos(){
const [q, setQ] = useState('');
const list = useMemo(() => {
const k = q.trim().toLowerCase();
if (!k) return PRODUCTS;
return PRODUCTS.filter(p =>
p.name.toLowerCase().includes(k) ||
p.category.toLowerCase().includes(k)
);
}, [q]);


return (
<main>
<h1>Productos</h1>
<input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar..." />
<ProductGrid products={list} />
</main>
);
}