import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductoById, updateProducto, uploadImage } from '../services/api';
import '../styles/AgregarProducto.css'; // Reutilizamos estilos

export default function EditarProducto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    images: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  // --- Helper para visualizar imágenes (Front vs Back) ---
  const getPreviewUrl = (url) => {
    if (!url) return '';
    // Si viene del backend, agregamos el dominio. Si es local (/IMG), la dejamos igual.
    return url.startsWith('/api') ? `http://localhost:8080${url}` : url;
  };

  // 1. Cargar datos iniciales
  useEffect(() => {
    const cargarProducto = async () => {
      const producto = await getProductoById(id);
      
      if (producto) {
        setForm({
          name: producto.name,
          price: producto.price,
          category: producto.category,
          stock: producto.stock,
          // Unimos el array en un string para manejarlo en el input
          images: producto.images ? producto.images.join(',') : ''
        });
      } else {
        setMsg({ type: 'error', text: 'Producto no encontrado' });
      }
      setLoading(false);
    };
    
    cargarProducto();
  }, [id]);

  // Manejar cambios en inputs de texto
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // --- BORRAR UNA IMAGEN DE LA LISTA ---
  const handleRemoveImage = (indexToRemove) => {
    // 1. Convertimos string a array
    const currentImages = form.images.split(',').filter(Boolean);
    
    // 2. Quitamos la imagen seleccionada
    currentImages.splice(indexToRemove, 1);
    
    // 3. Guardamos de nuevo como string
    setForm({ ...form, images: currentImages.join(',') });
  };

  // --- SUBIR NUEVAS IMÁGENES (Múltiple) ---
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const originalValue = form.images;
    setForm({ ...form, images: 'Subiendo...' }); // Feedback

    try {
      const uploadedUrls = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImage(files[i]);
        if (url) uploadedUrls.push(url);
      }

      if (uploadedUrls.length > 0) {
        const newUrlsString = uploadedUrls.join(',');
        const cleanOriginal = originalValue === 'Subiendo...' ? '' : originalValue;
        
        // Agregamos las nuevas al final
        const finalValue = cleanOriginal 
          ? `${cleanOriginal},${newUrlsString}` 
          : newUrlsString;
          
        setForm({ ...form, images: finalValue });
      } else {
        // Restaurar si falla
        setForm({ ...form, images: originalValue === 'Subiendo...' ? '' : originalValue });
      }
    } catch (error) {
      console.error(error);
      setForm({ ...form, images: originalValue === 'Subiendo...' ? '' : originalValue });
    }
    e.target.value = ''; // Limpiar input
  };

  // 2. GUARDAR CAMBIOS
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);

    const productoActualizado = {
      name: form.name,
      price: parseInt(form.price) || 0,
      stock: parseInt(form.stock) || 0,
      category: form.category,
      // Convertimos string a array limpio
      images: form.images.split(',').map(img => img.trim()).filter(Boolean)
    };

    const result = await updateProducto(id, productoActualizado);

    setSubmitting(false);

    if (result.success) {
      setMsg({ type: 'success', text: '¡Producto actualizado!' });
      // Volver al detalle brevemente
      setTimeout(() => navigate(`/producto/${id}`), 1500);
    } else {
      setMsg({ type: 'error', text: `Error: ${result.error}` });
    }
  };

  if (loading) return <div className="admin-container" style={{textAlign:'center', color:'white'}}>Cargando...</div>;

  return (
    <main className="admin-container">
      <h1 className="admin-title">Editar Producto #{id}</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="admin-card">
          
          {/* Campos de Texto */}
          <div className="admin-row">
            <div className="form-field">
              <label>Nombre</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label>Precio</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label>Categoría</label>
              <input type="text" name="category" value={form.category} onChange={handleChange} required />
            </div>
          </div>

          {/* Stock e Imágenes */}
          <div className="admin-row wide">
            <div className="form-field">
              <label>Stock</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} required />
            </div>
            
            <div className="form-field">
              <label>Imágenes</label>
              <div className="image-input-group">
                <input 
                  type="text" 
                  name="images" 
                  value={form.images} 
                  onChange={handleChange} 
                  placeholder="URLs..." 
                />
                
                <label className="upload-label">
                  📷 Subir
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    style={{ display: 'none' }} 
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {/* --- GALERÍA VISUAL --- */}
              {form.images && (
                <div className="preview-list">
                  {form.images.split(',').filter(Boolean).map((url, idx) => (
                    <div key={idx} className="preview-item">
                      <img src={getPreviewUrl(url.trim())} alt="preview" />
                      <button 
                        type="button" 
                        className="preview-remove"
                        onClick={() => handleRemoveImage(idx)}
                        title="Borrar foto"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="submit-area">
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button 
            type="button" 
            className="submit-btn" 
            style={{ marginLeft: '10px', backgroundColor: '#444', color:'#ccc' }}
            onClick={() => navigate(`/producto/${id}`)}
          >
            Cancelar
          </button>
        </div>

        {msg && <div className={`feedback-msg ${msg.type}`}>{msg.text}</div>}
      </form>
    </main>
  );
}