import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PRODUCTS } from "../data/products";
import "../styles/estilocomentarios.css";

const CMT_KEY = "comments_v1";

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
  } catch {""}
}

function getUser() {
  const nombre = localStorage.getItem("nombre");
  const correo = localStorage.getItem("correo");
  if (nombre && correo) return { nombre, correo };
  return null;
}

function renderStars(n) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

export default function Comentarios() {
  const [comments, setComments] = useState(readComments);
  const [productId, setProductId] = useState(PRODUCTS[0]?.id || 1);
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    saveComments(comments);
  }, [comments]);

  useEffect(() => {
    const updateUser = () => setUser(getUser());
    window.addEventListener("storage", updateUser);
    return () => window.removeEventListener("storage", updateUser);
  }, []);

  const list = useMemo(
    () => comments.filter((c) => c.productId === Number(productId)),
    [comments, productId]
  );

  function addComment() {
    if (!user) return alert("Debes estar registrado para comentar");
    if (!text.trim()) return;

    const id = comments.length
      ? Math.max(...comments.map((c) => c.id)) + 1
      : 1;

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

  return (
    <main className="cmt" id="cmt">
      <h1 className="cmt__title">Comentarios</h1>

      <div className="cmt__toolbar">
        <label htmlFor="productSelect">Producto:</label>
        <select
          id="productSelect"
          value={productId}
          onChange={(e) => setProductId(Number(e.target.value))}
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

      {/* Formulario solo si hay usuario */}
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
          <p>
            ⚠️ Debes estar <strong>registrado</strong> para dejar comentarios.
          </p>
          <Link className="btn" to="/registro">
            Ir al registro
          </Link>
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
                <span className="cmt__user">
                  — {c.user?.nombre || "Anónimo"}
                </span>
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
