import React, { useState } from 'react';
import { createProductosBatch, uploadImage } from '../services/api';
import '../styles/AgregarProducto.css';

export default function AgregarProducto() {
  const [items, setItems] = useState([
    { name: '', price: '', category: '', stock: '', images: '' }
  ]);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // --- LÓGICA DE LA TABLA ---
  
  const addNewRow = () => {
    setItems([...items, { name: '', price: '', category: '', stock: '', images: '' }]);
  };

  const removeRow = (index) => {
    if (items.length === 1) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // --- LÓGICA DE SUBIDA MÚLTIPLE (MODIFICADO) ---
  
  const handleImageUpload = async (index, e) => {
    const files = e.target.files; // Ahora obtenemos la lista completa
    if (!files || files.length === 0) return;

    // Guardamos el valor actual para no perderlo si hay error o para concatenar
    const originalValue = items[index].images;
    // Feedback visual mientras suben
    handleChange(index, 'images', 'Subiendo imágenes...');

    try {
      const uploadedUrls = [];

      // Recorremos todos los archivos seleccionados
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Subimos cada archivo individualmente
        const url = await uploadImage(file);
        if (url) {
          uploadedUrls.push(url);
        }
      }

      if (uploadedUrls.length > 0) {
        // Unimos las nuevas URLs con comas
        const newUrlsString = uploadedUrls.join(',');

        // Si ya había imágenes antes (y no era el texto de carga), las concatenamos
        // Limpiamos 'Subiendo...' antes de concatenar
        const currentValueClean = originalValue === 'Subiendo imágenes...' ? '' : originalValue;
        
        const finalValue = currentValueClean 
          ? `${currentValueClean},${newUrlsString}` 
          : newUrlsString;
        
        handleChange(index, 'images', finalValue);
      } else {
        alert("No se pudieron subir las imágenes.");
        handleChange(index, 'images', originalValue === 'Subiendo imágenes...' ? '' : originalValue);
      }

    } catch (error) {
      console.error("Error subiendo múltiples:", error);
      handleChange(index, 'images', originalValue === 'Subiendo imágenes...' ? '' : originalValue);
    }
  };

  // --- ENVÍO DEL FORMULARIO ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const productosParaEnviar = items.map(item => ({
      name: item.name,
      price: parseInt(item.price) || 0,
      stock: parseInt(item.stock) || 0,
      category: item.category,
      // Limpiamos espacios y comas extra
      images: item.images.split(',').map(img => img.trim()).filter(Boolean)
    }));

    const result = await createProductosBatch(productosParaEnviar);

    setLoading(false);

    if (result.success) {
      setMsg({ type: 'success', text: `¡Éxito! Se han creado ${result.data.length} productos.` });
      setItems([{ name: '', price: '', category: '', stock: '', images: '' }]);
    } else {
      setMsg({ type: 'error', text: `Error: ${result.error}` });
    }
  };

  return (
    <main className="admin-container">
      <h1 className="admin-title">Administración de Productos</h1>
      <p className="admin-subtitle">
        Carga unitaria o masiva. Sube fotos o usa URLs externas.
      </p>

      <form onSubmit={handleSubmit}>
        {items.map((item, index) => (
          <div key={index} className="admin-card">
            {items.length > 1 && (
              <button 
                type="button" 
                className="remove-btn" 
                onClick={() => removeRow(index)}
                title="Eliminar fila"
              >
                X
              </button>
            )}
            
            <div className="admin-row">
              <div className="form-field">
                <label>Nombre del Producto</label>
                <input 
                  type="text" 
                  value={item.name} 
                  onChange={e => handleChange(index, 'name', e.target.value)} 
                  placeholder="Ej: Bicicleta BMX Pro"
                  required 
                />
              </div>
              <div className="form-field">
                <label>Precio</label>
                <input 
                  type="number" 
                  value={item.price} 
                  onChange={e => handleChange(index, 'price', e.target.value)} 
                  placeholder="99990"
                  required 
                />
              </div>
              <div className="form-field">
                <label>Categoría</label>
                <input 
                  type="text" 
                  value={item.category} 
                  onChange={e => handleChange(index, 'category', e.target.value)} 
                  placeholder="BMX"
                  required 
                />
              </div>
            </div>

            <div className="admin-row wide">
              <div className="form-field">
                <label>Stock</label>
                <input 
                  type="number" 
                  value={item.stock} 
                  onChange={e => handleChange(index, 'stock', e.target.value)} 
                  placeholder="10"
                  required 
                />
              </div>
              
              <div className="form-field">
                <label>Imágenes</label>
                <div className="image-input-group">
                  <input 
                    type="text" 
                    value={item.images} 
                    onChange={e => handleChange(index, 'images', e.target.value)} 
                    placeholder="Las URLs aparecerán aquí..."
                    required 
                  />
                  
                  <label className="upload-label">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    Subir Fotos
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      style={{ display: 'none' }} 
                      onChange={(e) => handleImageUpload(index, e)}
                    />
                  </label>
                </div>
                <small>Para múltiples fotos, separa las URLs con comas.</small>
              </div>
            </div>
          </div>
        ))}

        <button type="button" className="add-row-btn" onClick={addNewRow}>
          + Agregar otra fila de producto
        </button>

        <div className="submit-area">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Todos'}
          </button>
        </div>

        {msg && (
          <div className={`feedback-msg ${msg.type}`}>
            {msg.text}
          </div>
        )}
      </form>
    </main>
  );
}