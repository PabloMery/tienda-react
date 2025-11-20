import React, { useState, useEffect } from 'react'; 
import { getProductos } from '../services/api'; 
import ProductGrid from '../components/ProductGridHome';
import '../styles/estiloHome.css';
import { Link } from 'react-router-dom';

export default function Home() {

  const [productos, setProductos] = useState([]);


  useEffect(() => {
    const cargarProductos = async () => {
      const data = await getProductos(); 
      setProductos(data); 
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
          <ProductGrid products={productos} />
        </section>
      </main>

    </>
  );
}