import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "../icons";
import ReadingProgress from "../widgets/ReadingProgress";
import { localizedHref } from "@/lib/i18n";
import BackLink from "../widgets/BackLink";

const labels = {
  blog: {
    es: {
      back: "Volver al blog",
      related: "Sigue leyendo",
      read: "Leer artículo",
    },
    en: {
      back: "Back to blog",
      related: "Keep reading",
      read: "Read article",
    },
  },
  news: {
    es: {
      back: "Volver a Novedades",
      related: "Más novedades",
      read: "Leer más",
    },
    en: {
      back: "Back to news",
      related: "More news",
      read: "Read more",
    },
  },
};

const minutesLabel = {
  es: (n) => `${n} min de lectura`,
  en: (n) => `${n} min read`,
};

function readingMinutes(item) {
  const text = [
    item.excerpt,
    ...item.content.map(
      (b) => `${b.heading ?? ""} ${b.body ?? ""} ${b.quote ?? ""}`,
    ),
  ].join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// "1. Titulo" -> numero destacado en rojo + titulo.
function Heading({ text }) {
  const match = text.match(/^(\d+)\.\s+(.*)$/);
  if (!match) return <h2>{text}</h2>;
  return (
    <h2>
      <span className="article-num">{match[1]}</span>
      {match[2]}
    </h2>
  );
}

function Figure({ image, className = "" }) {
  return (
    <figure className={`article-figure ${className}`.trim()}>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.w}
        height={image.h}
        sizes="(max-width: 900px) 100vw, 1080px"
      />
      {image.caption && <figcaption>{image.caption}</figcaption>}
    </figure>
  );
}

function Block({ block }) {
  if (block.stats) {
    return (
      <ul className="article-stats">
        {block.stats.map((stat) => (
          <li key={stat.label}>
            <b>{stat.value}</b>
            <span>{stat.label}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (block.quote) {
    return <blockquote className="article-quote">{block.quote}</blockquote>;
  }

  const text = (block.heading || block.body) && (
    <div className="article-text">
      {block.heading && <Heading text={block.heading} />}
      {block.body && <p>{block.body}</p>}
    </div>
  );

  if (!block.image) return text;

  const layout = block.layout || "wide";
  if (layout.startsWith("split")) {
    return (
      <div className={`article-split article-split--${layout}`}>
        {text}
        <Figure image={block.image} />
      </div>
    );
  }

  return (
    <>
      {text}
      <Figure image={block.image} className={`article-figure--${layout}`} />
    </>
  );
}

export default function ArticleView({
  item,
  kind = "blog",
  basePath,
  related = [],
  locale = "es",
}) {
  const lang = locale === "en" ? "en" : "es";
  const t = labels[kind][lang];
  const minutes = readingMinutes(item);
  const party = item.theme === "celebration";

  return (
    <>
      <ReadingProgress />
      <article
        className={`article-doc pattern-bg-after${party ? " article-doc--party" : ""}`}
      >
        <header className="article-hero">
          {item.bg && (
            <Image
              src={item.bg}
              alt=""
              fill
              priority
              sizes="100vw"
              className="article-hero-img"
            />
          )}
          <div className="wrap article-hero-inner">
            <BackLink
              className="article-back"
              href={localizedHref(locale, basePath)}
            >
              <ArrowRightIcon size={14} className="article-back-icon" />
              {t.back}
            </BackLink>
            <div className="article-pills">
              {item.kicker && (
                <span className="article-pill article-pill--glass">
                  {item.kicker}
                </span>
              )}
              <span className="article-pill">{item.category}</span>
            </div>
            <h1>{item.title}</h1>
            <p className="article-meta">
              <span>{item.date}</span>
              <span className="article-dot" aria-hidden="true" />
              <span>{minutesLabel[lang](minutes)}</span>
            </p>
          </div>
        </header>

        <div className="wrap article-body-wrap">
          <div className="article-body">
            <p className="article-lead">{item.excerpt}</p>
            {item.content.map((block, index) => (
              <Block block={block} key={index} />
            ))}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="article-related">
          <div className="wrap">
            <h2>{t.related}</h2>
            <div className="article-related-grid">
              {related.map((entry) => (
                <article className="blog-row-card" key={entry.slug}>
                  <div className="blog-row-thumb">
                    {entry.bg && (
                      <Image
                        src={entry.bg}
                        alt=""
                        fill
                        sizes="(max-width: 560px) 100vw, 20vw"
                        className="blog-row-img"
                      />
                    )}
                  </div>
                  <div className="blog-row-body">
                    <span className="blog-row-cat">{entry.category}</span>
                    <p className="blog-meta">{entry.date}</p>
                    <h3>{entry.title}</h3>
                    <Link
                      className="blog-link"
                      href={localizedHref(locale, `${basePath}/${entry.slug}`)}
                    >
                      {t.read} <ArrowRightIcon size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
