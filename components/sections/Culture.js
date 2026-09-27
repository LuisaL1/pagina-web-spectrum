import { BsIcon } from "@/components/icons";

const valueIcons = [
  "people",
  "lightbulb",
  "headset",
  "mortarboard",
  "shield-check",
];

const valoresEs = [
  {
    title: "Colaboramos",
    desc: "Compartimos conocimiento para construir mejores soluciones.",
  },
  {
    title: "Innovamos",
    desc: "Exploramos nuevas tecnologías para anticiparnos a los desafíos.",
  },
  {
    title: "Respondemos",
    desc: "Asumimos como propios los retos de nuestros clientes.",
  },
  {
    title: "Aprendemos",
    desc: "Evolucionamos constantemente junto con la tecnología.",
  },
  {
    title: "Cuidamos",
    desc: "Trabajamos con precisión, responsabilidad y transparencia.",
  },
];

const valoresEn = [
  {
    title: "We collaborate",
    desc: "We share knowledge to build better solutions.",
  },
  {
    title: "We innovate",
    desc: "We explore new technologies to stay ahead of challenges.",
  },
  {
    title: "We respond",
    desc: "We take our clients' challenges as our own.",
  },
  {
    title: "We learn",
    desc: "We constantly evolve alongside technology.",
  },
  {
    title: "We care",
    desc: "We work with precision, accountability and transparency.",
  },
];

const content = {
  es: {
    eyebrow: "Cultura organizacional",
    heading: "Personas que transforman tecnología en posibilidades",
    lead: "En Spectrum creemos que la tecnología adquiere valor real cuando se construye con propósito. Nuestra cultura combina conocimiento, colaboración e innovación para transformar desafíos en soluciones que generan impacto.",
    bannerPrefix: "No solo desarrollamos ",
    bannerSpan: "tecnología",
    bannerSuffix:
      ". Construimos soluciones, conocimiento y relaciones que perduran.",
  },
  en: {
    eyebrow: "Organizational culture",
    heading: "People who turn technology into possibilities",
    lead: "At Spectrum, we believe technology gains real value when it's built with purpose. Our culture combines knowledge, collaboration and innovation to turn challenges into solutions that create impact.",
    bannerPrefix: "We don't just build ",
    bannerSpan: "technology",
    bannerSuffix:
      ". We build solutions, knowledge and relationships that last.",
  },
};

export default function Culture({ locale = "es" }) {
  const t = content[locale] || content.es;
  const valores = locale === "en" ? valoresEn : valoresEs;

  return (
    <>
      <section id="cultura" className="about-light about-light--white">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">{t.eyebrow}</p>
            <h2>{t.heading}</h2>
            <p>{t.lead}</p>
          </div>
          <div className="culture-values">
            {valores.map((valor, index) => {
              const icon = valueIcons[index];
              return (
                <div className="culture-value" key={valor.title}>
                  <span className="culture-icon">
                    <BsIcon name={icon} size={26} />
                  </span>
                  <h3>{valor.title}</h3>
                  <p>{valor.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="culture-banner">
        <div className="wrap">
          <span className="culture-quote-mark" aria-hidden="true">
            &ldquo;
          </span>
          <p>
            {t.bannerPrefix}
            <span>{t.bannerSpan}</span>
            {t.bannerSuffix}
          </p>
        </div>
      </section>
    </>
  );
}
