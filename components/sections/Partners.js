"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";

// Logos en /logos/aliados/bw: versiones monocromas, recortadas al contenido y
// escaladas para que todas tengan el mismo peso visual (w x h = tamano en px
// a 1x; el archivo esta a 2x). Se muestran en este orden, 6 por pagina.
const partners = [
  { name: "Microsoft", logo: "microsoft.png", w: 75, h: 54 },
  { name: "AWS", logo: "aws.png", w: 90, h: 54 },
  { name: "Fortinet", logo: "fortinet.png", w: 68, h: 54 },
  { name: "CrowdStrike", logo: "crowdstrike.png", w: 118, h: 53 },
  { name: "IBM", logo: "ibm.png", w: 124, h: 50 },
  { name: "Veeam", logo: "veeam.png", w: 143, h: 43 },
  { name: "Google Cloud", logo: "google-cloud.png", w: 86, h: 54 },
  { name: "Nutanix", logo: "nutanix.png", w: 64, h: 54 },
  { name: "Check Point", logo: "check-point.png", w: 118, h: 53 },
  { name: "HP", logo: "hp.png", w: 54, h: 54 },
  { name: "Lenovo", logo: "lenovo.png", w: 170, h: 34 },
  { name: "Broadcom", logo: "broadcom.png", w: 87, h: 54 },
  { name: "Hitachi", logo: "hitachi.png", w: 170, h: 29 },
  { name: "SentinelOne", logo: "sentinelone.png", w: 95, h: 54 },
  { name: "TrendAI", logo: "trend-ai.png", w: 154, h: 40 },
  { name: "Zoho", logo: "zoho.png", w: 121, h: 51 },
  { name: "Adobe", logo: "adobe.png", w: 153, h: 40 },
  { name: "Aruba", logo: "aruba.png", w: 156, h: 40 },
  { name: "Aranda", logo: "aranda.png", w: 126, h: 49 },
  { name: "Pentera", logo: "pentera.png", w: 42, h: 54 },
  { name: "ExaGrid", logo: "exagrid.png", w: 170, h: 34 },
  { name: "Extreme Networks", logo: "extreme.png", w: 159, h: 39 },
  { name: "KELA", logo: "kela.png", w: 157, h: 40 },
];

const content = {
  es: {
    title: "Tecnología respaldada por líderes de la industria",
    goTo: (n) => `Ir al grupo de aliados ${n}`,
  },
  en: {
    title: "Technology backed by industry leaders",
    goTo: (n) => `Go to partners group ${n}`,
  },
};

const QUERIES = ["(max-width: 560px)", "(max-width: 980px)"];

function subscribe(callback) {
  const lists = QUERIES.map((q) => window.matchMedia(q));
  lists.forEach((list) => list.addEventListener("change", callback));
  return () =>
    lists.forEach((list) => list.removeEventListener("change", callback));
}

function getPerPage() {
  if (window.matchMedia(QUERIES[0]).matches) return 3;
  if (window.matchMedia(QUERIES[1]).matches) return 4;
  return 6;
}

const SWIPE_THRESHOLD = 40;

export default function Partners({ locale = "es" }) {
  const t = content[locale] || content.es;
  const perPage = useSyncExternalStore(subscribe, getPerPage, () => 6);
  const pages = Math.ceil(partners.length / perPage);
  const [page, setPage] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(null);
  const current = Math.min(page, pages - 1);

  function go(direction) {
    setPage((current + direction + pages) % pages);
  }

  // Arrastre con el dedo (o el mouse): el carrusel sigue el gesto.
  function handlePointerDown(event) {
    startX.current = event.clientX;
    setDragging(true);
  }

  function handlePointerMove(event) {
    if (startX.current === null) return;
    setDragX(event.clientX - startX.current);
  }

  function handlePointerEnd(event) {
    if (startX.current === null) return;
    const deltaX = event.clientX - startX.current;
    if (deltaX > SWIPE_THRESHOLD) go(-1);
    else if (deltaX < -SWIPE_THRESHOLD) go(1);
    startX.current = null;
    setDragX(0);
    setDragging(false);
  }

  return (
    <section className="partners-strip" id="aliados" aria-label={t.title}>
      <div className="wrap">
        <h2 className="partners-title">{t.title}</h2>
        <div className="partners-carousel">
          <div
            className={`partners-viewport${dragging ? " is-dragging" : ""}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            onPointerLeave={handlePointerEnd}
          >
            <div
              className="partners-track"
              style={{
                "--per-page": perPage,
                transform: `translateX(calc(-${current * 100}% + ${dragX}px))`,
              }}
            >
              {Array.from({ length: pages }, (_, index) => (
                <div
                  className="partners-page"
                  key={index}
                  aria-hidden={index !== current}
                >
                  {partners
                    .slice(index * perPage, (index + 1) * perPage)
                    .map((partner) => (
                      <div className="partners-cell" key={partner.name}>
                        <Image
                          src={`/logos/aliados/bw/${partner.logo}`}
                          alt={partner.name}
                          width={partner.w}
                          height={partner.h}
                          unoptimized
                        />
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="partners-dashes">
          {Array.from({ length: pages }, (_, index) => (
            <button
              key={index}
              type="button"
              className={`partners-dash${index === current ? " active" : ""}`}
              aria-label={t.goTo(index + 1)}
              onClick={() => setPage(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
