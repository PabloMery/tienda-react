import React, { useState, useEffect } from 'react'; // <-- Importamos hooks
import '../styles/estiloproductos.css';
import ProductCard from '../components/ProductCard';
import { getProductos } from '../services/api'; // <-- Importamos la API

export default function Productos() {
  // Estado para guardar los productos que vienen de la API
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // useEffect se ejecuta cuando el componente se monta
  useEffect(() => {
    const cargarProductos = async () => {
      const data = await getProductos();
      setProductos(data);
      setCargando(false);
    };

    cargarProductos();
  }, []); // El [] asegura que solo se ejecute una vez

  // Mensaje de carga mientras esperamos la API
  if (cargando) {
    return (
      <main className="productos">
        <h1 className="title">Productos</h1>
        <p style={{ textAlign: 'center' }}>Cargando productos...</p>
      </main>
    );
  }

  return (
    <main className="productos">
      <h1 className="title">Productos</h1>
      <section id="grid" className="grid">
        {/* Renderizamos los productos que están en el estado */}
        {productos.map(p => <ProductCard key={p.id} p={p} />)}
      </section>
    </main>
  );
}