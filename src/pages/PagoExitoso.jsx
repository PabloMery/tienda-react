// src/pages/PagoExitoso.jsx
// src/pages/PagoExitoso.jsx
import "../styles/pagoExitoso.css";

export default function PagoExitoso() {
  return (
    <main className="wrap">
      <div className="pago-container">
        <h1 className="pago-titulo">¡Pago exitoso!</h1>
        <p className="pago-mensaje">
          Tu orden ha sido procesada correctamente. 🎉
        </p>
        <p className="pago-detalle">
          Recibirás un correo con la confirmación y los detalles de tu compra.
        </p>
        <a href="/productos" className="pago-boton">
          Seguir comprando
        </a>
      </div>
    </main>
  );
}
