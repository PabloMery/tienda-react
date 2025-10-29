import { useMemo } from "react";
import { Link } from "react-router-dom";
import "../styles/blog.css";

export default function Blog() {
  // 📰 Datos de los posts (antes estaban en blog.js)
  const POSTS = [
    {
      id: 1,
      titulo: "Ganador Red Bull Rodando en Callampark",
      fecha: "2025-09-12",
      resumen:
        "El evento Red Bull Rodando Chile reunió lo mejor del ciclismo urbano en Callampark (La Florida), con competencias en distintas categorías. ¡Conoce al ganador y revive lo mejor de la jornada!",
      enlace: "/blog/detalle/1", // usa tus rutas React
      img: "/IMG/Blog/RodandoChileBlog1.avif",
      imgAlt: "Podio del ganador en Red Bull Rodando Chile",
    },
    {
      id: 2,
      titulo:
        "¡Prepárate para ser ciclista! Descuentos por victoria de Pablo Sánchez en Red Bull Rodando Chile",
      fecha: "2025-09-12",
      resumen:
        "Por el triunfo de Pablo Sánchez, pronto liberaremos descuentos para la Bicicleta BMX Wtp Trust Cs Rsd Matt Black. Mantente atento a tienda, web y redes.",
      enlace: "/blog/detalle/2",
      img: "/IMG/Blog/Blog2Sorteo.png",
      imgAlt: "Promoción de productos para ciclismo",
    },
  ];

  // 📅 Formatear fecha tipo 12/09/2025
  const fmtFecha = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // 🔁 Ordenar (opcional)
  const postsOrdenados = useMemo(
    () => [...POSTS].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)),
    []
  );

  return (
    <main className="wrap">
      {/* Hero */}
      <section className="blog-hero">
        <h1>NOTICIAS IMPORTANTES</h1>
        <p className="muted">Últimas novedades y curiosidades de la tienda.</p>
      </section>

      {/* Listado */}
      <section id="blog-list" className="blog-list" aria-label="Listado de noticias">
        {postsOrdenados.map((p) => (
          <article key={p.id} className="post-card">
            <div className="post-body">
              <h2 className="post-title">{p.titulo}</h2>
              <div className="post-meta">{fmtFecha(p.fecha)}</div>
              <p className="post-desc">{p.resumen}</p>
              <div className="post-actions">
                <Link
                  className="btn-outline"
                  to={p.enlace}
                  aria-label={`Ver caso: ${p.titulo}`}
                >
                  Ver más
                </Link>
              </div>
            </div>

            <figure className="post-img">
              {p.img ? (
                <img
                  src={p.img}
                  alt={p.imgAlt || ""}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.outerHTML =
                      '<div class="post-img" aria-hidden="true">Imagen</div>';
                  }}
                />
              ) : (
                <div className="post-img" aria-hidden="true">
                  Imagen
                </div>
              )}
            </figure>
          </article>
        ))}
      </section>
    </main>
  );
}
