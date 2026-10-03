import Image from "next/image";

// Logos en /logos/clientes: recortados del collage de entidades que nos
// confiaron sus proyectos, agrupados por sector. Cada sector es una card
// dentro de una fila horizontal de sectores.
const categoriesEs = [
  {
    label: "Defensa y seguridad",
    text: "Fuerzas militares y entidades de defensa que protegen infraestructura crítica con el respaldo tecnológico de Spectrum.",
    clients: [
      { name: "Ministerio de Defensa", logo: "mindefensa.png" },
      {
        name: "Comando General de las Fuerzas Militares",
        logo: "fuerzas-militares.png",
      },
      { name: "Ejército Nacional de Colombia", logo: "ejercito-colombia.png" },
      { name: "Armada de Colombia", logo: "armada-colombia.png" },
      {
        name: "Fuerza Aeroespacial Colombiana",
        logo: "fuerza-aeroespacial.png",
      },
      { name: "Indumil", logo: "indumil.png" },
      { name: "CREMIL", logo: "cremil.png" },
      {
        name: "Escuela Superior de Guerra",
        logo: "escuela-superior-guerra.png",
      },
    ],
  },
  {
    label: "Gobierno y entidades públicas",
    text: "Instituciones del Estado que digitalizan y protegen sus operaciones con nuestras soluciones de infraestructura y seguridad.",
    clients: [
      { name: "DAPRE", logo: "dapre.png" },
      { name: "ANLA", logo: "anla.png" },
      { name: "IDEAM", logo: "ideam.png" },
      { name: "MinMinas", logo: "minminas.png" },
      { name: "Mintransporte", logo: "mintransporte.png" },
      { name: "ICETEX", logo: "icetex.png" },
      { name: "SENA", logo: "sena.png" },
      { name: "Fondo Nacional del Ahorro", logo: "fna.png" },
      { name: "Alcaldía de Yumbo", logo: "alcaldia-yumbo.png" },
    ],
  },
  {
    label: "Distrito Capital",
    text: "Secretarías y entidades de Bogotá que mejoran sus servicios a la ciudadanía con una operación más segura y eficiente.",
    clients: [
      {
        name: "Secretaría de Integración Social - Bogotá",
        logo: "bogota-integracion-social.png",
        wide: true,
      },
      {
        name: "Secretaría de Desarrollo Económico - Bogotá",
        logo: "bogota-desarrollo-economico.png",
        wide: true,
      },
      {
        name: "Jardín Botánico José Celestino Mutis",
        logo: "jardin-botanico.png",
      },
      { name: "INTUR", logo: "intur.png" },
    ],
  },
  {
    label: "Educación y sector privado",
    text: "Universidades y empresas que confían su tecnología e información a nuestro equipo.",
    clients: [
      {
        name: "Universidad Militar Nueva Granada",
        logo: "universidad-militar.png",
      },
      { name: "Universidad de los Andes", logo: "uniandes.png" },
      { name: "Seguros Mundial", logo: "seguros-mundial.png" },
      { name: "Redeban", logo: "redeban.png" },
      { name: "WIN Sports", logo: "win-sports.png" },
    ],
  },
];

const categoriesEn = [
  {
    label: "Defense and security",
    text: "Military forces and defense entities that protect critical infrastructure with Spectrum's technology backing.",
    clients: categoriesEs[0].clients,
  },
  {
    label: "Government and public entities",
    text: "State institutions that digitize and protect their operations with our infrastructure and security solutions.",
    clients: categoriesEs[1].clients,
  },
  {
    label: "Capital District",
    text: "Bogotá's secretariats and entities improving citizen services through a safer, more efficient operation.",
    clients: categoriesEs[2].clients,
  },
  {
    label: "Education and private sector",
    text: "Universities and companies that trust our team with their technology and information.",
    clients: categoriesEs[3].clients,
  },
];

const content = {
  es: {
    eyebrow: "Nuestros principales clientes",
    heading: "Organizaciones que confían en Spectrum",
    lead: "Entidades públicas y privadas que fortalecieron su infraestructura y seguridad con nuestro acompañamiento.",
    categories: categoriesEs,
  },
  en: {
    eyebrow: "Our leading clients",
    heading: "Organizations that trust Spectrum",
    lead: "Public and private entities that strengthened their infrastructure and security with our support.",
    categories: categoriesEn,
  },
};

export default function ClientsLogos({ locale = "es" }) {
  const t = content[locale] || content.es;

  return (
    <section className="about-light clients-logos-section" id="casos">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2>{t.heading}</h2>
          <p>{t.lead}</p>
        </div>

        <div className="clients-sectors">
          {t.categories.map((category) => (
            <div className="clients-sector-card" key={category.label}>
              <span className="clients-sector-badge">{category.label}</span>
              <p className="clients-sector-desc">{category.text}</p>
              <div className="clients-sector-logos">
                {category.clients.map((client, index) => {
                  const isLoneLast =
                    !client.wide &&
                    index === category.clients.length - 1 &&
                    category.clients.length % 2 !== 0;
                  return (
                    <div
                      className={`clients-logo${client.wide ? " clients-logo--wide" : ""}${isLoneLast ? " clients-logo--center" : ""}`}
                      key={client.name}
                    >
                      <Image
                        src={`/logos/clientes/${client.logo}`}
                        alt={client.name}
                        fill
                        sizes="(max-width: 560px) 42vw, (max-width: 980px) 20vw, 130px"
                        className="clients-logo-img"
                        unoptimized
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
