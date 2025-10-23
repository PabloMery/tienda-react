import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
 
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Productos from './pages/Productos';
import Detalle from './pages/Detalle';
import Carrito from './pages/Carrito';
import Comentarios from './pages/Comentarios';
import Blog  from './pages/Blog';


export default function App(){
return (
<BrowserRouter>
<CartProvider>

      <nav className="top">
        <div className="wrap top__row">
          <span className="muted">Bienvenido(a)</span>
          <span className="spacer"></span>
          <a href="inicioSesion.html">Iniciar sesión</a>
          <span className="top__sep">|</span>
          <a href="registro_index.html">Registrar usuario</a>
        </div>
      </nav>

      {/* NAV principal */}
      <header>
        <div className="wrap nav">
          <Link className="brand" to="/">
            <span className="brand__dot"></span>
            <span>TANGANA</span>
          </Link>
          <nav className="nav__links" aria-label="Principal">
            <Link to="/">Home</Link>
            <Link to="/productos">Productos</Link>
            <Link to="/nosotros">Nosotros</Link>
            <Link to="/blog" >Blog</Link>
            <Link to="/contacto">Contacto</Link>
          </nav>
          <div className="nav__actions">
            <Link className="cart" to="/carrito" aria-label="Carrito">
              🛒Carrito <span className="cart__badge" id="cart-count">0</span>
            </Link>
          </div>
        </div>
      </header>
<Routes>
<Route path="/" element={<Home/>} />
<Route path="/productos" element={<Productos/>} />
<Route path="/producto/:id" element={<Detalle/>} />
<Route path="/carrito" element={<Carrito/>} />
<Route path="/comentarios" element={<Comentarios/>} />
<Route path="/blog" element={<Blog/>}/>
</Routes>
</CartProvider>
</BrowserRouter>
);
}