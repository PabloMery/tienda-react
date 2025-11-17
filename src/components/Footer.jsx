import React, { useCallback } from 'react';
// No necesitamos 'api.js' ni 'useState' aquí

export default function Footer() {
  
  // Esta es la lógica original que tenías en Home.jsx
  const handleSubscribe = useCallback((e) => {
    e.preventDefault();
    alert('¡Gracias por suscribirte!');
  }, []);

  return (
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