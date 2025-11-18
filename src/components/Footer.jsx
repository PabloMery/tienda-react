import React, { useCallback } from 'react';
import { Link } from 'react-router-dom'; // Importamos Link para la navegación

// --- ACEPTAMOS LA PROP sessionUser ---
export default function Footer({ sessionUser }) { 

  const handleSubscribe = useCallback((e) => {
    e.preventDefault();
    alert('¡Gracias por suscribirte!');
  }, []);

  return (
    <footer>
      <div className="wrap foot">

        {sessionUser && sessionUser.id === 1 && (
          <div className="foot__row" style={{ 
            padding: '10px 0', 
            borderBottom: '1px solid #333' 
          }}>
            <Link to="/admin/agregar" style={{ 
              color: 'var(--color-primary, aqua)', 
              fontWeight: 'bold' 
            }}>
              + Crear Producto (Admin)
            </Link>
          </div>
        )}

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
            <input 
              id="email" 
              type="email" 
              placeholder="Ingresa tu correo" 
              required 
            />
            <button type="submit">Suscribirse</button>
          </form>
        </div>
      </div>
    </footer>
  );
}