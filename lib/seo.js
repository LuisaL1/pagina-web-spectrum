import { localizedHref } from "./i18n";

// Nombre de marca que se muestra en titulos, vistas previas y datos
// estructurados. Google arma el "nombre del sitio" del resultado de busqueda
// a partir de este valor (WebSite schema + og:site_name + <title>), asi que
// debe ser el mismo en todas partes.
export const SITE_NAME = "Spectrum Technology";

// Sufijo comun de los <title> de cada pagina: "Blog | Spectrum Technology".
export function pageTitle(title) {
  return `${title} | ${SITE_NAME}`;
}

// Genera el canonical + las etiquetas hreflang (ES/EN/x-default) de una
// pagina a partir de su ruta logica sin prefijo de idioma (ej. "/nosotros",
// "/blog/mi-articulo", "/" para el home). Evita contenido duplicado entre
// "/" y "/en" a ojos de los buscadores.
export function buildAlternates(locale, path) {
  return {
    canonical: localizedHref(locale, path),
    languages: {
      es: localizedHref("es", path),
      en: localizedHref("en", path),
      "x-default": localizedHref("es", path),
    },
  };
}

// Logo compartido para las vistas previas de Open Graph/Twitter Card. Mismo
// archivo que ya usa app/layout.js como imagen por defecto.
const OG_IMAGE = {
  url: "/logos/logo-spectrum.png",
  width: 2172,
  height: 724,
  alt: SITE_NAME,
};

// Genera openGraph + twitter especificos de una pagina, para que compartir
// un link en redes sociales muestre el titulo/descripcion reales de esa
// pagina en vez de la vista previa generica del layout raiz. Next.js no
// hace deep-merge de `openGraph` entre layout y pagina (si la pagina lo
// define, reemplaza el objeto completo), asi que cada pagina debe traer su
// propio bloque completo -- por eso este helper. `type: "article"` es para
// las paginas de blog/novedades; `image` (ruta en /public) reemplaza el logo
// por la foto de portada del articulo.
export function buildOpenGraph({ title, description, locale, path, type = "website", image }) {
  const ogImage = image ? { url: encodeURI(image), alt: title } : OG_IMAGE;
  return {
    openGraph: {
      title,
      description,
      type,
      siteName: SITE_NAME,
      locale: locale === "en" ? "en_US" : "es_CO",
      alternateLocale: locale === "en" ? "es_CO" : "en_US",
      url: localizedHref(locale, path),
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}
