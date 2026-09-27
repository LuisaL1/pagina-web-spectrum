import Link from "next/link";
import Image from "next/image";
import { getNews } from "@/data/news";
import { ArrowRightIcon } from "../icons";
import { localizedHref } from "@/lib/i18n";
import BackLink from "../widgets/BackLink";

const content = {
  es: {
    backHome: "Volver al inicio",
    eyebrow: "Spectrum",
    heading: "Novedades",
    lead: "Noticias, alianzas, certificaciones y eventos de Spectrum.",
    featured: "Destacado",
    readMore: "Leer más",
  },
  en: {
    backHome: "Back to home",
    eyebrow: "Spectrum",
    heading: "News",
    lead: "News, partnerships, certifications and events from Spectrum.",
    featured: "Featured",
    readMore: "Read more",
  },
};

export default function Novedades({ locale = "es" }) {
  const news = getNews(locale);
  const t = content[locale] || content.es;
  const [featured, ...rest] = news;

  return (
    <section className="blog-archive pattern-bg-after" id="novedades">
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
              <div className="blog-pills">
                {featured.kicker && (
                  <span className="blog-pill blog-pill--glass">
                    {featured.kicker}
                  </span>
                )}
                <span className="blog-pill">{featured.category}</span>
              </div>
              <p className="blog-meta">
                {t.featured} &middot; {featured.date}
              </p>
              <h3>{featured.title}</h3>
              <p className="blog-excerpt">{featured.excerpt}</p>
              <Link
                className="blog-link blog-link--light"
                href={localizedHref(locale, `/novedades/${featured.slug}`)}
              >
                {t.readMore} <ArrowRightIcon size={16} />
              </Link>
            </div>
          </article>
        )}

        {rest.length > 0 && (
          <div className="blog-archive-grid">
            {rest.map((item) => (
              <article className="blog-tile" key={item.slug}>
                <div className="blog-tile-thumb">
                  {item.bg && (
                    <Image
                      src={item.bg}
                      alt=""
                      fill
                      sizes="(max-width: 700px) 100vw, 50vw"
                      className="blog-row-img"
                    />
                  )}
                  <span className="blog-pill">{item.category}</span>
                </div>
                <div className="blog-tile-body">
                  <p className="blog-meta">{item.date}</p>
                  <h3>{item.title}</h3>
                  <p className="blog-tile-excerpt">{item.excerpt}</p>
                  <Link
                    className="blog-link"
                    href={localizedHref(locale, `/novedades/${item.slug}`)}
                  >
                    {t.readMore} <ArrowRightIcon size={16} />
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
