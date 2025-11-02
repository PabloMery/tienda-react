import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams, useLocation, useParams, useNavigate } from "react-router-dom";
import { PRODUCTS } from "../data/products";
import "../styles/estilocomentarios.css";

const CMT_KEY = "comments_v1";

/* ===== Helpers de almacenamiento ===== */
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

/* ===== Usuario “registrado” (localStorage) ===== */
function getUser() {
  const nombre = localStorage.getItem("nombre");
  const correo = localStorage.getItem("correo");
  if (nombre && correo) return { nombre, correo };
  return null;
}

/* ===== UI auxiliar ===== */
function renderStars(n) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

/* ===== Normalización de PID ===== */
function normalizePid(raw) {
  const n = Number(raw);
  return Number.isInteger(n) && PRODUCTS.some((p) => p.id === n) ? n : null;
}

export default function Comentarios() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const params = useParams(); // por si usas /comentarios/:id

  // Fuentes de productId (prioridad: state → query → param → fallback)
  const pidFromState = location.state?.productId;
  const pidFromQS = searchParams.get("pid");
  const pidFromParam = params.id;

  const initialPid =
    normalizePid(pidFromState) ??
    normalizePid(pidFromQS) ??
    normalizePid(pidFromParam) ??
    (PRODUCTS[0]?.id ?? 1);

  /* ===== Estados ===== */
  const [comments, setComments] = useState(readComments);
  const [productId, setProductId] = useState(initialPid);
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");
  const [user, setUser] = useState(getUser());

  /* ===== Persistir comentarios ===== */
  useEffect(() => {
    saveComments(comments);
  }, [comments]);

  /* ===== Escuchar cambios de login/registro en otras pestañas ===== */
  useEffect(() => {
    const updateUser = () => setUser(getUser());
    window.addEventListener("storage", updateUser);
    return () => window.removeEventListener("storage", updateUser);
  }, []);

  /* ===== Corregir URL si pid es inválido o no coincide con el estado ===== */
  useEffect(() => {
    const valid = normalizePid(searchParams.get("pid"));
    if (valid === null || valid !== productId) {
      navigate(`/comentarios?pid=${productId}`, {
        replace: true,
        state: {
          productId,
          productName:
            PRODUCTS.find((p) => p.id === productId)?.name ??
            location.state?.productName,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  /* ===== Lista filtrada por producto ===== */
  const list = useMemo(
    () => comments.filter((c) => c.productId === Number(productId)),
    [comments, productId]
  );

  /* ===== Acciones ===== */
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

  const selected = PRODUCTS.find((p) => p.id === Number(productId));

  /* ===== Render ===== */
  return (
    <main className="cmt" id="cmt">
      <h1 className="cmt__title">Comentarios</h1>

      {/* Toolbar: selector + estrellas */}
      <div className="cmt__toolbar">
        <label htmlFor="productSelect">Producto:</label>
        <select
          id="productSelect"
          value={productId}
          onChange={(e) => {
            const next = Number(e.target.value);
            setProductId(next);

            // Sincroniza URL y conserva state
            navigate(`/comentarios?pid=${next}`, {
              replace: true,
              state: {
                productId: next,
                productName:
                  PRODUCTS.find((p) => p.id === next)?.name ??
                  location.state?.productName,
              },
            });
          }}
        >
          {PRODUCTS.map((p) => (
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

      {/* Formulario si hay usuario */}
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

      {/* Lista de comentarios */}
      <ul className="cmt__list">
        {list.length === 0 ? (
          <p className="cmt__empty">
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
