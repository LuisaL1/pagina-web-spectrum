import Image from "next/image";

// Logos en /logos/aliados/bw: versiones monocromas, recortadas al contenido y
// escaladas para que todas tengan el mismo peso visual (w x h = tamano en px
// a 1x; el archivo esta a 2x).
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
  es: { title: "Tecnología respaldada por líderes de la industria" },
  en: { title: "Technology backed by industry leaders" },
};

function PartnerLogos({ hidden = false }) {
  return (
    <div className="partners-set" aria-hidden={hidden || undefined}>
      {partners.map((partner) => (
        <div className="partners-cell" key={partner.name}>
          <Image
            src={`/logos/aliados/bw/${partner.logo}`}
            alt={hidden ? "" : partner.name}
            width={partner.w}
            height={partner.h}
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}

export default function Partners({ locale = "es" }) {
  const t = content[locale] || content.es;

  return (
    <section className="partners-strip" id="aliados" aria-label={t.title}>
      <div className="wrap">
        <h2 className="partners-title">{t.title}</h2>
      </div>
      <div className="partners-marquee">
        <div className="partners-marquee-track">
          <PartnerLogos />
          <PartnerLogos hidden />
        </div>
      </div>
    </section>
  );
}
