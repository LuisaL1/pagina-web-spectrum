import { getSiteUrl } from "./site-url";
import { SITE_NAME } from "./seo";

const SITE_URL = getSiteUrl();
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const LOGO_URL = `${SITE_URL}/logos/logo-spectrum.png`;

// Perfiles oficiales (los mismos del footer). `sameAs` le confirma a Google
// que estas cuentas son de la misma empresa que el sitio.
const SOCIAL_PROFILES = [
  "https://www.linkedin.com/company/spectrum-technologyco/",
  "https://www.instagram.com/spectrumt.co",
  "https://www.facebook.com/people/Spectrum-Technology/61592216507649/",
];

// Schema.org Organization: se renderiza una vez en el layout raiz para que
// Google pueda asociar el sitio a una entidad de empresa (logo en resultados
// de busqueda, panel de conocimiento).
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    legalName: "Spectrum Technology S.A.S.",
    alternateName: "Spectrum",
    url: SITE_URL,
    logo: LOGO_URL,
    description:
      "Ecosistema tecnológico de infraestructura, ciberseguridad, conectividad e inteligencia artificial para organizaciones públicas y privadas en Colombia.",
    areaServed: "CO",
    sameAs: SOCIAL_PROFILES,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "soporte@spectrumt.co",
      availableLanguage: ["es", "en"],
    },
  };
}

// Schema.org WebSite: es la senal principal que usa Google para el "nombre
// del sitio" que aparece encima de cada resultado de busqueda (en vez de
// solo el dominio). alternateName cubre a quien busque solo "Spectrum".
export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: ["Spectrum", "spectrumt.co"],
    url: SITE_URL,
    inLanguage: ["es", "en"],
    publisher: { "@id": ORGANIZATION_ID },
  };
}

// Schema.org BlogPosting (blog) / NewsArticle (novedades): habilita que Google
// muestre el articulo con titulo, imagen y autor en resultados enriquecidos.
// `path` ya viene localizado (con /en si aplica).
export function buildArticleSchema({ type = "BlogPosting", title, description, path, locale, image }) {
  const url = `${SITE_URL}${path}`;
  return {
    "@context": "https://schema.org",
    "@type": type,
    headline: title,
    description,
    url,
    mainEntityOfPage: url,
    inLanguage: locale,
    image: image ? `${SITE_URL}${encodeURI(image)}` : LOGO_URL,
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
  };
}

// Schema.org BreadcrumbList: items es un arreglo de { name, path } con la
// ruta ya localizada (incluyendo el prefijo /en si aplica). Habilita que
// Google muestre la migaja de pan en el resultado de busqueda en vez de la
// URL completa.
export function buildBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
