import { BsIcon } from "@/components/icons";
import Image from "next/image";
import knowledgeBase from "@/data/knowledge-base.json";

const { mision, vision } = knowledgeBase.empresa;

const pillarIcons = ["hdd-network", "shield-check", "graph-up-arrow"];

const statIcons = ["clock-history", "diagram-3", "layers"];

const chipsEs = [
  { icon: "hdd-rack", label: "Infraestructura" },
  { icon: "shield-lock", label: "Ciberseguridad" },
  { icon: "broadcast", label: "Conectividad" },
  { icon: "cpu", label: "Inteligencia artificial" },
];

const chipsEn = [
  { icon: "hdd-rack", label: "Infrastructure" },
  { icon: "shield-lock", label: "Cybersecurity" },
  { icon: "broadcast", label: "Connectivity" },
  { icon: "cpu", label: "Artificial intelligence" },
];

const statsEs = [
  { value: "5", label: "años de historia" },
  { value: "+20", label: "aliados tecnológicos" },
  { value: "6", label: "frentes de soluciones" },
];

const statsEn = [
  { value: "5", label: "years of history" },
  { value: "+20", label: "technology partners" },
  { value: "6", label: "solution fronts" },
];

const pillarsEs = [
  {
    num: "01",
    title: "Conexión inteligente",
    desc: "Integramos infraestructura, redes y seguridad en una sola arquitectura, eliminando puntos ciegos entre sistemas.",
  },
  {
    num: "02",
    title: "Seguridad integral",
    desc: "Monitoreo continuo, análisis de vulnerabilidades y respuesta a incidentes para una operación siempre protegida.",
  },
  {
    num: "03",
    title: "Evolución constante",
    desc: "Arquitecturas modulares y escalables, listas para incorporar nuevos servicios sin perder coherencia ni control.",
  },
];

const pillarsEn = [
  {
    num: "01",
    title: "Smart connection",
    desc: "We integrate infrastructure, networks and security into a single architecture, eliminating blind spots between systems.",
  },
  {
    num: "02",
    title: "Comprehensive security",
    desc: "Continuous monitoring, vulnerability analysis and incident response for an operation that's always protected.",
  },
  {
    num: "03",
    title: "Constant evolution",
    desc: "Modular, scalable architectures, ready to incorporate new services without losing coherence or control.",
  },
];

const historiaEtapasEs = [
  {
    num: "01",
    title: "Origen",
    desc: "Iniciamos ofreciendo servicios administrados de TI, sentando las bases del ecosistema que hoy es Spectrum.",
  },
  {
    num: "02",
    title: "Transformación",
    desc: "Acompañamos a industrias tradicionales en su proceso de digitalización, integrando infraestructura y seguridad como un mismo frente.",
  },
  {
    num: "03",
    title: "Crecimiento e innovación",
    desc: "Desarrollamos soluciones personalizadas para necesidades específicas, ampliando nuestras capacidades en ciberseguridad, conectividad e IA.",
  },
  {
    num: "04",
    title: "Expansión",
    desc: "Llegamos a nuevos mercados y sectores emergentes, llevando nuestro modelo de ecosistema integrado a más organizaciones.",
  },
  {
    num: "05",
    title: "Mejoramiento continuo",
    desc: "Seguimos evolucionando para consolidarnos como un aliado tecnológico de referencia en la región.",
  },
];

const historiaEtapasEn = [
  {
    num: "01",
    title: "Origin",
    desc: "We started by offering managed IT services, laying the foundations of the ecosystem that Spectrum is today.",
  },
  {
    num: "02",
    title: "Transformation",
    desc: "We supported traditional industries through their digitalization process, integrating infrastructure and security as a single front.",
  },
  {
    num: "03",
    title: "Growth and innovation",
    desc: "We developed customized solutions for specific needs, expanding our capabilities in cybersecurity, connectivity and AI.",
  },
  {
    num: "04",
    title: "Expansion",
    desc: "We reached new markets and emerging sectors, bringing our integrated ecosystem model to more organizations.",
  },
  {
    num: "05",
    title: "Continuous improvement",
    desc: "We keep evolving to establish ourselves as a leading technology partner in the region.",
  },
];

const content = {
  es: {
    tagline: "All systems. One future.",
    heading: "Un ecosistema, no piezas aisladas",
    lead: "Todo lo que construimos comparte un mismo lenguaje, una misma lógica y una misma dirección: sistemas preparados para evolucionar.",
    imageAlt: "Infraestructura tecnológica de Spectrum",
    pillarsEyebrow: "Nuestro enfoque",
    pillarsHeading: "Tres ideas que guían cada proyecto",
    historiaEyebrow: "Nuestra historia",
    historiaHeading: "Cinco etapas de un mismo propósito",
    mision: "Misión",
    vision: "Visión",
    misionText: mision,
    visionText: vision,
  },
  en: {
    tagline: "All systems. One future.",
    heading: "One ecosystem, not isolated pieces",
    lead: "Everything we build shares the same language, the same logic and the same direction: systems built to evolve.",
    imageAlt: "Spectrum technology infrastructure",
    pillarsEyebrow: "Our approach",
    pillarsHeading: "Three ideas behind every project",
    historiaEyebrow: "Our story",
    historiaHeading: "Five stages, one purpose",
    mision: "Mission",
    vision: "Vision",
    misionText:
      "Connect, protect and empower our clients' technology operations through an integrated ecosystem of infrastructure, cybersecurity, connectivity and artificial intelligence, with close, responsible service from start to finish.",
    visionText:
      "To be the leading technology partner in Latin America for public and private organizations seeking to modernize their infrastructure without sacrificing security or operational continuity.",
  },
};

export default function Ecosystem({ locale = "es" }) {
  const t = content[locale] || content.es;
  const pillars = locale === "en" ? pillarsEn : pillarsEs;
  const historiaEtapas = locale === "en" ? historiaEtapasEn : historiaEtapasEs;
  const stats = locale === "en" ? statsEn : statsEs;
  const chips = locale === "en" ? chipsEn : chipsEs;

  return (
    <>
      <section className="about-hero about-light">
        <div className="wrap about-hero-grid">
          <div className="about-hero-copy">
            <p className="eyebrow">{t.tagline}</p>
            <h1>{t.heading}</h1>
            <p className="about-hero-lead">{t.lead}</p>
            <ul className="about-stats">
              {stats.map((stat, index) => {
                const icon = statIcons[index];
                return (
                  <li key={stat.label}>
                    <span className="about-stat-icon">
                      <BsIcon name={icon} size={20} />
                    </span>
                    <b>{stat.value}</b>
                    <span className="about-stat-label">{stat.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="about-hero-visual">
            <span className="about-hero-shape" aria-hidden="true" />
            <span className="about-hero-dots" aria-hidden="true" />
            <div className="about-hero-media">
              <Image
                src="/fondos/fondo-infra.jpg"
                alt={t.imageAlt}
                fill
                sizes="(max-width: 980px) 100vw, 520px"
                priority
              />
              <span className="about-hero-badge">Future Powered</span>
            </div>
            <ul className="about-chips" aria-hidden="true">
              {chips.map(({ icon, label }) => (
                <li key={label}>
                  <BsIcon name={icon} size={16} />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="about-pillars about-light">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">{t.pillarsEyebrow}</p>
            <h2>{t.pillarsHeading}</h2>
          </div>
          <div className="pillars">
            {pillars.map((pillar, index) => {
              const icon = pillarIcons[index];
              return (
                <div className="pillar" key={pillar.num}>
                  <span className="pillar-ghost" aria-hidden="true">
                    {pillar.num}
                  </span>
                  <span className="pillar-icon">
                    <BsIcon name={icon} size={26} />
                  </span>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="historia" className="about-history about-light">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">{t.historiaEyebrow}</p>
            <h2>{t.historiaHeading}</h2>
          </div>
          <ol className="historia-track">
            {historiaEtapas.map((etapa) => (
              <li className="historia-item" key={etapa.num}>
                <span className="historia-node">{etapa.num}</span>
                <h3>{etapa.title}</h3>
                <p>{etapa.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="about-mv" id="mision-vision">
        <div className="wrap about-grid">
          <article className="mv-card">
            <span className="mv-icon">
              <BsIcon name="bullseye" size={28} />
            </span>
            <h2>{t.mision}</h2>
            <p>{t.misionText}</p>
          </article>
          <article className="mv-card">
            <span className="mv-icon">
              <BsIcon name="eye" size={28} />
            </span>
            <h2>{t.vision}</h2>
            <p>{t.visionText}</p>
          </article>
        </div>
      </section>
    </>
  );
}
