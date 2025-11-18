// App.jsx
import { BrowserRouter, Routes, Route, NavLink, Link, Outlet } from "react-router-dom"; // Asegúrate de importar Outlet
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
import PagoExitoso from "./pages/PagoExitoso"
import AgregarProducto from "./pages/AgregarProducto";
import Footer from "./components/Footer";

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

function Shell() {
  const [sessionUser, setSessionUser] = useState(getSessionUser());

  useEffect(() => {
    const refresh = () => setSessionUser(getSessionUser());

    const onStorage = (e) => {
      if (e.key === SESSION_KEY) refresh();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("session-updated", refresh);
    refresh();

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("session-updated", refresh);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    // Disparamos el evento para que el estado se actualice en tiempo real
    window.dispatchEvent(new Event("session-updated")); 
  };

  return (
    <>
    <div className="app-layout-wrapper">
      <nav className="top">
        <div className="wrap top__row">
          <span className="muted">
            {sessionUser?.nombre ? `Bienvenido, ${sessionUser.nombre}` : "Bienvenido(a)"}
          </span>
          <span className="spacer" />
          {!sessionUser ? (
            <>
              <Link to="/login">Iniciar sesión</Link>
              <span className="top__sep">|</span>
              <Link to="/registro">Registrar usuario</Link>
            </>
          ) : (
            <button
              className="btn-link"
              onClick={handleLogout}
              style={{ background: "none", border: "none", cursor: "pointer", color: "white" }}
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </nav>

      <header>
        <div className="wrap nav">
          <Link className="brand" to="/">
            <span className="brand__dot" />
            <span>TANGANA</span>
          </Link>

          <nav className="nav__links" aria-label="Principal">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/productos">Productos</NavLink>
            <NavLink to="/nosotros">Nosotros</NavLink>
            <NavLink to="/blog">Blog</NavLink>
            <NavLink to="/contacto">Contacto</NavLink>

            
          </nav>

          <div className="nav__links">
            <CartButton />
          </div>
        </div>
      </header>
      <Outlet />
      <Footer sessionUser={sessionUser} />
    </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>

        <Routes>
          <Route path="/" element={<Shell />}>
            <Route index element={<Home />} />
            <Route path="productos" element={<Productos />} />
            <Route path="producto/:id" element={<Detalle />} />
            <Route path="carrito" element={<Carrito />} />
            <Route path="comentarios" element={<Comentarios />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/detalle/1" element={<BlogDetalle1 />} />
            <Route path="blog/detalle/2" element={<BlogDetalle2 />} />
            <Route path="contacto" element={<Contacto />} />
            <Route path="nosotros" element={<Nosotros />} />
            <Route path="registro" element={<Registro />} />
            <Route path="login" element={<InicioSesion />} />
            <Route path="pago-exitoso" element={<PagoExitoso />} />
            
            {/* La ruta de admin también queda anidada bajo el Shell */}
            <Route path="admin/agregar" element={<AgregarProducto />} />
            
            {/* Ruta para 404 */}
            <Route path="*" element={<main className="wrap"><p>404: Ruta no encontrada</p></main>} />
          </Route>
        </Routes>


      </CartProvider>
    </BrowserRouter>
    
  );
  
}
