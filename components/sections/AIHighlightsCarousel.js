"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon } from "@/components/icons";

const highlightsEs = [
  {
    num: "01",
    title: "Automatización de tareas",
    desc: "Ahorra tiempo y reduce costos.",
  },
  {
    num: "02",
    title: "Análisis avanzado",
    desc: "Descubre patrones ocultos en tus datos.",
  },
  {
    num: "03",
    title: "Experiencias personalizadas",
    desc: "Mejora la relación con tus clientes.",
  },
  {
    num: "04",
    title: "Seguridad inteligente",
    desc: "Protege tu negocio con sistemas de detección avanzada.",
  },
];

const highlightsEn = [
  {
    num: "01",
    title: "Task automation",
    desc: "Save time and cut costs.",
  },
  {
    num: "02",
    title: "Advanced analytics",
    desc: "Uncover hidden patterns in your data.",
  },
  {
    num: "03",
    title: "Personalized experiences",
    desc: "Strengthen the relationship with your customers.",
  },
  {
    num: "04",
    title: "Intelligent security",
    desc: "Protect your business with advanced detection systems.",
  },
];

const labels = {
  es: {
    prev: "Ver highlight anterior",
    next: "Ver siguiente highlight",
    goTo: (title) => `Ir al highlight ${title}`,
  },
  en: {
    prev: "View previous highlight",
    next: "View next highlight",
    goTo: (title) => `Go to ${title} highlight`,
  },
};

const total = highlightsEs.length;

function positionOf(index, active) {
  const offset = (index - active + total) % total;
  if (offset === 0) return "active";
  if (offset === 1) return "next";
  if (offset === total - 1) return "prev";
  return "hidden";
}

const SWIPE_THRESHOLD = 40;
const AUTOPLAY_DELAY = 5000;

export default function AIHighlightsCarousel({ locale = "es" }) {
  const highlights = locale === "en" ? highlightsEn : highlightsEs;
  const l = labels[locale] || labels.es;
  const [active, setActive] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const drag = useRef({ startX: null, moved: false });

  function go(direction) {
    setActive((current) => (current + direction + total) % total);
  }

  // Avanza sola cada pocos segundos; se detiene al arrastrar, al pasar el
  // mouse/foco por encima, o si el usuario prefiere menos movimiento.
  useEffect(() => {
    if (dragging || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const id = setInterval(() => go(1), AUTOPLAY_DELAY);
    return () => clearInterval(id);
  }, [active, dragging, paused]);

  // Arrastre con el dedo (o el mouse): las tarjetas siguen el gesto.
  function handlePointerDown(event) {
    drag.current = { startX: event.clientX, moved: false };
    setDragging(true);
  }

  function handlePointerMove(event) {
    if (drag.current.startX === null) return;
    const deltaX = event.clientX - drag.current.startX;
    if (Math.abs(deltaX) > 6) drag.current.moved = true;
    setDragX(Math.max(-100, Math.min(100, deltaX)));
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

  function handleClickCapture(event) {
    if (!drag.current.moved) return;
    event.preventDefault();
    event.stopPropagation();
    drag.current.moved = false;
  }

  return (
    <div
      className="ai-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className={`ai-carousel-track${dragging ? " is-dragging" : ""}`}
        style={{ "--drag": `${dragX}px` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onPointerLeave={handlePointerEnd}
        onClickCapture={handleClickCapture}
      >
        <div className="ai-carousel-slides">
          {highlights.map((item, index) => {
            const position = positionOf(index, active);
            return (
              <div
                className={`ai-carousel-card is-${position}`}
                key={item.num}
                onClick={
                  position === "prev"
                    ? () => go(-1)
                    : position === "next"
                      ? () => go(1)
                      : undefined
                }
              >
                <p className="num">{item.num}</p>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="ai-carousel-controls">
        <button
          type="button"
          className="ai-carousel-btn"
          aria-label={l.prev}
          onClick={() => go(-1)}
        >
          <ArrowRightIcon size={16} style={{ transform: "rotate(180deg)" }} />
        </button>
        <div className="ai-carousel-dots">
          {highlights.map((item, index) => (
            <button
              key={item.num}
              type="button"
              className={`ai-carousel-dot${index === active ? " active" : ""}`}
              aria-label={l.goTo(item.title)}
              onClick={() => setActive(index)}
            />
          ))}
        </div>
        <button
          type="button"
          className="ai-carousel-btn"
          aria-label={l.next}
          onClick={() => go(1)}
        >
          <ArrowRightIcon size={16} />
        </button>
      </div>
    </div>
  );
}
