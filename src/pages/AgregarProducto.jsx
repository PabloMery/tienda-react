import React, { useState } from 'react';
import { createProducto } from '../services/api'; // Importamos nuestra función
import '../styles/Registro.css'; // Reutilizamos los estilos del registro

export default function AgregarProducto() {
  // Estados para cada campo del formulario
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [images, setImages] = useState(''); // Lo manejaremos como un string separado por comas

  // Estados para manejar la respuesta de la API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // 1. Convertimos los datos al formato que espera la API
    const parsedPrice = parseInt(price, 10);
    const parsedStock = parseInt(stock, 10);
    
    // Convertimos el string "img1.jpg, img2.jpg" en un array ["img1.jpg", "img2.jpg"]
    const parsedImages = images.split(',').map(img => img.trim());

    const productoData = {
      name,
      price: parsedPrice,
      category,
      stock: parsedStock,
      images: parsedImages,
    };

    // 2. Llamamos a la API
    const result = await createProducto(productoData);

    setLoading(false);

    if (result.success) {
      setSuccess(`¡Producto "${result.data.name}" creado con éxito!`);
      // Limpiamos el formulario
      setName('');
      setPrice('');
      setCategory('');
      setStock('');
      setImages('');
    } else {
      // Mostramos el error de validación (ej: "El precio no puede ser negativo")
      setError(result.error);
    }
  };

  return (
    <main className="wrap auth">
      <h1 className="title">Agregar Nuevo Producto</h1>
      <p>Completa el formulario para agregar un ítem a la tienda.</p>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-field">
          <label htmlFor="name">Nombre del Producto</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="price">Precio (CLP)</label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="category">Categoría</label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ej: BMX, Patinetas, Patines"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="stock">Stock Inicial</label>
          <input
            id="stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="images">Imágenes (URLs)</label>
          <input
            id="images"
            type="text"
            value={images}
            onChange={(e) => setImages(e.target.value)}
            placeholder="Ej: /IMG/BMX/img1.jpg, /IMG/BMX/img2.jpg"
            required
          />
          <small>Rutas separadas por coma (,)</small>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Producto'}
        </button>

        {/* Mensajes de feedback */}
        {success && <p className="auth-success">{success}</p>}
        {error && <p className="auth-error">{error}</p>}
      </form>
    </main>
  );
}