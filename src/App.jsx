import { BrowserRouter, Routes, Route, NavLink, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { CartProvider, useCart } from "./context/CartContext";

import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Detalle from "./pages/Detalle";
import Carrito from "./pages/Carrito";
import Comentarios from "./pages/Comentarios";
import Blog from "./pages/Blog";
import Contacto from "./pages/Contacto";
import Registro from "./pages/Registro";
import InicioSesion from "./pages/InicioSesion";
import BlogDetalle1 from "./pages/BlogDetalle1";
import BlogDetalle2 from "./pages/BlogDetalle2";
import Nosotros from "./pages/Nosotros";

const SESSION_KEY = "session_user";
function getSessionUser() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

function CartButton() {
  const { totalItems = 0, totals } = useCart();
  const count = Number.isFinite(totalItems)
    ? totalItems
    : totals?.detailed?.reduce((a, i) => a + (Number(i.qty) || 0), 0) ?? 0;

  return (
    <Link to="/carrito" aria-label="Carrito">
      🛒 Carrito <span className="cart__badge">{count}</span>
    </Link>
  );
}

function AppLayout() {
  const [sessionUser, setSessionUser] = useState(getSessionUser());

  useEffect(() => {
    const refresh = () => setSessionUser(getSessionUser());

    // Cambios desde otras pestañas
    const onStorage = (e) => {
      if (e.key === SESSION_KEY) refresh();
    };
    window.addEventListener("storage", onStorage);

    // Cambios en esta misma pestaña (emitidos por InicioSesion.jsx)
    window.addEventListener("session-updated", refresh);

    // Sync inicial
    refresh();

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("session-updated", refresh);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setSessionUser(null);
  };

  return (
    <div className="App">{/* 👈 IMPORTANTE: .App (mayúscula) para tus estilos */}
      {/* ==== HEADER / TOPBAR ==== */}
      <div className="topbar">
        <div className="topbar-left">
          <span className="welcome">
            {sessionUser?.nombre
              ? `Bienvenido, ${sessionUser.nombre}`
              : "Bienvenido(a)"}
          </span>
        </div>

        <div className="brand">
          <NavLink to="/" className="brand-link">
            <span className="dot" /> TANGANA
          </NavLink>
        </div>

        <div className="topbar-right">
          {!sessionUser ? (
            <>
              <Link to="/login">Iniciar sesión</Link>
              <span className="sep"> | </span>
              <Link to="/registro">Registrar usuario</Link>
            </>
          ) : (
            <button
              className="btn-link"
              onClick={handleLogout}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              Cerrar sesión
            </button>
          )}
          <span style={{ marginLeft: 12 }}>
            <CartButton />
          </span>
        </div>
      </div>

      {/* ==== NAV ==== */}
      <nav className="mainnav">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/productos">Productos</NavLink>
        <NavLink to="/nosotros">Nosotros</NavLink>
        <NavLink to="/blog">Blog</NavLink>
        <NavLink to="/contacto">Contacto</NavLink>
      </nav>

      {/* ==== CONTENIDO ==== */}
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:id" element={<Detalle />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/comentarios" element={<Comentarios />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/detalle-1" element={<BlogDetalle1 />} />
          <Route path="/blog/detalle-2" element={<BlogDetalle2 />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<InicioSesion />} />
          {/* fallback opcional */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </CartProvider>
  );
}
