import { useEffect, useState } from "react";

/**
 * Componente: DatosCliente
 * Lee valores de localStorage y los muestra.
 *
 * Props:
 * - fields?: string[]  -> qué campos mostrar (por defecto muestra todos)
 *    Posibles: "nombre","correo","region","comuna","telefono","cart_v2"
 * - title?: string     -> título a mostrar (default: "Datos guardados")
 * - className?: string -> estilos externos opcionales
 */
export default function DatosCliente({
  fields = ["nombre", "correo", "region", "comuna", "telefono", "cart_v2"],
  title = "Datos guardados",
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

  const safeParse = (str, fallback) => {
    try { return JSON.parse(str); } catch { return fallback; }
  };

  // Carga inicial
  useEffect(() => {
    setDatos({
      nombre: localStorage.getItem("nombre") || "",
      correo: localStorage.getItem("correo") || "",
      region: localStorage.getItem("region") || "",
      comuna: localStorage.getItem("comuna") || "",
      telefono: localStorage.getItem("telefono") || "",
      cart_v2: safeParse(localStorage.getItem("cart_v2") || "[]", []),
    });
  }, []);

  // (Opcional) Reacciona a cambios de localStorage hechos en otras pestañas
  useEffect(() => {
    const onStorage = (e) => {
      if (!e.key) return;
      if (["nombre","correo","region","comuna","telefono","cart_v2"].includes(e.key)) {
        setDatos(prev => ({
          ...prev,
          [e.key]: e.key === "cart_v2" ? safeParse(e.newValue || "[]", []) : (e.newValue || ""),
        }));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Helper para renderizar una fila
  const Row = ({ label, value }) => (
    <li><strong>{label}:</strong> {value || "—"}</li>
  );

  return (
    <section className={className} style={{ marginTop: 24 }}>
      <h2>{title}</h2>
      <ul>
        {fields.includes("nombre")   && <Row label="Nombre"  value={datos.nombre} />}
        {fields.includes("correo")   && <Row label="Correo"  value={datos.correo} />}
        {fields.includes("region")   && <Row label="Región"  value={datos.region} />}
        {fields.includes("comuna")   && <Row label="Comuna"  value={datos.comuna} />}
        {fields.includes("telefono") && <Row label="Teléfono" value={datos.telefono} />}
        {fields.includes("cart_v2")  && (
          <Row label="Ítems guardados (cart_v2)" value={(datos.cart_v2?.length ?? 0).toString()} />
        )}
      </ul>
    </section>
  );
}
