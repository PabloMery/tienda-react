import { Link } from "react-router-dom";
import "../styles/blog.css";

export default function BlogDetalle1() {
  return (
    <main className="wrap">
      <article className="post-card" style={{ gridTemplateColumns: "1fr" }}>
        <figure className="post-img post-hero">
          <img
            src="/IMG/Blog/RodandoChileNoticia1Banner.avif"
            alt="Red Bull Rodando Chile en Callampark: truco BMX del ganador"
            loading="eager"
          />
        </figure>

        <div className="post-body">
          <h1 className="post-title">Ganador Red Bull Rodando en Callampark</h1>
          <div className="post-meta">
            Callampark, La Florida — Red Bull Rodando Chile — 2025
          </div>

          <p>
            El <strong>Red Bull Rodando Chile</strong> se tomó el{" "}
            <strong>Callampark</strong> (abajo de La Florida) con una jornada que
            reunió lo mejor del <em>ciclismo urbano</em> y competencias de
            diversas categorías.
          </p>

          <p>
            Tras mangas clasificatorias y una final de infarto, el ganador{" "}
            <strong>Pablo Sánchez</strong> se impuso con técnica, control y
            velocidad, destacando entre riders de todo Chile. La energía del
            público convirtió la pista en una verdadera fiesta del deporte
            urbano.
          </p>

          <p>
            Agradecemos a la comunidad que asistió y a quienes apoyaron el
            evento. ¡Nos vemos en la próxima fecha!
          </p>

          <hr />

          <h2>Productos mencionados</h2>
          <p className="muted">
            Explora equipamiento similar al usado por los competidores:
          </p>
          <ul>
            <li>
              <Link to="/producto/2">
                Bicicleta BMX Wtp Trust Cs Rsd Matt Black
              </Link>
            </li>
          </ul>

          <p>
            <Link className="btn-outline" to="/blog">
              ← Volver al Blog
            </Link>
          </p>
        </div>
      </article>
    </main>
  );
}
