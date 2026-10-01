import Image from "next/image";
import Link from "next/link";
import InfoRequestForm from "@/components/widgets/InfoRequestForm";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { capabilityIconMap } from "@/components/icons/capability-icon-map";
import { solutionIcons } from "@/components/icons/solution-icons";
import { getSolutions } from "@/data/solutions-data";
import { localizedHref } from "@/lib/i18n";
import BackLink from "@/components/widgets/BackLink";

const content = {
  es: {
    backToSolutions: "Volver a soluciones",
    businessUnit: "Unidad de negocio",
    helpDesk: "Mesa de ayuda",
    whatIncludes: "Qué incluye",
    scope: "Alcance de la solución",
    whySpectrum: "Por qué Spectrum",
    valueHeading: "El valor de trabajar con Spectrum",
    related: "Otras soluciones",
    relatedHeading: "Explore el resto del ecosistema",
    more: "Conocer más",
  },
  en: {
    backToSolutions: "Back to solutions",
    businessUnit: "Business unit",
    helpDesk: "Help desk",
    whatIncludes: "What's included",
    scope: "Scope of the solution",
    whySpectrum: "Why Spectrum",
    valueHeading: "The value of working with Spectrum",
    related: "Other solutions",
    relatedHeading: "Explore the rest of the ecosystem",
    more: "Learn more",
  },
};

export default function SolutionView({ solution, locale = "es" }) {
  const lang = locale === "en" ? "en" : "es";
  const t = content[lang];
  const Icon = solutionIcons[solution.slug];
  const all = getSolutions(locale);
  const index = all.findIndex((item) => item.slug === solution.slug);
  const related = [1, 2, 3].map((step) => all[(index + step) % all.length]);
  const capCols = solution.capabilities.length % 4 === 0 ? 4 : 3;

  return (
    <>
      <section className="solution-hero">
        <Image
          src={solution.bg}
          alt=""
          fill
          priority
          sizes="100vw"
          className="solution-hero-bg"
        />
        <div className="wrap solution-hero-inner">
          <BackLink
            className="solution-back"
            href={localizedHref(locale, "/#soluciones")}
          >
            <ArrowRightIcon size={14} className="solution-back-icon" />
            {t.backToSolutions}
          </BackLink>
          <p className="eyebrow solution-eyebrow">
            {Icon && (
              <span className="solution-eyebrow-icon" aria-hidden="true">
                <Icon size={18} />
              </span>
            )}
            {t.businessUnit} {solution.icon}
          </p>
          <h1>{solution.title}</h1>
          <p className="solution-tagline">{solution.tagline}</p>
          <p className="solution-intro">{solution.intro}</p>
          <ul className="solution-highlights">
            {solution.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="solution-hero-actions">
            <a
              href="https://soporte.spectrumt.co"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              {t.helpDesk}
            </a>
            <InfoRequestForm
              serviceName={solution.title}
              serviceSlug={solution.slug}
              locale={locale}
            />
          </div>
        </div>
      </section>

      <section className="solution-scope">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">{t.whatIncludes}</p>
            <h2>{t.scope}</h2>
            <p>{solution.overview}</p>
          </div>
          <div className="scope-grid" style={{ "--cols": capCols }}>
            {solution.capabilities.map((item, i) => {
              const CapIcon = capabilityIconMap[item.icon];
              return (
                <article className="scope-card" key={item.title}>
                  <span className="scope-num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {CapIcon && (
                    <span className="scope-icon" aria-hidden="true">
                      <CapIcon size={26} />
                    </span>
                  )}
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="solution-value">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">{t.whySpectrum}</p>
            <h2>{t.valueHeading}</h2>
          </div>
          <ul className="value-cards">
            {solution.values.map((value) => (
              <li key={value}>
                <span className="value-check" aria-hidden="true">
                  <CheckIcon size={16} />
                </span>
                <span>{value}</span>
              </li>
            ))}
          </ul>

          <div className="solution-closing">
            <div className="solution-closing-text">
              <h3>{solution.closing.title}</h3>
              <p>{solution.closing.text}</p>
            </div>
            <div className="solution-closing-actions">
              <InfoRequestForm
                serviceName={solution.title}
                serviceSlug={solution.slug}
                locale={locale}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="solution-related">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">{t.related}</p>
            <h2>{t.relatedHeading}</h2>
          </div>
          <div className="related-grid">
            {related.map((item) => {
              const RelIcon = solutionIcons[item.slug];
              return (
                <article className="related-card" key={item.slug}>
                  <span className="related-num">{item.icon}</span>
                  {RelIcon && (
                    <span className="related-icon" aria-hidden="true">
                      <RelIcon size={30} />
                    </span>
                  )}
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <Link
                    className="related-link"
                    href={localizedHref(locale, `/soluciones/${item.slug}`)}
                  >
                    {t.more} <ArrowRightIcon size={14} />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
