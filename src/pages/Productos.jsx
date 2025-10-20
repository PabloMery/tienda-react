// src/pages/Productos.jsx
import '../styles/estiloproductos.css';
import { PRODUCTS } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function Productos() {
  return (
    <main className="productos">
      <section id="grid" className="grid">
        {PRODUCTS.map(p => <ProductCard key={p.id} p={p} />)}
      </section>
    </main>
  );
}
        