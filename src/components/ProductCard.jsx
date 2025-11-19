import { money } from '../utils/money';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import '../styles/estiloproductos.css';

export default function ProductCard({ p }) {
  const { add } = useCart();

  // Función inteligente para resolver la URL de la imagen
  const getImageSrc = (imgUrl) => {
    if (!imgUrl) return '/IMG/placeholder.jpg';
    
    // Si la URL guardada en la BD empieza con "/api", 
    // significa que es una imagen subida al Backend (puerto 8080)
    if (imgUrl.startsWith('/api')) {
      return `http://localhost:8080${imgUrl}`;
    }
    
    // Si no, asumimos que es una ruta estática del Frontend (public/IMG)
    return imgUrl;
  };

  // Obtenemos la primera imagen o el placeholder
  const img = getImageSrc(p.images && p.images[0]);

  return (
    <article className="card">
      <Link to={`/producto/${p.id}`} className="card__img">
        <img src={img} alt={p.name} loading="lazy" />
      </Link>
      <div className="card__body">
        <div className="muted">{p.category}</div>
        <h3 className="t">{p.name}</h3>
        <div className="row">
          <span className="price">{money(p.price)}</span>
          <button type="button" onClick={() => add(p.id, 1)}>
            Añadir
          </button>
        </div>
      </div>
    </article>
  );
}