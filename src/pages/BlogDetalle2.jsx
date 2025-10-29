import { Link } from "react-router-dom";
import "../styles/blog.css";

export default function BlogDetalle2() {
  return (
    <main className="wrap">
      <article className="post-card" style={{ gridTemplateColumns: "1fr" }}>
        <figure className="post-img post-hero post-hero--tangana">
          <img
            src="/IMG/Blog/BannerBlogSorteoNoticia2.png"
            alt="Banner de la campaña: ¡Descuentos Tangana!"
            loading="eager"
          />
        </figure>

        <div className="post-body">
          <h1 className="post-title">¡Prepárate para ser ciclista!</h1>
          <div className="post-meta">Anuncio de tienda — 2025</div>

          <p>
            ¡Seguimos celebrando la victoria de <strong>Pablo Sánchez</strong> en{" "}
            <strong>Red Bull Rodando en Callampark</strong>! Para impulsar a más
            personas a subirse a la bicicleta, anunciaremos{" "}
            <strong>descuentos próximos</strong> en la bicicleta que utilizó en
            el evento:
          </p>

          <ul>
            <li>
              <Link to="/producto/2">
                Bicicleta BMX Wtp Trust Cs Rsd Matt Black
              </Link>{" "}
              — rendimiento probado.
            </li>
          </ul>

          <p>
            Mantente atento a los <strong>anuncios en tienda</strong>, nuestra{" "}
            <strong>página web</strong> y <strong>redes sociales</strong>, donde
            liberaremos toda la información de la campaña. ¡Es tu momento para
            dar el primer pedaleo!
          </p>

          <p className="muted">
            *Los descuentos y condiciones serán publicados oficialmente en
            nuestros canales. Stock sujeto a disponibilidad.
          </p>

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
