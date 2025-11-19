import { useEffect, useState } from "react";
import { getUserProfile } from "../services/api"; 

export default function DatosCliente({
  fields = ["nombre", "correo", "region", "comuna", "telefono", "cart_v2"],
  title = "Datos guardados (Base de Datos)",
  className = "",
}) {
  const [datos, setDatos] = useState({
    nombre: "",
    correo: "",
    region: "",
    comuna: "",
    telefono: "",
    cart_v2: [],
  });
  const [status, setStatus] = useState("loading"); // 'loading', 'found', 'not_found', 'no_session'

  const safeParse = (str, fallback) => {
    try { return JSON.parse(str); } catch { return fallback; }
  };

  useEffect(() => {
    const fetchData = async () => {
      // 1. Recuperar sesión
      const sessionStr = localStorage.getItem("session_user");
      const cartLocal = safeParse(localStorage.getItem("cart_v2") || "[]", []);

      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        const email = session.email;

        // 2. Pedir datos a la BD
        const userFromDb = await getUserProfile(email);

        if (userFromDb) {
          setStatus("found");
          setDatos({
            nombre: userFromDb.nombre || "",
            correo: userFromDb.correo || "",
            region: userFromDb.region || "",
            comuna: userFromDb.comuna || "",
            telefono: userFromDb.telefono || "",
            cart_v2: cartLocal,
          });
        } else {
          setStatus("not_found");
          // Fallback: mostramos al menos el correo de la sesión
          setDatos(prev => ({ ...prev, correo: email, cart_v2: cartLocal }));
        }
      } else {
        setStatus("no_session");
        setDatos(prev => ({ ...prev, cart_v2: cartLocal }));
      }
    };

    fetchData();
  }, []);

  const Row = ({ label, value }) => (
    <li><strong>{label}:</strong> {value || <span style={{color: '#999', fontStyle: 'italic'}}>Sin datos</span>}</li>
  );

  return (
    <section className={className} style={{ marginTop: 24, padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>{title}</h2>

      {/* Mensajes de estado para depuración */}
      {status === "loading" && <p>🔄 Cargando datos desde el servidor...</p>}
      {status === "no_session" && <p>⚠️ No hay sesión activa.</p>}
      {status === "not_found" && (
        <div style={{backgroundColor: '#fff3cd', color: '#856404', padding: '10px', marginBottom: '10px', borderRadius: '4px'}}>
          ⚠️ Usuario no encontrado en la Base de Datos de Perfiles (Java).
          <br/><small>¿Te registraste antes de integrar el backend?</small>
        </div>
      )}

      {/* Lista de datos */}
      <ul>
        {fields.includes("nombre")   && <Row label="Nombre"  value={datos.nombre} />}
        {fields.includes("correo")   && <Row label="Correo"  value={datos.correo} />}
        {fields.includes("region")   && <Row label="Región"  value={datos.region} />}
        {fields.includes("comuna")   && <Row label="Comuna"  value={datos.comuna} />}
        {fields.includes("telefono") && <Row label="Teléfono" value={datos.telefono} />}
        {fields.includes("cart_v2")  && (
          <Row label="Ítems en carrito" value={(datos.cart_v2?.length ?? 0).toString()} />
        )}
      </ul>
    </section>
  );
}