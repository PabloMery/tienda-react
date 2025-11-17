import React, { useState, useEffect } from 'react'; // <-- 1. Importamos los hooks
import '../styles/estiloproductos.css';
// import { PRODUCTS } from '../data/products'; // <-- 2. ELIMINAMOS esta línea
import { getProductos } from '../services/api'; // <-- 3. Importamos nuestra API
import ProductCard from '../components/ProductCard';

export default function Productos() {
  
  // 4. Creamos estados para guardar los productos y saber si están cargando
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 5. useEffect se ejecuta 1 vez cuando el componente se monta
  useEffect(() => {
    // Definimos una función asíncrona para traer los datos
    const cargarProductos = async () => {
      const data = await getProductos(); // Llama a nuestra api.js
      setProductos(data); // Rellena el estado con los datos de la API
      setCargando(false); // Avisa que ya terminó de cargar
    };

    cargarProductos(); // Ejecutamos la función
  }, []); // El array vacío [] significa que se ejecuta solo una vez

  // 6. Mostramos un mensaje de carga
  if (cargando) {
    return (
      <main className="productos">
        <h1 className="title">Productos</h1>
        <p style={{ textAlign: 'center' }}>Cargando productos desde la API...</p>
      </main>
    );
  }

  // 7. Renderizamos los productos que llegaron de la API
  return (
    <main className="productos">
      <h1 className="title">Productos</h1>
      <section id="grid" className="grid">
        {productos.map(p => <ProductCard key={p.id} p={p} />)}
      </section>
    </main>
  );
}