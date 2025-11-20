import React from 'react';
import { Link } from 'react-router-dom'; // Usamos Link para que la tarjeta sea clicable
import '../styles/grid2.modular.css'; // Importamos el CSS nuevo
import { money } from '../utils/money';

export default function ProductGridHome({ products = [] }) {

  // Helper para las URLs de imágenes
  const getImageSrc = (imgUrl) => {
    if (!imgUrl) return '/IMG/placeholder.jpg';
    if (imgUrl.startsWith('/api')) {
      return `http://localhost:8080${imgUrl}`;
    }
    return imgUrl;
  };

  if (!products || products.length === 0) {
    return (
      <section className="section" aria-label="Productos destacados">
        <div className="products-grid">
          <p className="muted">No hay productos disponibles.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section" aria-label="Productos destacados">
      {/* CAMBIO 1: Usamos la clase 'products-grid' del nuevo CSS */}
      <div className="products-grid">
        
        {products.map((p) => {
          const img = getImageSrc(p.images && p.images[0]);

          return (

            <Link 
              to={`/producto/${p.id}`} 
              key={p.id} 
              className="pg-card"
            >

              <img 
                src={img} 
                alt={p.name} 
                className="pg-card-img" 
                loading="lazy" 
              />
              
              <div className="pg-card-body">
                <span className="pg-category">{p.category}</span>
                <h3 className="pg-title">{p.name}</h3>
                
                <div className="pg-footer">
                  <span className="pg-price">{money(p.price)}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}