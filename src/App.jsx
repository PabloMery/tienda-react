import { BrowserRouter, Routes, Route, NavLink, Link } from "react-router-dom";
import { CartProvider, useCart } from "./context/CartContext";

import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Detalle from "./pages/Detalle";
import Carrito from "./pages/Carrito";
import Comentarios from "./pages/Comentarios";
import Blog from "./pages/Blog";

// Placeholders para que no fallen los links (crea tus páginas reales luego)
function Nosotros(){ return <main className="wrap"><h1>Nosotros</h1></main>; }
function Contacto(){ return <main className="wrap"><h1>Contacto</h1></main>; }

// Componente para el botón de carrito con contexto
function CartButton() {
  const { totalItems = 0 } = useCart?.() || {};
  return (
    <Link className="cart" to="/carrito" aria-label="Carrito">
      🛒 Carrito <span className="cart__badge">{totalItems}</span>
    </Link>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        {/* Barra superior */}
        <nav className="top">
          <div className="wrap top__row">
            <span className="muted">Bienvenido(a)</span>
            <span className="spacer" />
            {/* Usa rutas internas si tienes páginas de auth en React */}
            <Link to="/login">Iniciar sesión</Link>
            <span className="top__sep">|</span>
            <Link to="/registro">Registrar usuario</Link>
          </div>
        </nav>

        {/* Header / Nav principal */}
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

            <div className="nav__actions">
              <CartButton />
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/producto/:id" element={<Detalle />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/comentarios" element={<Comentarios />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          {/* Auth (si luego las creas) */}
          {/* <Route path="/login" element={<Login/>} />
          <Route path="/registro" element={<Registro/>} /> */}
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
