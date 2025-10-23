import React from "react";
import { Link } from "react-router-dom";
import "../styles/Blog.css";

// --- Arreglo de noticias ---
const POSTS = [
  {
    id: 1,
    titulo: "Ganador Red Bull Rodando en Callampark",
    fecha: "2025-09-12",
    resumen:
      "El evento Red Bull Rodando Chile reunió lo mejor del ciclismo urbano en Callampark (La Florida), con competencias en distintas categorías. ¡Conoce al ganador y revive lo mejor de la jornada!",
    enlace: "../HTML/blogDetalle1.html",
    imgAlt: "Podio del ganador en Red Bull Rodando Chile",
    img: "../../public/IMG/Blog/RodandoChileBlog1.avif",
  },
  {
    id: 2,
    titulo:
      "¡Prepárate para ser ciclista! Descuentos por victoria de Pablo Sánchez en Red Bull Rodando Chile",
    fecha: "2025-09-12",
    resumen:
      "Por el triunfo de Pablo Sánchez, pronto liberaremos descuentos para la Bicicleta BMX Wtp Trust Cs Rsd Matt Black. Mantente atento a tienda, web y redes.",
    enlace: "blogDetalle2.html",
    imgAlt: "Promoción de productos para ciclismo",
    img: "../../public/IMG/Blog/Blog2Sorteo.png",
  },
];

function Blog() {
  // Función para formatear la fecha
  const formatearFecha = (iso) =>
    new Date(iso).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <>


      {/* CONTENIDO PRINCIPAL */}
      <main className="wrap">
        <section className="blog-hero">
          <h1>NOTICIAS IMPORTANTES</h1>
          <p className="muted">Últimas novedades y curiosidades de la tienda.</p>
        </section>

        {/* LISTADO DE NOTICIAS */}
        <section id="blog-list" className="blog-list" aria-label="Listado de noticias">
          {POSTS.map((post) => (
            <article className="post-card" key={post.id}>
              <div className="post-body">
                <h2 className="post-title">{post.titulo}</h2>
                <div className="post-meta">{formatearFecha(post.fecha)}</div>
                <p className="post-desc">{post.resumen}</p>
                <div className="post-actions">
                  <a
                    className="btn-outline"
                    href={post.enlace}
                    aria-label={`Ver caso: ${post.titulo}`}
                  >
                    Ver más
                  </a>
                </div>
              </div>

              {post.img ? (
                <figure className="post-img">
                  <img src={post.img} alt={post.imgAlt || ""} loading="lazy" />
                </figure>
              ) : (
                <div className="post-img" aria-hidden="true">
                  Imagen
                </div>
              )}
            </article>
          ))}
        </section>
      </main>
    </>
  );
}

export default Blog;