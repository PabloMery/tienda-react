import { PRODUCTS } from '../data/products';
import ProductGrid from '../components/ProductGrid';


export default function Home(){
// En el proyecto original hay un render "en home" de destacados: aquí usamos todos
return (
<main>
<h1>Bienvenido</h1>
<ProductGrid products={PRODUCTS} />
</main>
);
}