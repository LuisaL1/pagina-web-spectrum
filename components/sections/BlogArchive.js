import Link from "next/link";
import Image from "next/image";
import { getArticles } from "@/data/articles";
import { ArrowRightIcon } from "../icons";
import { localizedHref } from "@/lib/i18n";
import BackLink from "../widgets/BackLink";

const content = {
  es: {
    eyebrow: "Spectrum",
    heading: "Blog",
    lead: "Artículos técnicos sobre infraestructura, ciberseguridad, conectividad e inteligencia artificial escritos por nuestro equipo.",
    featured: "Destacado",
    readArticle: "Leer artículo",
    backHome: "Volver al inicio",
  },
  en: {
    eyebrow: "Spectrum",
    heading: "Blog",
    lead: "Technical articles on infrastructure, cybersecurity, connectivity and artificial intelligence written by our team.",
    featured: "Featured",
    readArticle: "Read article",
    backHome: "Back to home",
  },
};

export default function BlogArchive({ locale = "es" }) {
  const articles = getArticles(locale);
  const t = content[locale] || content.es;
  const [featured, ...rest] = articles;

  return (
    <section className="blog-archive pattern-bg-after" id="blog-archive">
      <div className="wrap">
        <BackLink className="page-back" href={localizedHref(locale, "/")}>
          <ArrowRightIcon size={14} className="page-back-icon" />
          {t.backHome}
        </BackLink>
        <div className="section-head">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2>{t.heading}</h2>
          <p>{t.lead}</p>
        </div>

        {featured && (
          <article className="blog-hero-card blog-hero-card--wide">
            {featured.bg && (
              <Image
                src={featured.bg}
                alt=""
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1136px"
                className="blog-hero-img"
              />
            )}
            <div className="blog-hero-content">
              <span className="blog-pill">{featured.category}</span>
              <p className="blog-meta">
                {t.featured} &middot; {featured.date}
              </p>
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

        {rest.length > 0 && (
          <div className="blog-archive-grid">
            {rest.map((article) => (
              <article className="blog-tile" key={article.slug}>
                <div className="blog-tile-thumb">
                  {article.bg && (
                    <Image
                      src={article.bg}
                      alt=""
                      fill
                      sizes="(max-width: 700px) 100vw, 50vw"
                      className="blog-row-img"
                    />
                  )}
                  <span className="blog-pill">{article.category}</span>
                </div>
                <div className="blog-tile-body">
                  <p className="blog-meta">{article.date}</p>
                  <h3>{article.title}</h3>
                  <p className="blog-tile-excerpt">{article.excerpt}</p>
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
        )}
      </div>
    </section>
  );
}
