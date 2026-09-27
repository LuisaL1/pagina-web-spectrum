"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  BuildingIcon,
  BugIcon,
  BroadcastIcon,
  ClockIcon,
  LockIcon,
  NodesIcon,
  ServerRackIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "../icons";
import { localizedHref } from "@/lib/i18n";

// solution = pagina de solucion relacionada a la que enlaza "Conocer la solucion".
const casesEs = [
  {
    name: "Alcaldía de Yumbo",
    tag: "Sector gobierno",
    sector: "gobierno",
    solution: "infraestructura-tecnologica",
    subtitle: "Continuidad operativa para servicios críticos",
    desc: "Implementamos una estrategia integral de ciberseguridad que permitió fortalecer la infraestructura, proteger la información crítica y asegurar la continuidad de los servicios para más de 120.000 ciudadanos.",
    bg: "/assets/images/alcaldiayumbo.webp",
    stats: [
      {
        icon: ShieldCheckIcon,
        title: "Mayor protección",
        desc: "de la infraestructura",
      },
      { icon: ClockIcon, title: "Operación segura", desc: "y disponible 24/7" },
      { icon: UsersIcon, title: "+120.000", desc: "ciudadanos beneficiados" },
    ],
  },
  {
    name: "Universidad Militar Nueva Granada",
    tag: "Sector educación",
    sector: "educacion",
    solution: "conectividad",
    subtitle: "Redes de alto rendimiento para un campus más seguro",
    desc: "Rediseño de la arquitectura de red y despliegue de controles de ciberseguridad perimetral en todas las sedes.",
    bg: "/assets/images/universidad-militar.jpg",
    stats: [
      { icon: NodesIcon, title: "Red rediseñada", desc: "de alto rendimiento" },
      {
        icon: ShieldCheckIcon,
        title: "Ciberseguridad perimetral",
        desc: "en todas las sedes",
      },
      {
        icon: BuildingIcon,
        title: "Campus más seguro",
        desc: "redes y seguridad integradas",
      },
    ],
  },
  {
    name: "Redeban",
    tag: "Sector financiero",
    sector: "financiero",
    solution: "infraestructura-tecnologica",
    subtitle: "Infraestructura crítica con disponibilidad garantizada",
    desc: "Monitoreo NOC y SOC 24/7 sobre la infraestructura que soporta transacciones a nivel nacional.",
    bg: "/assets/images/redeban.webp",
    stats: [
      { icon: ClockIcon, title: "Monitoreo 24/7", desc: "NOC y SOC continuos" },
      {
        icon: ServerRackIcon,
        title: "Infraestructura crítica",
        desc: "con disponibilidad garantizada",
      },
      {
        icon: BroadcastIcon,
        title: "Alcance nacional",
        desc: "transacciones en todo el país",
      },
    ],
  },
  {
    name: "Armada de Colombia",
    tag: "Sector defensa",
    sector: "defensa",
    solution: "ciberseguridad",
    subtitle: "Protección perimetral de infraestructura estratégica",
    desc: "Implementación de sistemas de detección y prevención de intrusos para blindar el perímetro digital.",
    bg: "/assets/images/armada-colombia.jpeg",
    stats: [
      {
        icon: ShieldCheckIcon,
        title: "Protección perimetral",
        desc: "del perímetro digital",
      },
      { icon: BugIcon, title: "Detección y prevención", desc: "de intrusos" },
      {
        icon: LockIcon,
        title: "Infraestructura estratégica",
        desc: "con perímetro blindado",
      },
    ],
  },
];

const casesEn = [
  {
    name: "Alcaldía de Yumbo",
    tag: "Government sector",
    sector: "gobierno",
    solution: "infraestructura-tecnologica",
    subtitle: "Operational continuity for critical services",
    desc: "We implemented a comprehensive cybersecurity strategy that strengthened the infrastructure, protected critical information and ensured service continuity for more than 120,000 citizens.",
    bg: "/assets/images/alcaldiayumbo.webp",
    stats: [
      {
        icon: ShieldCheckIcon,
        title: "Stronger protection",
        desc: "of the infrastructure",
      },
      { icon: ClockIcon, title: "Secure operation", desc: "available 24/7" },
      { icon: UsersIcon, title: "120,000+", desc: "citizens benefited" },
    ],
  },
  {
    name: "Universidad Militar Nueva Granada",
    tag: "Education sector",
    sector: "educacion",
    solution: "conectividad",
    subtitle: "High-performance networks for a safer campus",
    desc: "Redesign of the network architecture and deployment of perimeter cybersecurity controls across all campuses.",
    bg: "/assets/images/universidad-militar.jpg",
    stats: [
      {
        icon: NodesIcon,
        title: "Redesigned network",
        desc: "built for performance",
      },
      {
        icon: ShieldCheckIcon,
        title: "Perimeter cybersecurity",
        desc: "across all campuses",
      },
      {
        icon: BuildingIcon,
        title: "Safer campus",
        desc: "integrated networks and security",
      },
    ],
  },
  {
    name: "Redeban",
    tag: "Financial sector",
    sector: "financiero",
    solution: "infraestructura-tecnologica",
    subtitle: "Critical infrastructure with guaranteed availability",
    desc: "24/7 NOC and SOC monitoring over the infrastructure that supports nationwide transactions.",
    bg: "/assets/images/redeban.webp",
    stats: [
      {
        icon: ClockIcon,
        title: "24/7 monitoring",
        desc: "continuous NOC and SOC",
      },
      {
        icon: ServerRackIcon,
        title: "Critical infrastructure",
        desc: "with guaranteed availability",
      },
      {
        icon: BroadcastIcon,
        title: "Nationwide reach",
        desc: "transactions across the country",
      },
    ],
  },
  {
    name: "Colombian Navy",
    tag: "Defense sector",
    sector: "defensa",
    solution: "ciberseguridad",
    subtitle: "Perimeter protection for strategic infrastructure",
    desc: "Deployment of intrusion detection and prevention systems to shield the digital perimeter.",
    bg: "/assets/images/armada-colombia.jpeg",
    stats: [
      {
        icon: ShieldCheckIcon,
        title: "Perimeter protection",
        desc: "of the digital perimeter",
      },
      {
        icon: BugIcon,
        title: "Detection and prevention",
        desc: "of intrusions",
      },
      {
        icon: LockIcon,
        title: "Strategic infrastructure",
        desc: "with a shielded perimeter",
      },
    ],
  },
];

const content = {
  es: {
    eyebrow: "Nuestros principales clientes",
    heading: "Organizaciones que confían en Spectrum",
    lead: "Entidades públicas y privadas que fortalecieron su infraestructura y seguridad con nuestro acompañamiento.",
    ariaLabel: "Selector de casos de éxito",
    caseLabel: "Caso de éxito",
    cta: "Conocer la solución",
  },
  en: {
    eyebrow: "Our leading clients",
    heading: "Organizations that trust Spectrum",
    lead: "Public and private entities that strengthened their infrastructure and security with our support.",
    ariaLabel: "Success story selector",
    caseLabel: "Success story",
    cta: "Explore the solution",
  },
};

export default function Cases({ initialSector = null, locale = "es" }) {
  const cases = locale === "en" ? casesEn : casesEs;
  const t = content[locale] || content.es;
  const [activeIndex, setActiveIndex] = useState(() => {
    const index = cases.findIndex((item) => item.sector === initialSector);
    return index === -1 ? 0 : index;
  });
  const active = cases[activeIndex];
  const pad = (n) => String(n).padStart(2, "0");

  useEffect(() => {
    if (!initialSector) return;
    const index = cases.findIndex((item) => item.sector === initialSector);
    if (index !== -1) setActiveIndex(index);
  }, [initialSector, cases]);

  return (
    <section className="on-graphite" id="casos">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2>{t.heading}</h2>
          <p>{t.lead}</p>
        </div>

        <div className="case-stage">
          {cases.map((item, index) => (
            <Image
              key={item.bg}
              src={item.bg}
              alt={index === activeIndex ? item.name : ""}
              aria-hidden={index !== activeIndex}
              fill
              sizes="(max-width: 1240px) 100vw, 1240px"
              className={`case-stage-img${
                index === activeIndex ? " is-active" : ""
              }`}
            />
          ))}
          <span className="case-stage-shade" aria-hidden="true" />

          <div className="case-stage-body">
            <div className="case-info" key={active.name}>
              <span className="case-count" aria-hidden="true">
                {pad(activeIndex + 1)}
                <i>/ {pad(cases.length)}</i>
              </span>
              <p className="case-tag">
                {t.caseLabel} · {active.tag}
              </p>
              <h3>{active.name}</h3>
              <p className="case-subtitle">{active.subtitle}</p>
              <p className="case-desc">{active.desc}</p>
              <Link
                className="case-link"
                href={localizedHref(locale, `/soluciones/${active.solution}`)}
              >
                {t.cta} <ArrowRightIcon size={20} />
              </Link>
            </div>

            <ul className="case-stats" key={`stats-${active.name}`}>
              {active.stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <li className="case-stat" key={stat.title}>
                    <span className="case-stat-icon" aria-hidden="true">
                      <Icon size={34} />
                    </span>
                    <span className="case-stat-text">
                      <b>{stat.title}</b>
                      <span>{stat.desc}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="case-picker" role="group" aria-label={t.ariaLabel}>
            {cases.map((item, index) => (
              <button
                key={item.name}
                type="button"
                className={`case-pick${index === activeIndex ? " active" : ""}`}
                aria-pressed={index === activeIndex}
                onClick={() => setActiveIndex(index)}
              >
                <Image
                  src={item.bg}
                  alt=""
                  fill
                  sizes="(max-width: 980px) 50vw, 300px"
                  className="case-pick-img"
                />
                <span className="case-pick-num">{pad(index + 1)}</span>
                <span className="case-pick-name">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
