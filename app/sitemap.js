import { getSiteUrl } from "@/lib/site-url";
import { localizedHref } from "@/lib/i18n";
import { solutions } from "@/data/solutions-data";
import { articles } from "@/data/articles";
import { news } from "@/data/news";

const staticPaths = [
  "/",
  "/nosotros",
  "/equipo",
  "/novedades",
  "/blog",
  "/politica-de-datos",
];

const LOCALES = ["es", "en"];

export default function sitemap() {
  const siteUrl = getSiteUrl();
  const now = new Date();
  // Misma forma que el canonical de cada pagina: el home es el dominio sin
  // "/" final.
  const absolute = (locale, path) => {
    const href = localizedHref(locale, path);
    return href === "/" ? siteUrl : `${siteUrl}${href}`;
  };

  const paths = [
    ...staticPaths,
    ...solutions.map((solution) => `/soluciones/${solution.slug}`),
    ...articles.map((article) => `/blog/${article.slug}`),
    ...news.map((item) => `/novedades/${item.slug}`),
  ];

  // Cada URL declara su par en el otro idioma (hreflang), igual que las
  // etiquetas <link rel="alternate"> de buildAlternates.
  return LOCALES.flatMap((locale) =>
    paths.map((path) => ({
      url: absolute(locale, path),
      lastModified: now,
      alternates: {
        languages: {
          es: absolute("es", path),
          en: absolute("en", path),
        },
      },
    })),
  );
}
