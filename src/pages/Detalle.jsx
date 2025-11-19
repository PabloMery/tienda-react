import React, { useMemo, useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
// 1. Importamos deleteProducto
import { getProductoById, getProductos, deleteProducto } from '../services/api';
import { useCart } from "../context/CartContext";
import { money } from "../utils/money";
import "../styles/estilodetalleProductos.css";

export default function Detalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();

  const [p, setProducto] = useState(null);
  const [related, setRelated] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [activeIdx, setActiveIdx] = useState(0);
  const [qty, setQty] = useState(1);

  // 2. LEEMOS EL USUARIO PARA SABER SI ES ADMIN
  const sessionUser = JSON.parse(localStorage.getItem("session_user"));
  const isAdmin = sessionUser && sessionUser.id === 1;

  const getImageSrc = (imgUrl) => {
    if (!imgUrl) return '/IMG/placeholder.jpg';
    if (imgUrl.startsWith('/api')) {
      return `http://localhost:8080${imgUrl}`;
    }
    return imgUrl;
  };

  useEffect(() => {
    let isMounted = true;
    const cargarDatos = async () => {
      setProducto(null);
      setRelated([]);
      setCargando(true);
      
      try {
        const producto = await getProductoById(id);
        
        if (isMounted) {
          setProducto(producto);
          setActiveIdx(0);

          if (producto) {
            const todos = await getProductos();
            const currentId = Number(producto.id);
            const relacionados = todos
              .filter(x => x.category === producto.category && Number(x.id) !== currentId)
              .slice(0, 4);
            setRelated(relacionados);
          }
        }
      } catch (error) {
        console.error("Error cargando detalle:", error);
      } finally {
        if (isMounted) setCargando(false);
      }
    };
    cargarDatos();
    return () => { isMounted = false; };
  }, [id]);

  const images = useMemo(() => {
    if (!p) return ["/IMG/placeholder.jpg"];
    return (p.images && p.images.length > 0) ? p.images : ["/IMG/placeholder.jpg"];
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

  // 3. NUEVA FUNCIÓN PARA ELIMINAR
  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de que quieres eliminar "${p.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    const result = await deleteProducto(p.id);
    if (result.success) {
      alert("Producto eliminado correctamente.");
      navigate('/productos'); 
    } else {
      alert("Error al eliminar: " + result.error);
    }
  };

  if (cargando || !p) {
    return (
      <main className="wrap" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '1.2rem', color: '#888' }}>Cargando producto...</p>
      </main>
    );
  }

  return (
    <main className="wrap">
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
                  key={images[activeIdx]}
                  src={getImageSrc(images[activeIdx])}
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
                    <img src={getImageSrc(src)} alt={`miniatura ${i + 1}`} loading="lazy" />
                  </button>
                ))}
              </div>
            </div>

            <div className="panel right">
              {/* --- ZONA DE ADMINISTRACIÓN (Sólo visible para Admin) --- */}
              {isAdmin && (
                <div style={{ 
                  marginBottom: '1.5rem', 
                  padding: '1rem', 
                  border: '1px dashed #444', 
                  borderRadius: '8px',
                  backgroundColor: '#222' 
                }}>
                  <strong style={{ color: '#888', display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                    PANEL DE ADMINISTRADOR
                  </strong>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {/* Botón Editar (Redirige a una ruta futura) */}
                    <button 
                      onClick={() => navigate(`/admin/editar/${p.id}`)}
                      style={{ 
                        padding: '8px 16px', 
                        background: '#00ffff', 
                        color: '#000', 
                        border: 'none', 
                        borderRadius: '4px', 
                        fontWeight: 'bold', 
                        cursor: 'pointer' 
                      }}
                    >
                      ✏️ Editar
                    </button>

                    <button 
                      onClick={handleDelete}
                      style={{ 
                        padding: '8px 16px', 
                        background: '#ff4444', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '4px', 
                        fontWeight: 'bold', 
                        cursor: 'pointer' 
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              )}

              <div className="p-title">
                <h1 id="p-title">{p.name}</h1>
                <div className="price" id="p-price">{money(p.price)}</div>
              </div>

              <p id="p-desc" className="muted">
                {p.description || "Descripción no disponible para este producto."}
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
              {/* ... (Tu sección de relacionados sigue igual) ... */}
              <h2>Productos Relacionados</h2>
              <div id="related" className="rel__list">
                {related.map(r => (
                  <Link key={r.id} to={`/producto/${r.id}`} className="rel__item">
                    <article>
                      <div className="rel__img">
                        <img
                          src={getImageSrc((r.images && r.images[0]))}
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
    </main>
  );
}