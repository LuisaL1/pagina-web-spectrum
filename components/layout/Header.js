"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CaretIcon, HeadsetIcon } from "../icons";
import {
  getSolutionsMenuColumns,
  getNosotrosMenuColumns,
  getBlogMenuColumns,
} from "@/data/nav-menu-data";
import SearchModal from "../widgets/SearchModal";

const content = {
  es: {
    nosotros: "Nosotros",
    soluciones: "Soluciones",
    casos: "Casos de exito",
    blog: "Blog",
    contacto: "Contacto",
    servicios: "Servicios",
    soporte: "Soporte",
    helpDesk: "Mesa de ayuda",
    openMenu: "Abrir menu",
    closeMenu: "Cerrar menu",
    langLabel: "Selector de idioma",
  },
  en: {
    nosotros: "About us",
    soluciones: "Solutions",
    casos: "Success stories",
    blog: "Blog",
    contacto: "Contact",
    servicios: "Services",
    soporte: "Support",
    helpDesk: "Help desk",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    langLabel: "Language selector",
  },
};

function MegaMenu({ id, columns, onLinkClick }) {
  return (
    <div className="mega-menu" id={id}>
      <div className="wrap mega-menu-inner">
        {columns.map((column) => (
          <div className="mega-menu-col" key={column.heading}>
            <h4>{column.heading}</h4>
            {column.items.map((item) => (
              <Link
                key={`${item.href}-${item.title}`}
                href={item.href}
                onClick={onLinkClick}
              >
                <strong>{item.title}</strong>
                {item.desc && <small>{item.desc}</small>}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Header({ locale = "es" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const t = content[locale] || content.es;
  const navLinks = [
    {
      href: locale === "en" ? "/en/#contacto" : "/#contacto",
      label: t.contacto,
      id: "contacto",
    },
  ];
  const nosotrosMenuColumns = getNosotrosMenuColumns(locale);
  const solutionsMenuColumns = getSolutionsMenuColumns(locale);
  const blogMenuColumns = getBlogMenuColumns(locale);

  const pathWithoutLocale = pathname.startsWith("/en")
    ? pathname.slice(3) || "/"
    : pathname;
  const esHref = pathWithoutLocale;
  const enHref = pathWithoutLocale === "/" ? "/en" : `/en${pathWithoutLocale}`;

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
  };

  // La barra superior se oculta al bajar; histeresis para evitar parpadeos.
  useEffect(() => {
    const onScroll = () =>
      setScrolled((prev) => (prev ? window.scrollY > 10 : window.scrollY > 80));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleKeydown(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setOpenDropdown(null);
      }
    }
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    if (!openDropdown) return undefined;
    function handleClickOutside(event) {
      if (!event.target.closest(".nav-item")) setOpenDropdown(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    document.body.classList.toggle("nav-open", menuOpen);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("nav-open");
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;

    const sections = document.querySelectorAll("main section[id]");
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header className={`main-nav${scrolled ? " is-scrolled" : ""}`}>
        <div className="top-bar">
          <div className="wrap top-bar-inner">
            <div className="top-bar-links">
              <a href="mailto:soporte@spectrumt.co">soporte@spectrumt.co</a>
              <a href={locale === "en" ? "/en/#soluciones" : "/#soluciones"}>
                {t.servicios}
              </a>
              <button
                type="button"
                className="top-bar-support"
                onClick={() =>
                  window.dispatchEvent(new Event("spectria:support"))
                }
              >
                <HeadsetIcon size={14} />
                {t.soporte}
              </button>
            </div>
          </div>
        </div>
        <div className="wrap nav-row">
          <Link href={locale === "en" ? "/en" : "/"} className="logo">
            <Image
              src="/logos/logo-spectrum.png"
              alt="Spectrum"
              width={837}
              height={136}
              className="logo-img"
              priority
            />
          </Link>

          {menuOpen && (
            <div
              className="nav-backdrop"
              aria-hidden="true"
              onClick={closeMenu}
            />
          )}

          <nav
            className={`primary${menuOpen ? " is-open" : ""}`}
            id="menu-principal"
            aria-label="Principal"
          >
            <div className="nav-mobile-utilities">
              <SearchModal inline locale={locale} />
            </div>
            <ul>
              <li
                className={`nav-item${openDropdown === "nosotros" ? " dropdown-open" : ""}`}
              >
                <button
                  className="top-link"
                  type="button"
                  aria-expanded={openDropdown === "nosotros"}
                  aria-controls="dropdown-nosotros"
                  onClick={() =>
                    setOpenDropdown((open) =>
                      open === "nosotros" ? null : "nosotros",
                    )
                  }
                >
                  <span className="top-link-label">{t.nosotros}</span>
                  <CaretIcon className="caret" size={14} />
                </button>
                <MegaMenu
                  id="dropdown-nosotros"
                  columns={nosotrosMenuColumns}
                  onLinkClick={closeMenu}
                />
              </li>
              <li
                className={`nav-item${openDropdown === "soluciones" ? " dropdown-open" : ""}`}
              >
                <button
                  className="top-link"
                  type="button"
                  aria-expanded={openDropdown === "soluciones"}
                  aria-controls="dropdown-soluciones"
                  onClick={() =>
                    setOpenDropdown((open) =>
                      open === "soluciones" ? null : "soluciones",
                    )
                  }
                >
                  <span className="top-link-label">{t.soluciones}</span>
                  <CaretIcon className="caret" size={14} />
                </button>
                <MegaMenu
                  id="dropdown-soluciones"
                  columns={solutionsMenuColumns}
                  onLinkClick={closeMenu}
                />
              </li>
              <li className="nav-item" key="casos">
                <Link
                  className="top-link"
                  href={
                    locale === "en" ? "/en/nosotros#casos" : "/nosotros#casos"
                  }
                  aria-current={activeId === "casos" ? "true" : undefined}
                  onClick={closeMenu}
                >
                  <span className="top-link-label">{t.casos}</span>
                </Link>
              </li>
              <li
                className={`nav-item${openDropdown === "blog" ? " dropdown-open" : ""}`}
              >
                <button
                  className="top-link"
                  type="button"
                  aria-expanded={openDropdown === "blog"}
                  aria-controls="dropdown-blog"
                  onClick={() =>
                    setOpenDropdown((open) => (open === "blog" ? null : "blog"))
                  }
                >
                  <span className="top-link-label">{t.blog}</span>
                  <CaretIcon className="caret" size={14} />
                </button>
                <MegaMenu
                  id="dropdown-blog"
                  columns={blogMenuColumns}
                  onLinkClick={closeMenu}
                />
              </li>
              {navLinks.map((link) => (
                <li className="nav-item" key={link.href}>
                  <Link
                    className="top-link"
                    href={link.href}
                    aria-current={activeId === link.id ? "true" : undefined}
                    onClick={closeMenu}
                  >
                    <span className="top-link-label">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href="https://soporte.spectrumt.co"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary nav-mobile-cta"
              onClick={closeMenu}
            >
              {t.helpDesk}
            </a>
          </nav>

          <div className="nav-cta">
            <div className="lang-switch" aria-label={t.langLabel}>
              <Link href={esHref} className={locale === "es" ? "active" : ""}>
                ES
              </Link>
              |
              <Link href={enHref} className={locale === "en" ? "active" : ""}>
                EN
              </Link>
            </div>
            <SearchModal locale={locale} />
            <a
              href="https://soporte.spectrumt.co"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              {t.helpDesk}
            </a>
            <button
              className={`mobile-toggle${menuOpen ? " is-open" : ""}`}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="menu-principal"
              aria-label={menuOpen ? t.closeMenu : t.openMenu}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="burger" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
