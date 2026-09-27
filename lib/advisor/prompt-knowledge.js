/*
  Texto de conocimiento comercial avanzado para el prompt de Gemini.
  Reutiliza la misma base que usa el asesor local (knowledge.js), de modo
  que ambos respondan con el mismo criterio.
*/

import { OBJECTIONS, PROBLEMS, SECTORS, SERVICES } from "./knowledge";

const es = (obj) => (obj && obj.es) || "";

export function formatAdvisorKnowledge() {
  const lines = [];

  lines.push("CRITERIO POR SERVICIO (cuándo recomendarlo y qué preguntar):");
  for (const [id, s] of Object.entries(SERVICES)) {
    lines.push(`- ${es(s.name)} (/soluciones/${id}): es ${es(s.pitch)}.`);
    lines.push(`  Recomendarlo ${es(s.recommendWhen)}.`);
    lines.push(`  Preguntas de diagnóstico: ${s.discovery.es.join(" ")}`);
  }
  lines.push("");

  lines.push(
    "CÓMO SE APLICAN LOS SERVICIOS POR SECTOR (orientación consultiva):",
  );
  for (const sec of Object.values(SECTORS)) {
    lines.push(`- ${es(sec.name)}. Retos: ${es(sec.challenges)}.`);
    for (const play of sec.plays) {
      lines.push(`  * ${es(SERVICES[play.service].name)}: ${es(play.how)}.`);
    }
    if (sec.caseClient) {
      lines.push(`  Caso real relacionado: ${sec.caseClient}.`);
    }
  }
  lines.push("");

  lines.push("SÍNTOMAS FRECUENTES Y CÓMO DIAGNOSTICARLOS:");
  for (const p of Object.values(PROBLEMS)) {
    lines.push(`- ${es(p.title)}: ${es(p.explain)}`);
    lines.push(`  Preguntas: ${p.questions.es.join(" ")}`);
    lines.push(`  Primeras acciones: ${p.firstSteps.es.join("; ")}.`);
  }
  lines.push("");

  lines.push("MANEJO DE OBJECIONES:");
  for (const [key, o] of Object.entries(OBJECTIONS)) {
    lines.push(`- ${key}: ${o.es}`);
  }

  return lines.join("\n");
}
