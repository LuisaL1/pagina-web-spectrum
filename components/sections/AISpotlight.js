import Link from "next/link";
import Image from "next/image";
import InfoRequestForm from "@/components/widgets/InfoRequestForm";
import AIHighlightsCarousel from "./AIHighlightsCarousel";
import { localizedHref } from "@/lib/i18n";

const content = {
  es: {
    imageAlt:
      "Cabeza con chip de inteligencia artificial rodeada de automatización, análisis, rapidez y seguridad",
    heading: "Transforma tus ideas en soluciones",
    headingEm: "inteligentes",
    lead: "Ofrecemos soluciones de inteligencia artificial diseñadas para ayudarte a crecer, optimizar procesos y tomar decisiones más inteligentes. Nuestra tecnología combina machine learning, análisis predictivo y automatización para convertir datos en resultados reales.",
    cta: "Conocer la solución completa",
    serviceName: "Inteligencia Artificial",
  },
  en: {
    imageAlt:
      "Head with an artificial intelligence chip surrounded by automation, analysis, speed and security",
    heading: "Turn your ideas into",
    headingEm: "intelligent",
    lead: "We offer artificial intelligence solutions designed to help you grow, optimize processes and make smarter decisions. Our technology combines machine learning, predictive analytics and automation to turn data into real results.",
    cta: "See the full solution",
    serviceName: "Artificial Intelligence",
  },
};

// Posicion (% del ancho/alto de AI-imagen.png, 1920x1080) del centro de cada
// circulo del dibujo. Si se reemplaza la imagen hay que recalcularlas.
const hotspots = [
  {
    id: "automation",
    x: 49.64,
    y: 14.26,
    place: "below",
    es: {
      title: "Automatización",
      desc: "Automatiza tareas repetitivas y flujos de trabajo para ahorrar tiempo y reducir costos.",
    },
    en: {
      title: "Automation",
      desc: "Automate repetitive tasks and workflows to save time and cut costs.",
    },
  },
  {
    id: "analytics",
    x: 29.58,
    y: 46.11,
    place: "below",
    es: {
      title: "Análisis",
      desc: "Descubre patrones ocultos en tus datos y conviértelos en decisiones.",
    },
    en: {
      title: "Analytics",
      desc: "Uncover hidden patterns in your data and turn them into decisions.",
    },
  },
  {
    id: "speed",
    x: 70.42,
    y: 46.11,
    place: "below",
    es: {
      title: "Rapidez",
      desc: "Respuestas y procesos en segundos: agiliza tu operación y la atención a tus clientes.",
    },
    en: {
      title: "Speed",
      desc: "Answers and processes in seconds: speed up your operations and customer service.",
    },
  },
  {
    id: "security",
    x: 50.47,
    y: 85.74,
    place: "above",
    es: {
      title: "Seguridad",
      desc: "Detecta amenazas y comportamientos anómalos de forma anticipada para proteger tu negocio.",
    },
    en: {
      title: "Security",
      desc: "Detect threats and anomalous behavior early to protect your business.",
    },
  },
];

export default function AISpotlight({ locale = "es" }) {
  const t = content[locale] || content.es;
  const lang = locale === "en" ? "en" : "es";

  return (
    <section className="ai-spotlight">
      <div className="ai-spotlight-robot-wrap">
        <div className="ai-illustration">
          <Image
            src="/fondos/AI-imagen.png"
            alt={t.imageAlt}
            fill
            sizes="100vw"
            quality={90}
            className="ai-spotlight-robot"
          />
          {hotspots.map((h) => (
            <div
              key={h.id}
              className={`ai-hotspot ai-hotspot--${h.place}`}
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
            >
              <button
                type="button"
                className="ai-hotspot-btn"
                aria-label={h[lang].title}
                aria-describedby={`ai-tip-${h.id}`}
              />
              <div
                role="tooltip"
                id={`ai-tip-${h.id}`}
                className="ai-hotspot-tip"
              >
                <strong>{h[lang].title}</strong>
                <span>{h[lang].desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="wrap ai-spotlight-inner">
        <div className="ai-spotlight-content">
          <p className="ai-wordmark">
            <span>AI</span> Spectrum
          </p>
          <h2>
            {locale === "en" ? (
              <>
                {t.heading} <em>{t.headingEm}</em> solutions
              </>
            ) : (
              <>
                {t.heading} <em>{t.headingEm}</em>
              </>
            )}
          </h2>
          <p className="ai-spotlight-lead">{t.lead}</p>
          <AIHighlightsCarousel locale={locale} />
          <div className="ai-spotlight-actions">
            <Link
              href={localizedHref(
                locale,
                "/soluciones/inteligencia-artificial",
              )}
              className="btn btn-primary"
            >
              {t.cta}
            </Link>
            <InfoRequestForm
              serviceName={t.serviceName}
              serviceSlug="inteligencia-artificial"
              locale={locale}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
