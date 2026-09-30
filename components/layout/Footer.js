"use client";

import { useState } from "react";
import Image from "next/image";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "../icons";
import { localizedHref } from "@/lib/i18n";
import { whatsappUrl } from "@/lib/contact";
import ContactModal from "../widgets/ContactModal";

const supportServiceName = { es: "Soporte técnico", en: "Technical support" };

const footerColumnsEs = [
  {
    title: "Empresa",
    links: [
      { label: "Nosotros", href: "/nosotros" },
      { label: "Casos de exito", href: "/nosotros#casos" },
      { label: "Blog", href: "#blog" },
      { label: "Trabaja con nosotros", href: "#" },
    ],
  },
  {
    title: "Soluciones",
    links: [
      { label: "Infraestructura tecnologica", href: "#soluciones" },
      { label: "Ciberseguridad", href: "#soluciones" },
      { label: "Conectividad", href: "#soluciones" },
      { label: "Servicios de TI", href: "#soluciones" },
      { label: "Desarrollo a la medida", href: "#soluciones" },
    ],
  },
  {
    title: "Soporte",
    links: [
      { label: "Mesa de ayuda", href: "#contacto" },
      { label: "SpectrIA", action: "support" },
      { label: "WhatsApp", href: "#contacto" },
    ],
  },
  {
    title: "Contacto",
    links: [
      { label: "soporte@spectrumt.co", href: "mailto:soporte@spectrumt.co" },
      { label: "WhatsApp", href: whatsappUrl(), external: true },
      { label: "Formulario", action: "form" },
    ],
  },
];

const footerColumnsEn = [
  {
    title: "Company",
    links: [
      { label: "About us", href: "/nosotros" },
      { label: "Success stories", href: "/en/nosotros#casos" },
      { label: "Blog", href: "#blog" },
      { label: "Work with us", href: "#" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Technology infrastructure", href: "#soluciones" },
      { label: "Cybersecurity", href: "#soluciones" },
      { label: "Connectivity", href: "#soluciones" },
      { label: "IT services", href: "#soluciones" },
      { label: "Custom development", href: "#soluciones" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help desk", href: "#contacto" },
      { label: "SpectrIA", action: "support" },
      { label: "WhatsApp", href: "#contacto" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "soporte@spectrumt.co", href: "mailto:soporte@spectrumt.co" },
      { label: "WhatsApp", href: whatsappUrl(), external: true },
      { label: "Form", action: "form" },
    ],
  },
];

const content = {
  es: {
    tagline:
      "Ecosistema tecnológico de infraestructura, ciberseguridad y conectividad. Future Powered.",
    rights: "© 2026 Spectrum. Todos los derechos reservados.",
    privacy: "Politica de privacidad",
    terms: "Terminos de uso",
  },
  en: {
    tagline:
      "A technology ecosystem of infrastructure, cybersecurity and connectivity. Future Powered.",
    rights: "© 2026 Spectrum. All rights reserved.",
    privacy: "Privacy policy",
    terms: "Terms of use",
  },
};

export default function Footer({ locale = "es" }) {
  const footerColumns = locale === "en" ? footerColumnsEn : footerColumnsEs;
  const t = content[locale] || content.es;
  const [formOpen, setFormOpen] = useState(false);

  return (
    <footer>
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <a href={localizedHref(locale, "/")} className="logo">
              <Image
                src="/logos/logo-spectrum.png"
                alt="Spectrum"
                width={837}
                height={136}
                className="logo-img"
              />
            </a>
            <p>{t.tagline}</p>
            <div className="social">
              <a
                href="https://www.linkedin.com/company/spectrum-technologyco/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <LinkedInIcon size={15} />
              </a>
              <a
                href="https://www.instagram.com/spectrumt.co"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <InstagramIcon size={15} />
              </a>
              <a
                href="https://www.facebook.com/people/Spectrum-Technology/61592216507649/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FacebookIcon size={15} />
              </a>
            </div>
          </div>
          {footerColumns.map((column) => (
            <div className="footer-col" key={column.title}>
              <h4>{column.title}</h4>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.action === "support" ? (
                      <button
                        type="button"
                        className="footer-link-btn"
                        onClick={() =>
                          window.dispatchEvent(new Event("spectria:support"))
                        }
                      >
                        {link.label}
                      </button>
                    ) : link.action === "form" ? (
                      <button
                        type="button"
                        className="footer-link-btn"
                        onClick={() => setFormOpen(true)}
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p>{t.rights}</p>
          <div className="footer-legal">
            <a href={localizedHref(locale, "/politica-de-datos")}>
              {t.privacy}
            </a>
            <a href="#">{t.terms}</a>
          </div>
        </div>
      </div>

      <ContactModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        serviceName={supportServiceName[locale] || supportServiceName.es}
        serviceSlug="soporte"
        locale={locale}
      />
    </footer>
  );
}
