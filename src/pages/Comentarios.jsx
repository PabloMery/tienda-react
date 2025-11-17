import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams, useLocation, useParams, useNavigate } from "react-router-dom";
// import { PRODUCTS } from "../data/products"; // <-- 1. ELIMINAMOS
import { getProductos } from "../services/api"; // <-- 2. IMPORTAMOS API
import "../styles/estilocomentarios.css";

const CMT_KEY = "comments_v1";

/* ===== Helpers de almacenamiento (no cambian) ===== */
function readComments() {
  try {
    return JSON.parse(localStorage.getItem(CMT_KEY)) ?? [];
  } catch {
    return [];
  }
}
function saveComments(arr) {
  try {
    localStorage.setItem(CMT_KEY, JSON.stringify(arr));
  } catch { "" }
}

/* ===== Usuario “registrado” (no cambia) ===== */
function getUser() {
  const nombre = localStorage.getItem("nombre");
  const correo = localStorage.getItem("correo");
  if (nombre && correo) return { nombre, correo };
  return null;
}

/* ===== UI auxiliar (no cambia) ===== */
function renderStars(n) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

/* ===== 3. MODIFICADO: Normalización de PID ===== */
// Ahora necesita la lista de productos para poder validar
function normalizePid(raw, list) {
  const n = Number(raw);
  // No podemos normalizar si la lista de la API aún no ha llegado
  if (list.length === 0) return null; 
  return Number.isInteger(n) && list.some((p) => p.id === n) ? n : null;
}

export default function Comentarios() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const params = useParams(); 

  /* ===== 4. Estados Modificados ===== */
  const [comments, setComments] = useState(readComments);
  
  // Estados para la carga de productos de la API
  const [productList, setProductList] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // El ID del producto se setea después de cargar la lista
  const [productId, setProductId] = useState(null); 
  
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");
  const [user, setUser] = useState(getUser());

  /* ===== 5. NUEVO: useEffect para cargar productos de la API ===== */
  useEffect(() => {
    const loadData = async () => {
      const products = await getProductos(); // Llamamos a la API
      setProductList(products); // Guardamos la lista

      // Una vez tenemos la lista, determinamos el ID inicial
      const pidFromState = location.state?.productId;
      const pidFromQS = searchParams.get("pid");
      const pidFromParam = params.id;

      // Validamos el ID contra la lista de productos real
      const initial =
        normalizePid(pidFromState, products) ??
        normalizePid(pidFromQS, products) ??
        normalizePid(pidFromParam, products) ??
        (products[0]?.id ?? null); // Default al primer producto de la API

      setProductId(initial);
      setCargando(false);
    };
    loadData();
    // Usamos dependencias mínimas para que solo se ejecute al cargar
  }, [location.state, params.id, searchParams]); 

  /* ===== Persistir comentarios (no cambia) ===== */
  useEffect(() => {
    saveComments(comments);
  }, [comments]);

  /* ===== Escuchar cambios de login (no cambia) ===== */
  useEffect(() => {
    const updateUser = () => setUser(getUser());
    window.addEventListener("storage", updateUser);
    return () => window.removeEventListener("storage", updateUser);
  }, []);

  /* ===== 6. Corregir URL (MODIFICADO para usar productList) ===== */
  useEffect(() => {
    // No hacer nada si aún estamos cargando o no hay ID
    if (cargando || productId === null) return;

    const valid = normalizePid(searchParams.get("pid"), productList);
    
    // Si la URL no tiene ?pid= o es inválido, lo corregimos
    if (valid === null || valid !== productId) {
      navigate(`/comentarios?pid=${productId}`, {
        replace: true,
        state: {
          productId,
          productName:
            productList.find((p) => p.id === productId)?.name ?? // <-- Usamos productList
            location.state?.productName,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, productList, navigate, searchParams, location.state, cargando]);

  /* ===== Lista filtrada (no cambia) ===== */
  const list = useMemo(
    () => comments.filter((c) => c.productId === Number(productId)),
    [comments, productId]
  );

  /* ===== Acciones (no cambian) ===== */
  function addComment() {
    if (!user) return alert("Debes estar registrado para comentar");
    if (!text.trim()) return;

    const id = comments.length ? Math.max(...comments.map((c) => c.id)) + 1 : 1;

    const newCmt = {
      id,
      productId: Number(productId),
      stars,
      text: text.trim(),
      createdAt: Date.now(),
      user,
    };

    setComments([...comments, newCmt]);
    setText("");
    setStars(5);
  }

  function deleteAll() {
    if (!confirm("¿Borrar todos los comentarios de este producto?")) return;
    setComments(comments.filter((c) => c.productId !== Number(productId)));
  }

  /* ===== 7. 'selected' usa useMemo y productList ===== */
  const selected = useMemo(() => {
     if (!productId) return null;
     return productList.find((p) => p.id === Number(productId));
  }, [productId, productList]);

  
  /* ===== 8. NUEVO: Estado de carga ===== */
  if (cargando) {
    return (
      <main className="cmt" id="cmt">
        <h1 className="cmt__title">Comentarios</h1>
        <p style={{ textAlign: 'center' }}>Cargando productos...</p>
      </main>
    );
  }

  /* ===== 9. Render (MODIFICADO el select y el texto 'empty') ===== */
  return (
    <main className="cmt" id="cmt">
      <h1 className="cmt__title">Comentarios</h1>

      {/* Toolbar: selector + estrellas */}
      <div className="cmt__toolbar">
        <label htmlFor="productSelect">Producto:</label>
        <select
          id="productSelect"
          value={productId ?? ''} // Manejamos el estado inicial null
          onChange={(e) => {
            const next = Number(e.target.value);
            setProductId(next);

            // Sincroniza URL y conserva state
            navigate(`/comentarios?pid=${next}`, {
              replace: true,
              state: {
                productId: next,
                productName:
                  productList.find((p) => p.id === next)?.name ?? // <-- Usamos productList
                  location.state?.productName,
              },
            });
          }}
        >
          {/* Mapeamos productList en lugar de PRODUCTS */}
          {productList.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <div className="cmt__stars">
          <span>{renderStars(stars)}</span>
          <input
            type="range"
            min="1"
            max="5"
            value={stars}
            onChange={(e) => setStars(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Formulario si hay usuario (no cambia) */}
      {user ? (
        <div className="cmt__form">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Escribe tu comentario como ${user.nombre}...`}
          />
          <button onClick={addComment}>Agregar</button>
          <button className="danger" onClick={deleteAll}>
            Borrar todos
          </button>
        </div>
      ) : (
        <div className="cmt__login-warning">
          <p>⚠️ Debes estar <strong>registrado</strong> para dejar comentarios.</p>
          <Link className="btn" to="/registro">Ir al registro</Link>
        </div>
      )}

      {/* Lista de comentarios (no cambia) */}
      <ul className="cmt__list">
        {list.length === 0 ? (
          <p className="cmt__empty">
            {/* Usamos el 'selected' basado en la API */}
            Aún no hay comentarios para <strong>{selected?.name}</strong>.
          </p>
        ) : (
          list.map((c) => (
            <li key={c.id} className="cmt__item">
              <div className="cmt__meta">
                <span className="cmt__stars">{renderStars(c.stars)}</span>
                <span className="cmt__user"> — {c.user?.nombre || "Anónimo"}</span>
                <span className="cmt__date">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="cmt__text">{c.text}</p>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}