import React from 'react';
import '../styles/grid2.css';
import { money } from '../utils/money';

export default function ProductGrid({ products = [] }) {

  if (!products || products.length === 0) {
    return (
      <section className="section" id="productos" aria-labelledby="titulo-prods">
        <h2 className="visually-hidden" id="titulo-prods">Productos destacados</h2>
        <div id="grid2" className="grid" role="list">
          <p className="muted">No hay productos disponibles.</p>
        </div>
      </section>
    );
  }

  // Si hay productos
  return (
    <section className="section" id="productos" aria-labelledby="titulo-prods">
      <h2 className="visually-hidden" id="titulo-prods">Productos destacados</h2>

      <div id="grid2" className="grid" role="list">
        {products.map((p, i) => {
          const img =
            p.images && p.images[0] ? p.images[0] : '../IMG/placeholder.jpg';

          return (
            <article
              key={p.id ?? i}
              className="card col-12 sm-col-6 lg-col-3"
              role="listitem"
            >
              <img src={img} alt={p.name} loading="lazy" />
              <div className="card__body">
                <div className="muted">{p.category}</div>
                <h3 style={{ margin: '.2rem 0 .3rem' }}>{p.name}</h3>
                <div className="card__row">
                  <span className="price">{money(p.price)}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}