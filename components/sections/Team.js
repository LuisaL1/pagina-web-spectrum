import Image from "next/image";
import { BsIcon } from "@/components/icons";

const leaders = [
  {
    name: "Cristian Valencia",
    role: "Chief Executive Officer",
    icon: "compass",
  },
  {
    name: "Edison Hernandez",
    role: "Chief Commercial Officer",
    icon: "graph-up-arrow",
  },
  {
    name: "Sneyder Martinez",
    role: "Project and Operations Engineering Manager",
    icon: "gear",
  },
  {
    name: "Paola Molano",
    role: "Legal Advisor and Procurement Specialist",
    icon: "briefcase",
  },
];

const content = {
  es: {
    eyebrow: "Quiénes somos",
    heading: "Las personas detrás de cada solución",
    lead: "En Spectrum no vendemos tecnología: la construyen personas. Este es el equipo directivo que le pone nombre, rostro y compromiso a cada proyecto que asumimos.",
  },
  en: {
    eyebrow: "Who we are",
    heading: "The people behind every solution",
    lead: "At Spectrum, we don't sell technology — people build it. This is the leadership team that gives every project we take on a name, a face and a commitment.",
  },
};

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/*
  Para mostrar la foto de una persona, agrega `photo: "/ruta/foto.jpg"` en
  `leaders`; mientras tanto se muestran sus iniciales.
*/
function TeamGrid({ people }) {
  return (
    <div className="team-grid">
      {people.map((member) => (
        <article className="team-card" key={member.name}>
          <div className="team-avatar-wrap">
            <span className="team-avatar-shape" aria-hidden="true" />
            <div className="team-avatar">
              {member.photo ? (
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  sizes="220px"
                />
              ) : (
                <span className="team-initials" aria-hidden="true">
                  {initials(member.name)}
                </span>
              )}
            </div>
            <span className="team-badge">
              <BsIcon name={member.icon} size={18} />
            </span>
          </div>
          <h3>{member.name}</h3>
          <p>{member.role}</p>
        </article>
      ))}
    </div>
  );
}

export default function Team({ locale = "es" }) {
  const t = content[locale] || content.es;

  return (
    <section id="equipo" className="about-light about-team pattern-bg">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2>{t.heading}</h2>
          <p>{t.lead}</p>
        </div>
        <div className="team-group team-group--lead" id="liderazgo">
          <TeamGrid people={leaders} />
        </div>
      </div>
    </section>
  );
}
