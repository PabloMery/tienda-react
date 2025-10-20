import ProductCard from './ProductCard';


export default function ProductGrid({ products }){
return (
<div id="grid" className="grid">
{products.map(p => <ProductCard key={p.id} p={p} />)}
</div>
);
}