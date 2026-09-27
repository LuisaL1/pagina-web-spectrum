"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "../icons";
import { solutionIcons } from "../icons/solution-icons";
import { getSolutions } from "@/data/solutions-data";
import { localizedHref } from "@/lib/i18n";

const content = {
  es: {
    eyebrow: "Unidades de negocio",
    heading: "Soluciones para cada capa de su operación",
    lead: "Seis frentes complementarios que trabajan como un único sistema de infraestructura y protección.",
    more: "Conocer más",
    prev: "Ver unidad anterior",
    next: "Ver siguiente unidad",
    goTo: (title) => `Ir a la unidad ${title}`,
  },
  en: {
    eyebrow: "Business units",
    heading: "Solutions for every layer of your operation",
    lead: "Six complementary fronts that work as a single infrastructure and protection system.",
    more: "Learn more",
    prev: "View previous unit",
    next: "View next unit",
    goTo: (title) => `Go to ${title} unit`,
  },
};

function positionOf(index, active, total) {
  const offset = (index - active + total) % total;
  if (offset === 0) return "active";
  if (offset === 1) return "next";
  if (offset === total - 1) return "prev";
  return "hidden";
}

const SWIPE_THRESHOLD = 40;

export default function Solutions({ locale = "es" }) {
  const solutions = getSolutions(locale);
  const total = solutions.length;
  const t = content[locale] || content.es;
  const [active, setActive] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ startX: null, moved: false });

  function go(direction) {
    setActive((current) => (current + direction + total) % total);
  }

  // Arrastre con el dedo (o el mouse): la tarjeta sigue el gesto y, al soltar,
  // avanza o retrocede si el desplazamiento supera el umbral.
  function handlePointerDown(event) {
    drag.current = { startX: event.clientX, moved: false };
    setDragging(true);
  }

  function handlePointerMove(event) {
    if (drag.current.startX === null) return;
    const deltaX = event.clientX - drag.current.startX;
    if (Math.abs(deltaX) > 6) drag.current.moved = true;
    setDragX(Math.max(-120, Math.min(120, deltaX)));
  }

  function handlePointerEnd(event) {
    if (drag.current.startX === null) return;
    const deltaX = event.clientX - drag.current.startX;
    if (deltaX > SWIPE_THRESHOLD) go(-1);
    else if (deltaX < -SWIPE_THRESHOLD) go(1);
    drag.current.startX = null;
    setDragX(0);
    setDragging(false);
  }

  // Tras arrastrar no debe dispararse el clic de las tarjetas vecinas.
  function handleClickCapture(event) {
    if (!drag.current.moved) return;
    event.preventDefault();
    event.stopPropagation();
    drag.current.moved = false;
  }

  return (
    <section id="soluciones">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2>{t.heading}</h2>
          <p>{t.lead}</p>
        </div>
        <div className="units-carousel">
          <div
            className={`units-track${dragging ? " is-dragging" : ""}`}
            style={{ "--drag": `${dragX}px` }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            onPointerLeave={handlePointerEnd}
            onClickCapture={handleClickCapture}
          >
            <div className="units-slides">
              {solutions.map((unit, index) => {
                const position = positionOf(index, active, total);
                const Icon = solutionIcons[unit.slug];
                return (
                  <article
                    className={`unit-card is-${position}`}
                    key={unit.slug}
                    onClick={
                      position === "prev"
                        ? () => go(-1)
                        : position === "next"
                          ? () => go(1)
                          : undefined
                    }
                  >
                    <span className="unit-num" aria-hidden="true">
                      {unit.icon}
                    </span>
                    {Icon && (
                      <span className="unit-glyph" aria-hidden="true">
                        <Icon size={34} />
                      </span>
                    )}
                    <h3>{unit.title}</h3>
                    <p className="unit-desc">{unit.desc}</p>
                    <Link
                      className="more"
                      href={localizedHref(locale, `/soluciones/${unit.slug}`)}
                    >
                      {t.more} <ArrowRightIcon size={13} />
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="units-carousel-controls">
            <button
              type="button"
              className="carousel-btn carousel-btn--prev"
              aria-label={t.prev}
              onClick={() => go(-1)}
            >
              <ArrowRightIcon
                size={16}
                style={{ transform: "rotate(180deg)" }}
              />
            </button>
            <div className="units-carousel-dots">
              {solutions.map((unit, index) => (
                <button
                  key={unit.slug}
                  type="button"
                  className={`units-carousel-dot${index === active ? " active" : ""}`}
                  aria-label={t.goTo(unit.title)}
                  onClick={() => setActive(index)}
                />
              ))}
            </div>
            <button
              type="button"
              className="carousel-btn carousel-btn--next"
              aria-label={t.next}
              onClick={() => go(1)}
            >
              <ArrowRightIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
