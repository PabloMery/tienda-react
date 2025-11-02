import { useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { PRODUCTS } from "../data/products";
import { useCart } from "../context/CartContext";
import { money } from "../utils/money";
import "../styles/estilodetalleProductos.css";

export default function Detalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();

  const [activeIdx, setActiveIdx] = useState(0);
  const [qty, setQty] = useState(1);

  const p = useMemo(() => PRODUCTS.find(x => x.id === Number(id)), [id]);

  const images = useMemo(() => {
    if (!p) return ["/IMG/placeholder.jpg"];
    return (p.images && p.images.length > 0) ? p.images : ["/IMG/placeholder.jpg"];
  }, [p]);

  const related = useMemo(() => {
    if (!p) return [];
    return PRODUCTS
      .filter(x => x.category === p.category && x.id !== p.id)
      .slice(0, 4);
  }, [p]);

  const onChangeQty = (e) => {
    const v = Number(e.target.value);
    if (Number.isNaN(v)) return;
    setQty(Math.max(1, Math.min(10, v)));
  };

  const addToCart = () => {
    if (!p) return;
    add(p.id, qty);
  };

  const handleComentarios = () => {
    navigate(`/comentarios?pid=${id}`, {
      state: {
        productId: Number(id),
        productName: p?.name
      }
    });
  };


  return (
    <main className="wrap">
      {!p ? (
        <p>Producto no encontrado.</p>
      ) : (
        <>
          <nav className="breadcrumb">
            <Link to="/">Home</Link> <span> › </span>
            <Link to="/productos">{p.category}</Link> <span> › </span>
            <span>{p.name}</span>
          </nav>

          <section className="product">
            <div className="panel left">
              <div id="p-main" className="p-main">
                <img
                  src={images[activeIdx]}
                  alt={`${p.name} ${activeIdx + 1}`}
                  loading="lazy"
                />
              </div>

              <div id="p-thumbs" className="thumbs">
                {images.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`thumb ${i === activeIdx ? "is-active" : ""}`}
                    onClick={() => setActiveIdx(i)}
                    aria-label={`Ver imagen ${i + 1}`}
                  >
                    <img src={src} alt={`${p.name} miniatura ${i + 1}`} loading="lazy" />
                  </button>
                ))}
              </div>
            </div>

            <div className="panel right">
              <div className="p-title">
                <h1 id="p-title">{p.name}</h1>
                <div className="price" id="p-price">{money(p.price)}</div>
              </div>

              <p id="p-desc" className="muted">
                {p.description || "Descripción no disponible."}
              </p>

              <div className="qty">
                <label htmlFor="qty">Cantidad</label>
                <input
                  id="qty"
                  type="number"
                  min="1"
                  max="10"
                  value={qty}
                  onChange={onChangeQty}
                  inputMode="numeric"
                />
              </div>
              <div id ="p-actions" className="p-actions">
                <button id="add-btn2" className="btn2" type="button" onClick={addToCart}>
                  Añadir al carrito
                </button>

                <button id="btn-comentarios" className="button-comments" type="button" onClick={handleComentarios}>
                  Comentarios del Producto
                </button>
              </div>
            </div>
          </section>

          {related.length > 0 && (
            <section className="related">
              <h2>Productos Relacionados</h2>
              <div id="related" className="rel__list">
                {related.map(r => (
                  <Link key={r.id} to={`/producto/${r.id}`} className="rel__item">
                    <article>
                      <div className="rel__img">
                        <img
                          src={(r.images && r.images[0]) || "/IMG/placeholder.jpg"}
                          alt={r.name}
                          loading="lazy"
                        />
                      </div>
                      <h3 className="rel__name">{r.name}</h3>
                      <div className="rel__price">{money(r.price)}</div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
