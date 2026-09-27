import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "../icons";
import { getArticles } from "@/data/articles";
import { localizedHref } from "@/lib/i18n";

const content = {
  es: {
    eyebrow: "Recursos",
    heading: "Blog & contenido técnico",
    lead: "Artículos mensuales sobre infraestructura, ciberseguridad y conectividad escritos por nuestro equipo.",
    readArticle: "Leer artículo",
    viewNews: "Ver novedades",
  },
  en: {
    eyebrow: "Resources",
    heading: "Blog & technical content",
    lead: "Monthly articles on infrastructure, cybersecurity and connectivity written by our team.",
    readArticle: "Read article",
    viewNews: "View news",
  },
};

export default function Blog({ locale = "es" }) {
  const articles = getArticles(locale);
  const [featured, ...rest] = articles;
  const t = content[locale] || content.es;

  return (
    <section className="blog-section" id="blog">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2>{t.heading}</h2>
          <p>{t.lead}</p>
        </div>

        <div className="blog-showcase">
          {featured && (
            <article className="blog-hero-card">
              {featured.bg && (
                <Image
                  src={featured.bg}
                  alt=""
                  fill
                  sizes="(max-width: 980px) 100vw, 60vw"
                  className="blog-hero-img"
                />
              )}
              <div className="blog-hero-content">
                <span className="blog-pill">{featured.category}</span>
                <p className="blog-meta">{featured.date}</p>
                <h3>{featured.title}</h3>
                <p className="blog-excerpt">{featured.excerpt}</p>
                <Link
                  className="blog-link blog-link--light"
                  href={localizedHref(locale, `/blog/${featured.slug}`)}
                >
                  {t.readArticle} <ArrowRightIcon size={16} />
                </Link>
              </div>
            </article>
          )}

          <div className="blog-side">
            {rest.map((article) => (
              <article className="blog-row-card" key={article.slug}>
                <div className="blog-row-thumb">
                  {article.bg && (
                    <Image
                      src={article.bg}
                      alt=""
                      fill
                      sizes="(max-width: 560px) 100vw, 20vw"
                      className="blog-row-img"
                    />
                  )}
                </div>
                <div className="blog-row-body">
                  <span className="blog-row-cat">{article.category}</span>
                  <p className="blog-meta">{article.date}</p>
                  <h3>{article.title}</h3>
                  <Link
                    className="blog-link"
                    href={localizedHref(locale, `/blog/${article.slug}`)}
                  >
                    {t.readArticle} <ArrowRightIcon size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="blog-footer-cta">
          <Link
            href={localizedHref(locale, "/novedades")}
            className="btn btn-primary"
          >
            {t.viewNews}
          </Link>
        </div>
      </div>
    </section>
  );
}
