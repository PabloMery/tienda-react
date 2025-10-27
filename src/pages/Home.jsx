// src/pages/Home.jsx
import { PRODUCTS } from '../data/products';
import ProductGrid from '../components/ProductGridHome';
import '../styles/estiloHome.css';
import { useCallback } from 'react';
import { Link } from 'react-router-dom'; // 👈 importa Link

export default function Home({ cartCount = 0 }) {
  const handleSubscribe = useCallback((e) => {
    e.preventDefault();
    alert('¡Gracias por suscribirte!');
  }, []);

  return (
    <>
      <main className="wrap" id="contenido">
        <section className="hero" aria-labelledby="titulo-hero">
          <div className="hero__card">
            <h1 id="titulo-hero">TIENDA ONLINE</h1>
            <p> Nuestra colección ya está disponible con envíos a todo Chile.
                Descubre nuestras novedades y productos nuevos. </p>
            <div className="hero__actions">
              <Link to="/productos" className="btn">Ver Productos</Link>
              <Link to="/nosotros" className="btn btn--ghost">Conócenos</Link>
            </div>
          </div>

          <div className="hero__media" aria-hidden="true">
            <div className="media__ph">Imagen destacada 16:9</div>
            {/* o <img src="/IMG/hero.jpg" alt="" loading="lazy" /> */}
          </div>
        </section>


        <section className="section" id="productos" aria-labelledby="titulo-prods">

          <ProductGrid products={PRODUCTS} />
        </section>
      </main>

      {/* Footer */}
      <footer>
        <div className="wrap foot">
          <div className="foot__row">
            <strong>TANGANA</strong>
            <span className="spacer" />
            <a href="#">Category 1</a>
            <a href="#">Category 2</a>
            <a href="#">Category 3</a>
          </div>
          <div className="foot__row">
            <form onSubmit={handleSubscribe}>
              <label htmlFor="email" className="visually-hidden">Correo</label>
              <input id="email" type="email" placeholder="Ingresa tu correo" required />
              <button type="submit">Suscribirse</button>
            </form>
          </div>
        </div>
      </footer>
    </>
  );
}
