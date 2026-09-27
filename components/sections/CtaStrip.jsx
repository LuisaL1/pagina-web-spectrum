import Image from "next/image";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { whatsappUrl } from "@/lib/contact";

const content = {
  es: {
    eyebrow: "Nuestro enfoque",
    approachTitle: "Tecnología con propósito.",
    approachText:
      "Integramos infraestructura, seguridad, conectividad e inteligencia para diseñar ecosistemas tecnológicos robustos, resilientes y preparados para el futuro.",
    points: [
      "Soluciones a la medida de cada organización.",
      "Acompañamiento experto en cada etapa del proyecto.",
      "Operación segura, eficiente y disponible 24/7.",
    ],
    imageAlt:
      "Manos de un especialista trabajando en un portátil con código en pantalla",
    heading: "¿Listo para transformar tu organización?",
    lead: "Conversemos sobre cómo podemos ayudarte a alcanzar tus objetivos tecnológicos.",
    cta: "Hablemos",
  },
  en: {
    eyebrow: "Our approach",
    approachTitle: "Technology with purpose.",
    approachText:
      "We integrate infrastructure, security, connectivity and intelligence to design robust, resilient technology ecosystems that are ready for the future.",
    points: [
      "Solutions tailored to each organization.",
      "Expert support at every stage of the project.",
      "Secure, efficient operation available 24/7.",
    ],
    imageAlt: "Hands of a specialist working on a laptop with code on screen",
    heading: "Ready to transform your organization?",
    lead: "Let's talk about how we can help you reach your technology goals.",
    cta: "Let's talk",
  },
};

export default function CtaStrip({ locale = "es" }) {
  const t = content[locale] || content.es;

  return (
    <>
      <section className="approach" id="enfoque">
        <div className="wrap approach-grid">
          <div className="approach-photo">
            <Image
              src="/fondos/fondo-ciber.jpg"
              alt={t.imageAlt}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
          <div className="approach-text">
            <p className="approach-eyebrow">{t.eyebrow}</p>
            <h2>{t.approachTitle}</h2>
            <p className="approach-lead">{t.approachText}</p>
            <ul className="approach-points">
              {t.points.map((point) => (
                <li key={point}>
                  <span className="approach-check" aria-hidden="true">
                    <CheckIcon size={13} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="cta-strip" id="contacto">
        <div className="wrap">
          <div className="cta-strip-text">
            <h2>{t.heading}</h2>
            <p>{t.lead}</p>
          </div>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary cta-strip-btn"
          >
            {t.cta}
            <ArrowRightIcon size={16} />
          </a>
        </div>
      </section>
    </>
  );
}
