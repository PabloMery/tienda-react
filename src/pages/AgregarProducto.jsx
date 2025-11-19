import React, { useState } from 'react';
import { createProductosBatch, uploadImage } from '../services/api';
import '../styles/AgregarProducto.css';

export default function AgregarProducto() {
  const [items, setItems] = useState([
    { name: '', price: '', category: '', stock: '', images: '' }
  ]);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // --- Helpers ---
  
  // Función para resolver la URL correcta (Backend vs Frontend) para la vista previa
  const getPreviewUrl = (url) => {
    if (!url) return '';
    return url.startsWith('/api') ? `http://localhost:8080${url}` : url;
  };

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

  // --- NUEVO: BORRAR UNA SOLA IMAGEN ---
  const handleRemoveSingleImage = (rowIndex, imgIndex) => {
    const newItems = [...items];
    // 1. Convertimos el string en array
    const currentImages = newItems[rowIndex].images.split(',').filter(Boolean);
    
    // 2. Eliminamos la imagen específica
    currentImages.splice(imgIndex, 1);
    
    // 3. Guardamos de nuevo como string
    newItems[rowIndex].images = currentImages.join(',');
    setItems(newItems);
  };

  // --- LÓGICA DE SUBIDA ---
  
  const handleImageUpload = async (index, e) => {
    const files = e.target.files; 
    if (!files || files.length === 0) return;

    const originalValue = items[index].images;
    handleChange(index, 'images', 'Subiendo...'); // Feedback

    try {
      const uploadedUrls = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImage(files[i]);
        if (url) uploadedUrls.push(url);
      }

      if (uploadedUrls.length > 0) {
        const newUrlsString = uploadedUrls.join(',');
        
        // Limpiamos el texto de carga
        const currentValueClean = originalValue === 'Subiendo...' ? '' : originalValue;
        
        // Concatenamos (Agregamos a lo que ya existe)
        const finalValue = currentValueClean 
          ? `${currentValueClean},${newUrlsString}` 
          : newUrlsString;
        
        handleChange(index, 'images', finalValue);
      } else {
        // Restauramos si falló
        handleChange(index, 'images', originalValue === 'Subiendo...' ? '' : originalValue);
      }
    } catch (error) {
      console.error(error);
      handleChange(index, 'images', originalValue === 'Subiendo...' ? '' : originalValue);
    }
    
    // Limpiamos el input para permitir subir el mismo archivo de nuevo si se desea
    e.target.value = ''; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const productosParaEnviar = items.map(item => ({
      name: item.name,
      price: parseInt(item.price) || 0,
      stock: parseInt(item.stock) || 0,
      category: item.category,
      images: item.images.split(',').map(img => img.trim()).filter(Boolean)
    }));

    const result = await createProductosBatch(productosParaEnviar);
    setLoading(false);

    if (result.success) {
      setMsg({ type: 'success', text: `¡Éxito! ${result.data.length} productos creados.` });
      setItems([{ name: '', price: '', category: '', stock: '', images: '' }]);
    } else {
      setMsg({ type: 'error', text: `Error: ${result.error}` });
    }
  };

  return (
    <main className="admin-container">
      <h1 className="admin-title">Administración de Productos</h1>
      
      <form onSubmit={handleSubmit}>
        {items.map((item, index) => (
          <div key={index} className="admin-card">
            {items.length > 1 && (
              <button type="button" className="remove-btn" onClick={() => removeRow(index)}>X</button>
            )}
            
            <div className="admin-row">
              <div className="form-field">
                <label>Nombre</label>
                <input 
                  value={item.name} 
                  onChange={e => handleChange(index, 'name', e.target.value)} 
                  required 
                  placeholder="Ej: Bicicleta BMX Pro"
                />
              </div>
              <div className="form-field">
                <label>Precio</label>
                <input 
                  type="number2" 
                  value={item.price} 
                  onChange={e => handleChange(index, 'price', e.target.value)} 
                  required 
                  placeholder="99990"
                />
              </div>
              <div className="form-field">
                <label>Categoría</label>
                <input 
                  value={item.category} 
                  onChange={e => handleChange(index, 'category', e.target.value)} 
                  required 
                  placeholder="BMX"
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
                  required 
                  placeholder="10"
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
                    readOnly // Opcional: Hazlo readOnly si prefieres que solo usen botones
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

                {item.images && (
                  <div className="preview-list">
                    {item.images.split(',').filter(Boolean).map((url, imgIdx) => (
                      <div key={imgIdx} className="preview-item">
                        <img src={getPreviewUrl(url.trim())} alt="preview" />
                        <button 
                          type="button" 
                          className="preview-remove"
                          onClick={() => handleRemoveSingleImage(index, imgIdx)}
                          title="Quitar imagen"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* ----------------------------------- */}

              </div>
            </div>
          </div>
        ))}

        <button type="button" className="add-row-btn" onClick={addNewRow}>
          + Agregar otro producto
        </button>

        <div className="submit-area">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Todos'}
          </button>
        </div>

        {msg && <div className={`feedback-msg ${msg.type}`}>{msg.text}</div>}
      </form>
    </main>
  );
}
