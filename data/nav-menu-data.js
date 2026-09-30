import { getSolutions } from "@/data/solutions-data";
import { getArticles } from "@/data/articles";
import { getNews } from "@/data/news";
import { localizedHref } from "@/lib/i18n";

const CASOS_DE_USO = {
  es: [
    { slug: "infraestructura-tecnologica", title: "Hiperconvergencia (HCI)" },
    { slug: "infraestructura-tecnologica", title: "Continuidad y respaldo" },
    { slug: "ciberseguridad", title: "SOC 24/7" },
    { slug: "ciberseguridad", title: "Hacking ético / Pentesting" },
    { slug: "conectividad", title: "SD-WAN" },
    {
      slug: "conectividad",
      title: "Conectividad cifrada de extremo a extremo",
    },
    { slug: "servicios-de-ti", title: "Mesa de ayuda" },
    { slug: "servicios-de-ti", title: "Consultoría estratégica" },
    { slug: "inteligencia-artificial", title: "Automatización inteligente" },
    { slug: "inteligencia-artificial", title: "IA aplicada a ciberseguridad" },
    { slug: "desarrollo-a-la-medida", title: "Aplicaciones web y móviles" },
    { slug: "desarrollo-a-la-medida", title: "Integración de sistemas y APIs" },
  ],
  en: [
    { slug: "infraestructura-tecnologica", title: "Hyperconvergence (HCI)" },
    { slug: "infraestructura-tecnologica", title: "Continuity and backup" },
    { slug: "ciberseguridad", title: "SOC 24/7" },
    { slug: "ciberseguridad", title: "Ethical hacking / Pentesting" },
    { slug: "conectividad", title: "SD-WAN" },
    { slug: "conectividad", title: "End-to-end encrypted connectivity" },
    { slug: "servicios-de-ti", title: "Help desk" },
    { slug: "servicios-de-ti", title: "Strategic consulting" },
    { slug: "inteligencia-artificial", title: "Intelligent automation" },
    { slug: "inteligencia-artificial", title: "AI applied to cybersecurity" },
    { slug: "desarrollo-a-la-medida", title: "Web and mobile applications" },
    { slug: "desarrollo-a-la-medida", title: "System and API integration" },
  ],
};

const SECTORES = {
  es: [
    { title: "Sector gobierno", slug: "gobierno" },
    { title: "Sector educación", slug: "educacion" },
    { title: "Sector financiero", slug: "financiero" },
    { title: "Sector defensa", slug: "defensa" },
  ],
  en: [
    { title: "Government sector", slug: "gobierno" },
    { title: "Education sector", slug: "educacion" },
    { title: "Financial sector", slug: "financiero" },
    { title: "Defense sector", slug: "defensa" },
  ],
};

export function getSolutionsMenuColumns(locale = "es") {
  const solutions = getSolutions(locale);
  const casosDeUso = CASOS_DE_USO[locale] || CASOS_DE_USO.es;
  const sectores = SECTORES[locale] || SECTORES.es;
  const t =
    locale === "en"
      ? {
          solutions: "Solutions",
          viewAll: "View all solutions",
          useCases: "Key use cases",
          sectors: "Sectors we serve",
          viewAllClients: "View all our clients",
        }
      : {
          solutions: "Soluciones",
          viewAll: "Ver todas las soluciones",
          useCases: "Casos de uso clave",
          sectors: "Sectores que atendemos",
          viewAllClients: "Ver todos nuestros clientes",
        };

  return [
    {
      heading: t.solutions,
      items: [
        { title: t.viewAll, href: localizedHref(locale, "/#soluciones") },
        ...solutions.map((item) => ({
          title: item.title,
          desc: item.desc,
          href: localizedHref(locale, `/soluciones/${item.slug}`),
        })),
      ],
    },
    {
      heading: t.useCases,
      items: casosDeUso.map((item) => ({
        title: item.title,
        href: localizedHref(locale, `/soluciones/${item.slug}`),
      })),
    },
    {
      heading: t.sectors,
      items: [
        ...sectores.map(({ title, slug }) => ({
          title,
          href: localizedHref(locale, `/nosotros?sector=${slug}#casos`),
        })),
        {
          title: t.viewAllClients,
          href: localizedHref(locale, "/nosotros#casos"),
        },
      ],
    },
  ];
}

export function getNosotrosMenuColumns(locale = "es") {
  const t =
    locale === "en"
      ? {
          company: "The company",
          whoWeAre: "Who we are",
          ourStory: "Our story",
          missionVision: "Mission and vision",
          teamCulture: "Team and culture",
          ourTeam: "Our team",
          orgCulture: "Organizational culture",
          results: "Results and partnerships",
          topClients: "Our leading clients",
          partners: "Technology partners",
          certifications: "Certifications",
        }
      : {
          company: "La empresa",
          whoWeAre: "Quiénes somos",
          ourStory: "Nuestra historia",
          missionVision: "Misión y visión",
          teamCulture: "Equipo y cultura",
          ourTeam: "Nuestro equipo",
          orgCulture: "Cultura organizacional",
          results: "Resultados y alianzas",
          topClients: "Nuestros principales clientes",
          partners: "Aliados tecnológicos",
          certifications: "Certificados",
        };

  return [
    {
      heading: t.company,
      items: [
        { title: t.whoWeAre, href: localizedHref(locale, "/nosotros") },
        {
          title: t.ourStory,
          href: localizedHref(locale, "/nosotros#historia"),
        },
        {
          title: t.missionVision,
          href: localizedHref(locale, "/nosotros#mision-vision"),
        },
      ],
    },
    {
      heading: t.teamCulture,
      items: [
        { title: t.ourTeam, href: localizedHref(locale, "/equipo") },
        { title: t.orgCulture, href: localizedHref(locale, "/equipo#cultura") },
      ],
    },
    {
      heading: t.results,
      items: [
        { title: t.topClients, href: localizedHref(locale, "/nosotros#casos") },
        { title: t.partners, href: localizedHref(locale, "/#aliados") },
        { title: t.certifications, href: localizedHref(locale, "/novedades") },
      ],
    },
  ];
}

export function getBlogMenuColumns(locale = "es") {
  const articles = getArticles(locale);
  const news = getNews(locale);
  const t =
    locale === "en"
      ? {
          techBlog: "Technical blog",
          spectrumNews: "Spectrum news",
          explore: "Explore",
          viewBlog: "View the full blog",
          viewNews: "View all news",
          contact: "Contact",
        }
      : {
          techBlog: "Blog técnico",
          spectrumNews: "Novedades Spectrum",
          explore: "Explorar",
          viewBlog: "Ver todo el blog",
          viewNews: "Ver todas las novedades",
          contact: "Contacto",
        };

  return [
    {
      heading: t.techBlog,
      items: articles.map((article) => ({
        title: article.category,
        desc: article.title,
        href: localizedHref(locale, `/blog/${article.slug}`),
      })),
    },
    {
      heading: t.spectrumNews,
      items: news.map((item) => ({
        title: item.category,
        desc: item.title,
        href: localizedHref(locale, `/novedades/${item.slug}`),
      })),
    },
    {
      heading: t.explore,
      items: [
        { title: t.viewBlog, href: localizedHref(locale, "/#blog") },
        { title: t.viewNews, href: localizedHref(locale, "/novedades") },
        { title: t.contact, href: localizedHref(locale, "/#contacto") },
      ],
    },
  ];
}
