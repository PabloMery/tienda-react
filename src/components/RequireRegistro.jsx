import { Navigate, useLocation } from "react-router-dom";
import { useRegistro } from "../context/RegistroContext";

export default function RequireRegistro({ children }) {
  const { isRegistered } = useRegistro(); 
  const location = useLocation();

  if (!isRegistered) {
    return <Navigate to="/registro" state={{ from: location }} replace />;
  }

  return children;
}
