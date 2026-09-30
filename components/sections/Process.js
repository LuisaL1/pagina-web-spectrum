/*
  Como trabajamos: antes se repetia identica en cada pagina de solucion
  (saturaba esas paginas); ahora vive una sola vez, en Nosotros. Reutiliza
  las clases de solution-detail.css (.solution-process, .process-steps...)
  para no duplicar estilos.
*/

const content = {
  es: {
    eyebrow: "Cómo trabajamos",
    heading: "Un acompañamiento de principio a fin",
    steps: [
      {
        title: "Diagnóstico",
        text: "Entendemos su operación, sus riesgos y sus objetivos antes de proponer una solución.",
      },
      {
        title: "Diseño",
        text: "Definimos una arquitectura a la medida, con alcance, tiempos y responsabilidades claras.",
      },
      {
        title: "Implementación",
        text: "Ejecutamos con metodologías probadas y gestión del cambio, cuidando la continuidad de su operación.",
      },
      {
        title: "Operación y soporte",
        text: "Lo acompañamos después de la puesta en marcha, con soporte y mejora continua.",
      },
    ],
  },
  en: {
    eyebrow: "How we work",
    heading: "Support from start to finish",
    steps: [
      {
        title: "Diagnosis",
        text: "We understand your operation, your risks and your goals before proposing a solution.",
      },
      {
        title: "Design",
        text: "We define a tailored architecture, with clear scope, timelines and responsibilities.",
      },
      {
        title: "Implementation",
        text: "We execute with proven methodologies and change management, protecting the continuity of your operation.",
      },
      {
        title: "Operation and support",
        text: "We stay with you after go-live, with support and continuous improvement.",
      },
    ],
  },
};

export default function Process({ locale = "es" }) {
  const t = content[locale] || content.es;

  return (
    <section className="solution-process">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2>{t.heading}</h2>
        </div>
        <ol className="process-steps">
          {t.steps.map((step, i) => (
            <li className="process-step" key={step.title}>
              <span className="process-num">{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
