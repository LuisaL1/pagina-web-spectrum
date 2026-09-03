const content = {
  es: {
    eyebrow: "Future Powered",
    titleLine1: "Sistemas conectados",
    titleLine2Prefix: "para un ",
    titleEm: "futuro",
    titleLine2Suffix: " seguro",
    lead: "Infraestructura tecnológica y ciberseguridad diseñadas como un mismo ecosistema: conectamos, protegemos y potenciamos la operación de su organización.",
    helpDesk: "Mesa de ayuda",
    downloadPortfolio: "Descargar portafolio",
  },
  en: {
    eyebrow: "Future Powered",
    titleLine1: "Connected systems",
    titleLine2Prefix: "for a ",
    titleEm: "secure",
    titleLine2Suffix: " future",
    lead: "Technology infrastructure and cybersecurity designed as a single ecosystem: we connect, protect and power your organization's operation.",
    helpDesk: "Help desk",
    downloadPortfolio: "Download portfolio",
  },
};

export default function Hero({ locale = "es" }) {
  const t = content[locale] || content.es;

  return (
    <section className="hero">
      <video
        className="hero-bg-video"
        src="/fondos/fondo-hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="hero-content">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>
          {t.titleLine1}
          <br />
          {t.titleLine2Prefix}
          <em>{t.titleEm}</em>
          {t.titleLine2Suffix}
        </h1>
        <p className="lead">{t.lead}</p>
        <div className="hero-actions">
          <a
            href="https://soporte.spectrumt.co"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            {t.helpDesk}
          </a>
          <a
            href="/recursos/portafolio/Brochure%20Spectrum_CVD.pdf"
            download
            className="btn btn-outline"
          >
            {t.downloadPortfolio}
          </a>
        </div>
      </div>
    </section>
  );
}
