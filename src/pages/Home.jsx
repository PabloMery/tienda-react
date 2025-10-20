import { PRODUCTS } from '../data/products';
import ProductGrid from '../components/ProductGrid';
import '../styles/estiloHome.css';


export default function Home(){
// En el proyecto original hay un render "en home" de destacados: aquí usamos todos
return (
<main>
    <section class="hero" aria-labelledby="titulo-hero">
      <div class="hero__card">
        <h1 id="titulo-hero">TIENDA ONLINE</h1>
        <p>Nuestra colección ya está disponible con envíos a todo Chile.
           Descubre nuestras novedades y productos nuevos.</p>
        <a href="productos.html" class="btn">Ver Productos</a>
        <a class="btn btn--ghost" href="nosotros_index.html">Conócenos</a>
      </div>
      <div class="hero__media" aria-hidden="true">
        <div class="media__ph">Imagen destacada 16:9</div>
      </div>
    </section>
<ProductGrid products={PRODUCTS} />
</main>
);
}