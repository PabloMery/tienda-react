import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Productos from './pages/Productos';
import Detalle from './pages/Detalle';
import Carrito from './pages/Carrito';
import Comentarios from './pages/Comentarios';


export default function App(){
return (
<BrowserRouter>
<CartProvider>
<header className="nav">
<Link to="/">Home</Link>
<Link to="/productos">Productos</Link>
<Link to="/carrito">Carrito</Link>
<Link to="/comentarios">Comentarios</Link>
</header>
<Routes>
<Route path="/" element={<Home/>} />
<Route path="/productos" element={<Productos/>} />
<Route path="/producto/:id" element={<Detalle/>} />
<Route path="/carrito" element={<Carrito/>} />
<Route path="/comentarios" element={<Comentarios/>} />
</Routes>
</CartProvider>
</BrowserRouter>
);
}