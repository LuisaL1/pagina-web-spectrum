import {
  ClockIcon,
  PlugIcon,
  ShieldCheckIcon,
  TrendIcon,
  UsersIcon,
} from "../icons";

const content = {
  es: {
    label: "Cualidades de las soluciones de Spectrum",
    items: [
      {
        icon: ClockIcon,
        title: "Disponibilidad 24/7",
        text: "Monitoreo y soporte permanentes para que su operación no se detenga.",
      },
      {
        icon: ShieldCheckIcon,
        title: "Seguridad integral",
        text: "Protección incorporada desde el diseño de cada solución.",
      },
      {
        icon: TrendIcon,
        title: "Escalabilidad",
        text: "Arquitecturas que crecen al ritmo de su organización.",
      },
      {
        icon: PlugIcon,
        title: "Integración a la medida",
        text: "Soluciones adaptadas a sus procesos y a su infraestructura actual.",
      },
      {
        icon: UsersIcon,
        title: "Acompañamiento integral",
        text: "Del diagnóstico al soporte posterior a la puesta en marcha.",
      },
    ],
  },
  en: {
    label: "Qualities of Spectrum's solutions",
    items: [
      {
        icon: ClockIcon,
        title: "24/7 availability",
        text: "Permanent monitoring and support so your operation never stops.",
      },
      {
        icon: ShieldCheckIcon,
        title: "Comprehensive security",
        text: "Protection built in from the design of every solution.",
      },
      {
        icon: TrendIcon,
        title: "Scalability",
        text: "Architectures that grow at the pace of your organization.",
      },
      {
        icon: PlugIcon,
        title: "Tailored integration",
        text: "Solutions adapted to your processes and your current infrastructure.",
      },
      {
        icon: UsersIcon,
        title: "End-to-end support",
        text: "From diagnosis to support after go-live.",
      },
    ],
  },
};

export default function QualityStrip({ locale = "es" }) {
  const t = content[locale] || content.es;

  return (
    <section className="quality-strip" aria-label={t.label}>
      <div className="wrap">
        <ul className="quality-list">
          {t.items.map((item) => {
            const Icon = item.icon;
            return (
              <li className="quality-item" key={item.title}>
                <span className="quality-icon" aria-hidden="true">
                  <Icon size={26} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
