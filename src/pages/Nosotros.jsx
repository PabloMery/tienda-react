import { useEffect } from "react";
import "../styles/nosotros_estilos.css";

export default function Nosotros() {
  useEffect(() => {
    document.title = "Sobre nosotros - TANGANA";
  }, []);

  return (
    <main className="ns-page wrap">
      <h2 className="ns-title">Tangana</h2>

      <p>
        <strong>¿QUIÉNES SOMOS?</strong><br />
        Somos una empresa dedicada a la venta de patines, monopatines, skateboards y bicicletas BMX,
        pensada especialmente para jóvenes que buscan expresar su estilo, energía y libertad.<br />
        Nuestro propósito es inspirar a las nuevas generaciones a vivir experiencias llenas de aventura,
        movimiento y diversión, ofreciendo productos de calidad que combinan diseño, innovación y seguridad.
      </p>

      <div className="ns-team">
        <div className="ns-item">
          <div className="ns-card">
            <img className="ns-img" src="/IMG/Integrantes/pablo_mery1.jpeg" alt="Pablo Mery" loading="lazy" />
            <h5 className="ns-name">Pablo Mery</h5>
            <p className="ns-role">Director general<br />Socio y Fundador<br />Tangana</p>
          </div>
        </div>

        <div className="ns-item">
          <div className="ns-card">
            <img className="ns-img" src="/IMG/Integrantes/nicolas_sanchez1.jpeg" alt="Nicolás Sánchez" loading="lazy" />
            <h5 className="ns-name">Nicolás Sánchez</h5>
            <p className="ns-role">Programador<br />Socio y Fundador<br />Tangana</p>
          </div>
        </div>

        <div className="ns-item">
          <div className="ns-card">
            <img className="ns-img" src="/IMG/Integrantes/freddy_galarza1.jpeg" alt="Freddy Galarza" loading="lazy" />
            <h5 className="ns-name">Freddy Galarza</h5>
            <p className="ns-role">Experto en deporte<br />Socio y Fundador<br />Tangana</p>
          </div>
        </div>
      </div>

      <p className="ns-mt">Pablo Mery, Freddy Galarza y Nicolás Sánchez crean la empresa Tangana en 2023 dedicándose
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
