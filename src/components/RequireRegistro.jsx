import { Navigate, useLocation } from "react-router-dom";
import { useRegistro } from "../context/RegistroContext";

export default function RequireRegistro({ children }) {
  const { isRegistered } = useRegistro();  // 👈 leemos del contexto si la persona ya se registró
  const location = useLocation();

  // Si NO está registrado, lo redirige al formulario de registro
  if (!isRegistered) {
    return <Navigate to="/registro" state={{ from: location }} replace />;
  }

  // Si está registrado, muestra el contenido normal (children)
  return children;
}
