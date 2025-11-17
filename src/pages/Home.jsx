import React, { useState, useEffect, useCallback } from 'react'; // <-- 1. Importamos hooks
// import { PRODUCTS } from '../data/products'; // <-- 2. ELIMINAMOS esta línea
import { getProductos } from '../services/api'; // <-- 3. Importamos nuestra API
import ProductGrid from '../components/ProductGridHome';
import '../styles/estiloHome.css';
import { Link } from 'react-router-dom';

export default function Home() {
  // 4. Creamos estado para los productos
  const [productos, setProductos] = useState([]);

  // 5. useEffect para cargar los datos
  useEffect(() => {
    const cargarProductos = async () => {
      const data = await getProductos(); // Llama a nuestra api.js
      setProductos(data); // Rellena el estado
    };

    cargarProductos();
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
              <Link to="/productos" className="btn2">Ver Productos</Link>
              <Link to="/nosotros" className="btn2 btn2--ghost">Conócenos</Link>
            </div>
          </div>

          <div className="hero__media" aria-hidden="true">
            <div className="media__ph">Imagen destacada 16:9</div>
          </div>
        </section>


        <section className="section" id="productos" aria-labelledby="titulo-prods">
          {/* 6. Pasamos los productos del estado (de la API) al componente grid */}
          <ProductGrid products={productos} />
        </section>
      </main>

    </>
  );
}