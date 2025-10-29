import { useEffect } from "react";
import "../styles/nosotros_estilos.css";

export default function Nosotros() {
  useEffect(() => {
    document.title = "Sobre nosotros - TANGANA";
  }, []);

  return (
    <main className="content wrap">
      <h2>Tangana</h2>

      <p>
        <strong>¿QUIÉNES SOMOS?</strong><br />
        Somos una empresa dedicada a la venta de patines, monopatines, skateboards y bicicletas BMX,
        pensada especialmente para jóvenes que buscan expresar su estilo, energía y libertad.<br />
        Nuestro propósito es inspirar a las nuevas generaciones a vivir experiencias llenas de aventura,
        movimiento y diversión, ofreciendo productos de calidad que combinan diseño, innovación y seguridad.
      </p>

      <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-3 mt-4">
        <div className="col">
          <div className="profile-card h-100 d-flex flex-column align-items-center text-center">
            <img
              className="profile-img mb-2"
              src="/IMG/Integrantes/pablo_mery1.jpeg"
              alt="Pablo Mery"
              loading="lazy"
            />
            <h5 className="mb-1">Pablo Mery</h5>
            <p className="mb-0">
              Director general<br />Socio y Fundador<br />Tangana
            </p>
          </div>
        </div>

        <div className="col">
          <div className="profile-card h-100 d-flex flex-column align-items-center text-center">
            <img
              className="profile-img mb-2"
              src="/IMG/Integrantes/nicolas_sanchez1.jpeg"
              alt="Nicolás Sánchez"
              loading="lazy"
            />
            <h5 className="mb-1">Nicolás Sánchez</h5>
            <p className="mb-0">
              Programador<br />Socio y Fundador<br />Tangana
            </p>
          </div>
        </div>

        <div className="col">
          <div className="profile-card h-100 d-flex flex-column align-items-center text-center">
            <img
              className="profile-img mb-2"
              src="/IMG/Integrantes/freddy_galarza1.jpeg"
              alt="Freddy Galarza"
              loading="lazy"
            />
            <h5 className="mb-1">Freddy Galarza</h5>
            <p className="mb-0">
              Experto en deporte<br />Socio y Fundador<br />Tangana
            </p>
          </div>
        </div>
      </div>

      <p className="mt-4">
        Pablo Mery, Freddy Galarza y Nicolás Sánchez crean la empresa Tangana en 2023 dedicándose
        principalmente a la venta de Skate, BMX, patines y monopatines.
      </p>

      <p>
        En el año 2024 la empresa invirtió en la creación de un sitio web, para así expandir sus ventas y hacerse conocida,
        especialmente por los jóvenes. Debido al éxito alcanzado por la página, la empresa Tangana alcanzó un gran éxito,
        haciéndose conocida por todo Santiago de Chile como la mejor empresa deportiva de la ciudad.
      </p>

      <p>
        Desde entonces y hasta ahora la empresa nunca más se detuvo y continuó vendiendo sus vehículos deportivos.
        Actualmente la empresa está considerando aplicar mejoras en su sitio web.
      </p>
    </main>
  );
}