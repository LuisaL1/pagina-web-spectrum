import { getSolutions } from "@/data/solutions-data";
import { localizedHref } from "@/lib/i18n";

const staticEntriesEs = [
  {
    title: "Nosotros",
    description: "Quiénes somos y qué nos mueve como ecosistema tecnológico.",
    href: "/nosotros",
    keywords: "about ecosistema filosofia",
  },
  {
    title: "Soluciones",
    description: "Las seis unidades de negocio de Spectrum, en un solo lugar.",
    href: "/#soluciones",
    keywords: "servicios unidades de negocio",
  },
  {
    title: "Nuestros principales clientes",
    description: "Organizaciones que confían en Spectrum.",
    href: "/nosotros#casos",
    keywords: "clientes referencias exito casos",
  },
  {
    title: "Aliados tecnológicos",
    description: "Los fabricantes y marcas que respaldan nuestras soluciones.",
    href: "/#aliados",
    keywords: "partners logos marcas fabricantes",
  },
  {
    title: "Blog",
    description: "Artículos técnicos escritos por nuestro equipo.",
    href: "/#blog",
    keywords: "articulos contenido recursos",
  },
  {
    title: "Novedades",
    description: "Noticias y lanzamientos de Spectrum.",
    href: "/novedades",
    keywords: "noticias lanzamientos boletin",
  },
  {
    title: "Nuestro equipo",
    description: "Las personas detrás de Spectrum.",
    href: "/equipo",
    keywords: "equipo directivo liderazgo team",
  },
  {
    title: "Contacto",
    description: "Hablemos de la evolución de su infraestructura.",
    href: "/#contacto",
    keywords: "contactar asesoria whatsapp mesa de ayuda",
  },
  {
    title: "Política de Tratamiento de Datos Personales",
    description: "Cómo protegemos y usamos tus datos personales.",
    href: "/politica-de-datos",
    keywords: "privacidad datos personales habeas data",
  },
];

const staticEntriesEn = [
  {
    title: "About us",
    description: "Who we are and what drives us as a technology ecosystem.",
    href: "/nosotros",
    keywords: "about ecosystem philosophy",
  },
  {
    title: "Solutions",
    description: "Spectrum's six business units, in one place.",
    href: "/#soluciones",
    keywords: "services business units",
  },
  {
    title: "Our leading clients",
    description: "Organizations that trust Spectrum.",
    href: "/nosotros#casos",
    keywords: "clients references success cases",
  },
  {
    title: "Technology partners",
    description: "The manufacturers and brands that back our solutions.",
    href: "/#aliados",
    keywords: "partners logos brands manufacturers",
  },
  {
    title: "Blog",
    description: "Technical articles written by our team.",
    href: "/#blog",
    keywords: "articles content resources",
  },
  {
    title: "News",
    description: "Spectrum news and announcements.",
    href: "/novedades",
    keywords: "news announcements newsletter",
  },
  {
    title: "Our team",
    description: "The people behind Spectrum.",
    href: "/equipo",
    keywords: "team leadership staff",
  },
  {
    title: "Contact",
    description: "Let's talk about the evolution of your infrastructure.",
    href: "/#contacto",
    keywords: "contact consultation whatsapp help desk",
  },
  {
    title: "Personal Data Processing Policy",
    description: "How we protect and use your personal data.",
    href: "/politica-de-datos",
    keywords: "privacy personal data",
  },
];

export function getSearchIndex(locale = "es") {
  const staticEntries = locale === "en" ? staticEntriesEn : staticEntriesEs;
  const solutions = getSolutions(locale);
  const solutionEntries = solutions.map((solution) => ({
    title: solution.title,
    description: solution.desc,
    href: `/soluciones/${solution.slug}`,
    keywords: solution.tags.join(" "),
  }));

  return [...staticEntries, ...solutionEntries].map((entry) => ({
    ...entry,
    href: localizedHref(locale, entry.href),
  }));
}

export const searchIndex = getSearchIndex("es");

function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function search(query, locale = "es") {
  const q = normalize(query).trim();
  if (!q) return [];

  return getSearchIndex(locale)
    .map((entry) => {
      const haystack = normalize(
        `${entry.title} ${entry.description} ${entry.keywords}`,
      );
      const titleMatch = normalize(entry.title).includes(q);
      const match = haystack.includes(q);
      return { entry, match, score: titleMatch ? 2 : match ? 1 : 0 };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.entry);
}
