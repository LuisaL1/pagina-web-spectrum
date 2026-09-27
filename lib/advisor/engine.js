/*
  Motor de asesoria de SpectrIA (100% local, sin API).

  Cuando Gemini no responde (o no hay llave), este motor contesta como un
  asesor de Spectrum: entiende que se pregunta, diagnostica, orienta,
  conecta la necesidad con los servicios y propone el siguiente paso.

  Flujo de generateAdvice():
    1. Seguridad: secretos pegados por el usuario, consultas sensibles,
       intentos de manipulacion o ayuda ofensiva (ver security.js).
    2. Analisis: normaliza el texto y detecta servicios, sectores,
       problemas, terminos del glosario y objeciones (con tolerancia a
       tildes, plurales y errores de tipeo).
    3. Contexto: si el mensaje es un seguimiento ("y para colegios?",
       "cuentame mas", "si"), hereda el tema de la conversacion.
    4. Respuesta consultiva + chips de sugerencias.
*/

import knowledgeBase from "@/data/knowledge-base.json";
import {
  GLOSSARY,
  OBJECTIONS,
  PARTNERS,
  PROBLEMS,
  PROCESS_STEPS,
  SECTORS,
  SERVICES,
  SERVICE_ORDER,
} from "./knowledge";
import {
  SECRET_WARNING,
  detectUserSecrets,
  inspectInput,
  refusalFor,
} from "./security";
import { whatsappUrl } from "../contact";
import { hasAny, normalize, scoreTerms } from "./text";

const EMAIL = knowledgeBase.contacto.correo;
const MIN_ENTITY_SCORE = 1;

// Preocupacion preventiva vs incidente en curso: cambia el tono y los pasos.
const PREVENTIVE =
  /(nos preocupa|me preocupa|preocupados|preocupacion|prevenir|prevencion|evitar|protegernos|proteger|proteccion|como protegemos|estar protegidos|riesgo de|por si acaso|antes de que|worried|concerned|prevent|avoid|protect|before it happens)/;
const INCIDENT =
  /(nos hackearon|me hackearon|hackearon|nos atacaron|estamos siendo atacados|ya nos paso|nos paso|secuestraron|archivos cifrados|cifraron|no podemos abrir|nos pidieron rescate|rescate|we were hacked|we got hacked|under attack|encrypted files|ransom note|it happened|has happened)/;

const L = (obj, locale) => (obj && (obj[locale] || obj.es)) || "";

const sectorLabel = (id, locale) => {
  const sec = SECTORS[id];
  return `${L(sec.article, locale)}${L(sec.name, locale)}`;
};

/* ---------------- Intenciones ---------------- */

const INTENT = {
  greeting:
    /^(hola|holi|holaa|buenas|buen dia|buenos dias|buenas tardes|buenas noches|hey|hi|hello|saludos|que tal|como estas|como vas|good (morning|afternoon|evening))\b/,
  thanks:
    /\b(gracias|muchas gracias|thanks|thank you|te agradezco|mil gracias)\b/,
  bye: /\b(chao|chau|adios|hasta luego|nos vemos|bye|goodbye|hasta pronto)\b/,
  identity:
    /(quien eres|que eres|eres (un |una )?(bot|robot|humano|humana|persona|ia|inteligencia)|como te llamas|cual es tu nombre|who are you|what are you|are you (a )?(bot|human|real)|con quien hablo)/,
  capabilities:
    /(que puedes hacer|en que (me )?puedes ayudar|como me puedes ayudar|para que sirves|que sabes hacer|what can you do|how can you help)/,
  about:
    /(quienes son|quien es spectrum|que es spectrum|a que se dedican|a que se dedica|que hace spectrum|que hacen ustedes|sobre spectrum|cuentame de spectrum|historia de spectrum|\bmision\b|\bvision\b|who is spectrum|what is spectrum|what does spectrum do|about spectrum|tell me about (you|spectrum)|de que se trata spectrum)/,
  servicesOverview:
    /(que servicios|cuales (son )?(los |esos |sus |estos |las |mis )?(servicios|soluciones|frentes|unidades)|cuales ofrecen|cuales tienen|lista(me)? (los |las |sus )?(servicios|soluciones)|enumera(me)? (los |las |sus )?(servicios|soluciones)|nombra(me)? (los |las |sus )?(servicios|soluciones)|detalla(me)? (los |las |sus )?(servicios|soluciones)|dime (los |las |sus )?(servicios|soluciones)|which (are|ones) (are )?(the |those |your )?(services|solutions)|list (the |your )?(services|solutions)|que soluciones|que ofrecen|que ofreces|portafolio|catalogo|todos (sus |los )?servicios|lista de servicios|what services|what do you offer|your services|portfolio|what solutions)/,
  price:
    /(cuanto (cuesta|cuestan|vale|valen|cobran|seria|sale|valdria)|precio|precios|costo|costos|tarifa|tarifas|cotizacion|cotizar|cotizame|presupuesto|valor del servicio|how much|pricing|price|quote|cost of|estimate|budget)/,
  contact:
    /(contacto|contactar|contactarlos|comunicarme|comunicarnos|hablar con (alguien|un asesor|una persona|ventas|comercial|el equipo|un humano|un experto)|quiero hablar|asesor comercial|un asesor|asesoria|llamar|llamarme|telefono|whatsapp|(su|tu|el|un) (correo|email) de contacto|correo de contacto|escribirles|agendar|reunion|cita\b|demo\b|hablemos|human|talk to|speak with|call me|schedule|meeting|book a)/,
  partners:
    /(aliados|partners?|socios tecnologicos|que marcas|fabricantes|con que tecnologias trabajan|proveedores tecnologicos|alliances|technology partners)/,
  cases:
    /(casos de exito|clientes|referencias|quienes confian|han trabajado con|con quien han trabajado|success stories|clients|references|track record|experiencia en)/,
  team: /(equipo directivo|directivos|quien dirige|quien lidera|fundadores|el ceo|leadership|founders|management team|who leads|who runs|quienes lideran|quien es el gerente)/,
  location:
    /(donde (estan|queda|quedan|operan)|ubicacion|ubicados|oficinas?|sede principal|en que pais|en que ciudad|where are you|location|which country|where do you operate|donde trabajan)/,
  process:
    /(como trabajan|como funciona|metodologia|proceso de trabajo|como es el proceso|por donde empiezo|por donde empezar|como empezar|como empiezo|primer paso|como se implementa|how do you work|how does it work|methodology|where do i start|how to start|first step|como seria el proceso)/,
  navigation:
    /(donde (esta|encuentro|puedo ver|veo|puedo encontrar|quedan?)|en que seccion|como llego|pagina de|seccion de|menu de|where (is|can i find)|which section|how do i get to|donde estan las)/,
  compare:
    /(diferencia entre|\bvs\b|versus|cual es mejor|o mejor|difference between|which is better|compared to|en que se diferencia)/,
  affirm:
    /^(si|sii|claro|dale|listo|ok|okay|vale|por favor|porfa|de una|perfecto|adelante|obvio|yes|sure|yep|please|go ahead|quiero|me gustaria|hagamoslo)\b/,
  more: /(cuentame mas|dime mas|mas detalles|ampliame|profundiza|y eso|como asi|tell me more|more details|go on|elaborate|explicame mas|mas informacion|mas info)/,
  concept:
    /(que (es|son|significa|quiere decir)|what (is|are|does)|define |definicion de|para que sirve|explicame (que es|que son)|como funciona (el|la|un|una|los|las)|how does (a|an|the) .{0,30} work)/,
  certifications:
    /(tienen|tiene|estan|son|cuentan con|have|are you|do you have).{0,25}(certificacion|certificaciones|certificados|acreditacion|acreditaciones|certified|certifications|accredited)/,
  coverage:
    /(fuera de colombia|otros paises|otras ciudades|internacional|(en|de) (bogota|medellin|cali|barranquilla|bucaramanga|cartagena|pereira|manizales|cucuta|otra ciudad)|todo el pais|a nivel nacional|latinoamerica|outside colombia|other countries|other cities|nationwide|internationally)/,
  support247:
    /(\b24 ?x? ?7\b|24 horas|horario de atencion|horarios de atencion|fines de semana|atencion permanente|business hours|working hours|around the clock|nivel de servicio|\bsla\b|tiempos de respuesta)/,
  trust:
    /(empresa seria|son (una empresa )?(seria|confiables?)|es (una empresa )?confiable|proveedor confiable|trayectoria|cuanto tiempo llevan|cuantos anos llevan|anos en el mercado|antiguedad|reputacion|trustworthy|reliable (company|provider)|how long have you been|years in business)/,
  dataSafety:
    /((datos|informacion).{0,40}(con ustedes|con spectrum|en manos de ustedes|manejan|tratan|almacenan|guardan|comparten)|privacidad|tratamiento de datos|confidencialidad|\bnda\b|(data|information).{0,40}(with you|with spectrum|you handle|you store|you share))/,
  competition:
    /(competencia|otras empresas|otros proveedores|otra empresa|mejores que|frente a otras|competitors|better than|other companies|other providers)/,
  languages:
    /(hablan ingles|en ingles|atienden en ingles|english speaking|speak english|do you speak|in english please)/,
  training:
    /(capacitacion|capacitaciones|capacitar|entrenamiento|formacion|talleres|cursos|training|workshop|upskill)/,
  timeline:
    /(cuanto (tiempo )?(toma|tarda|demora|se demora|dura|se tarda)|plazos?|tiempo de implementacion|en cuanto tiempo|cuando (estaria|quedaria|podrian empezar)|how long (does|will|would|is)|timeline|lead time|turnaround|how fast)/,
  help: /^(ayuda|necesito ayuda|me pueden ayudar|me podrias ayudar|me puedes ayudar|tengo un problema|tengo una duda|tengo una consulta|tengo un inconveniente|necesito asesoria|necesito una recomendacion|recomiendenme algo|recomiendame algo|me interesa|cuentame mas|help|i need help|i have a problem|i have a question)\b/,
  urgent:
    /(urgente|ahora mismo|en este momento|estamos (caidos|sin)|no podemos (trabajar|operar|abrir)|emergencia|urgent|emergency|right now|asap|inmediatamente)/,
  buying:
    /(contratar|contratarlos|me interesa|nos interesa|interested|necesito|necesitamos|quiero|queremos|busco|buscamos|quisiera|estamos buscando|estoy buscando|requerimos|requiero|nos gustaria|planeamos|vamos a|i need|we need|i want|we want|looking for|we are looking|planning to)/,
};

/* ---------------- Analisis ---------------- */

function bilingual(keywords) {
  return [...(keywords.es || []), ...(keywords.en || [])];
}

function rank(entries, norm, keywordsOf) {
  return entries
    .map(([id, def]) => {
      const { score, hits } = scoreTerms(norm, keywordsOf(def));
      return { id, score, hits };
    })
    .filter((entry) => entry.score >= MIN_ENTITY_SCORE)
    .sort((a, b) => b.score - a.score);
}

export function analyze(text) {
  const norm = normalize(text);
  const tokens = norm.split(" ").filter(Boolean);

  const services = rank(Object.entries(SERVICES), norm, (s) =>
    bilingual(s.keywords),
  );
  const sectors = rank(Object.entries(SECTORS), norm, (s) =>
    bilingual(s.keywords),
  );
  const problems = rank(Object.entries(PROBLEMS), norm, (p) =>
    bilingual(p.keywords),
  );

  let objection = null;
  let objectionScore = 0;
  for (const [key, def] of Object.entries(OBJECTIONS)) {
    const { score } = scoreTerms(norm, bilingual(def.keywords));
    if (score > objectionScore) {
      objection = key;
      objectionScore = score;
    }
  }
  if (objectionScore < 3) objection = null;

  let glossary = null;
  let glossaryScore = 0;
  for (const entry of GLOSSARY) {
    const { score } = scoreTerms(norm, entry.terms);
    if (score > glossaryScore) {
      glossary = entry;
      glossaryScore = score;
    }
  }
  if (glossaryScore < 2) glossary = null;

  let partner = null;
  for (const entry of PARTNERS) {
    const { score } = scoreTerms(norm, entry.aliases);
    if (score >= 2) {
      partner = entry;
      break;
    }
  }

  const intents = {};
  for (const [name, pattern] of Object.entries(INTENT)) {
    intents[name] = pattern.test(norm);
  }

  return {
    norm,
    tokens,
    services,
    sectors,
    problems,
    objection,
    glossary,
    partner,
    intents,
    hasEntity: services.length > 0 || sectors.length > 0 || problems.length > 0,
  };
}

/* ---------------- Contexto de la conversacion ---------------- */

function buildContext(messages) {
  const userTexts = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .slice(0, -1)
    .slice(-4);

  const ctx = {
    service: null,
    sector: null,
    problem: null,
    turns: messages.filter((m) => m.role === "assistant").length,
    lastAssistant:
      [...messages].reverse().find((m) => m.role === "assistant")?.content ||
      "",
  };

  for (const text of [...userTexts].reverse()) {
    if (ctx.service && ctx.sector && ctx.problem) break;
    const a = analyze(text);
    if (!ctx.problem && a.problems[0]) ctx.problem = a.problems[0].id;
    if (!ctx.sector && a.sectors[0]) ctx.sector = a.sectors[0].id;
    if (!ctx.service && a.services[0]) ctx.service = a.services[0].id;
  }
  return ctx;
}

/* ---------------- Piezas de texto ---------------- */

const para = (...parts) => parts.filter(Boolean).join("\n\n");
const bullets = (items) => items.map((item) => `- ${item}`).join("\n");

function serviceUrl(id) {
  return `/soluciones/${id}`;
}

function serviceName(id, locale) {
  return L(SERVICES[id].name, locale);
}

function cta(locale, { strong = false, ctx } = {}) {
  const summary = ctx ? summaryFromContext(ctx, locale) : "";
  if (locale === "en") {
    return strong
      ? para(
          `The best next step is a short conversation with our team so they can size this properly. You can write to ${EMAIL} or use the "Request information" form on any solution page.${summary}`,
        )
      : `If you want to take this further, you can write to ${EMAIL} or use the "Request information" form on any solution page, and the team will guide you.`;
  }
  return strong
    ? para(
        `El mejor siguiente paso es una conversación breve con nuestro equipo para dimensionar esto bien. Puedes escribir a ${EMAIL} o usar el formulario "Solicitar información" en cualquiera de las páginas de soluciones.${summary}`,
      )
    : `Si quieres avanzar, puedes escribir a ${EMAIL} o usar el formulario "Solicitar información" de cualquier página de soluciones, y el equipo te acompaña.`;
}

function summaryFromContext(ctx, locale) {
  const bits = [];
  if (ctx.sector) bits.push(L(SECTORS[ctx.sector].name, locale));
  if (ctx.problem) bits.push(L(PROBLEMS[ctx.problem].title, locale));
  else if (ctx.service) bits.push(serviceName(ctx.service, locale));
  if (bits.length === 0) return "";
  return locale === "en"
    ? ` To get a faster answer, mention: ${bits.join("; ")}, plus the size of your organization.`
    : ` Para que te respondan más rápido, menciona: ${bits.join("; ")}, y el tamaño de tu organización.`;
}

/* Sugerencias (chips): son mensajes reales que el usuario puede enviar. */
function chips(locale, kind, ctx = {}) {
  const es = {
    start: [
      "¿Qué servicios ofrecen?",
      "Tenemos caídas y lentitud",
      "¿Cómo protegen a una empresa de ransomware?",
      "Quiero hablar con un asesor",
    ],
    service: [
      "¿Cómo empiezo?",
      "¿Qué casos de éxito tienen?",
      "Quiero hablar con un asesor",
    ],
    problem: [
      "No sé qué causa el problema",
      "¿Cómo lo resolverían?",
      "Quiero hablar con un asesor",
    ],
    sector: [
      "¿Qué servicio priorizarían?",
      "¿Tienen casos en mi sector?",
      "Quiero hablar con un asesor",
    ],
    sales: [
      "¿Cómo es el proceso?",
      "¿Qué casos de éxito tienen?",
      "¿Con qué aliados trabajan?",
    ],
    after: ["¿Qué servicios ofrecen?", "Quiero hablar con un asesor"],
  };
  const en = {
    start: [
      "What services do you offer?",
      "We have outages and slowness",
      "How do you protect a company from ransomware?",
      "I want to talk to an advisor",
    ],
    service: [
      "How do I start?",
      "What success stories do you have?",
      "I want to talk to an advisor",
    ],
    problem: [
      "I do not know what is causing it",
      "How would you solve it?",
      "I want to talk to an advisor",
    ],
    sector: [
      "Which service would you prioritize?",
      "Do you have cases in my sector?",
      "I want to talk to an advisor",
    ],
    sales: [
      "What is the process?",
      "What success stories do you have?",
      "Which partners do you work with?",
    ],
    after: ["What services do you offer?", "I want to talk to an advisor"],
  };
  const table = locale === "en" ? en : es;
  void ctx;
  return table[kind] || table.after;
}

/* ---------------- Constructores de respuesta ---------------- */

function replyGreeting(locale) {
  return {
    text:
      locale === "en"
        ? "Hi, I am SpectrIA, Spectrum's virtual technology advisor. I can help you diagnose a technology problem, show you how our services apply to your sector, or explain any concept. What challenge are you facing today?"
        : "Hola, soy SpectrIA, el asesor tecnológico virtual de Spectrum. Puedo ayudarte a diagnosticar un problema de tecnología, mostrarte cómo aplican nuestros servicios en tu sector o explicarte cualquier concepto. ¿Qué reto tienes hoy?",
    suggestions: chips(locale, "start"),
  };
}

function replyIdentity(locale) {
  return {
    text:
      locale === "en"
        ? "I am SpectrIA, Spectrum's virtual advisor. I am not a person: I am an assistant built to help you understand your technology challenges and find the right solution among Spectrum's services in infrastructure, cybersecurity, connectivity, IT services, AI and custom development. I do not share details about how I work internally, but you can ask me anything about your organization's technology. What is on your mind?"
        : "Soy SpectrIA, el asesor virtual de Spectrum. No soy una persona: soy un asistente creado para ayudarte a entender tus retos de tecnología y encontrar la solución adecuada entre los servicios de Spectrum en infraestructura, ciberseguridad, conectividad, servicios de TI, inteligencia artificial y desarrollo a la medida. No comparto detalles de cómo funciono por dentro, pero puedes preguntarme lo que necesites sobre la tecnología de tu organización. ¿Qué tienes en mente?",
    suggestions: chips(locale, "start"),
  };
}

function replyCapabilities(locale) {
  return {
    text:
      locale === "en"
        ? para(
            "I can help you in several ways:",
            bullets([
              "diagnose a technology problem (slowness, outages, security incidents, network issues, data loss)",
              "recommend which Spectrum services fit your situation and why",
              "show how the services apply to your sector (government, education, finance, health, retail, industry and more)",
              "explain concepts such as SOC, SD-WAN, DRP or ransomware in plain language",
              "guide you on how to start and connect you with the team",
            ]),
            "Tell me what is happening in your organization and we start from there.",
          )
        : para(
            "Puedo ayudarte de varias maneras:",
            bullets([
              "diagnosticar un problema de tecnología (lentitud, caídas, incidentes de seguridad, fallas de red, pérdida de información)",
              "recomendarte qué servicios de Spectrum encajan con tu situación y por qué",
              "mostrarte cómo se aplican los servicios en tu sector (gobierno, educación, financiero, salud, comercio, industria y más)",
              "explicarte conceptos como SOC, SD-WAN, DRP o ransomware en lenguaje claro",
              "orientarte sobre cómo empezar y conectarte con el equipo",
            ]),
            "Cuéntame qué está pasando en tu organización y partimos de ahí.",
          ),
    suggestions: chips(locale, "start"),
  };
}

function replyAbout(locale) {
  const e = knowledgeBase.empresa;
  return {
    text:
      locale === "en"
        ? para(
            "Spectrum is a technology ecosystem of infrastructure, cybersecurity, connectivity and artificial intelligence for public and private organizations in Colombia. Its tagline is Future Powered.",
            "It was born to solve a recurring problem: companies buy infrastructure, security and connectivity as isolated services from different vendors, and nobody is responsible for the whole ecosystem. Spectrum integrates these layers into a single architecture, with one team that designs, implements and operates the solution end to end.",
            "Mission: to connect, protect and empower clients' technology operations through an integrated ecosystem, with close and responsible service from start to finish.",
            "What kind of challenge does your organization have? I can show you how this applies to your case.",
          )
        : para(
            `${e.descripcion} Su lema es ${e.eslogan}.`,
            e.historia,
            `Misión: ${e.mision}`,
            "¿Qué tipo de reto tiene tu organización? Puedo mostrarte cómo se aplicaría en tu caso.",
          ),
    suggestions: chips(locale, "sales"),
  };
}

const SERVICE_SUMMARY_EN = {
  "infraestructura-tecnologica":
    "servers, networks, storage, cloud and virtualization for a solid, highly available foundation.",
  ciberseguridad:
    "protection of platforms, applications and networks against digital threats, with constant monitoring.",
  conectividad:
    "wired, wireless and SD-WAN networks designed for end-to-end encrypted communication.",
  "servicios-de-ti":
    "consulting, leasing, help desk and maintenance to optimize processes and reduce operating costs.",
  "inteligencia-artificial":
    "applied AI to automate processes, anticipate risks and support decision making.",
  "desarrollo-a-la-medida":
    "applications, integrations and automations built around each organization's processes.",
};

function replyServicesOverview(locale) {
  const lines = SERVICE_ORDER.map((id) => {
    const kb = knowledgeBase.servicios.find((item) => item.pagina.endsWith(id));
    const summary =
      locale === "en"
        ? SERVICE_SUMMARY_EN[id]
        : kb?.resumen || L(SERVICES[id].pitch, locale);
    return `- ${serviceName(id, locale)}: ${summary}`;
  });
  return {
    text:
      locale === "en"
        ? para(
            "Spectrum works across six complementary fronts, integrated as a single ecosystem:",
            lines.join("\n"),
            "The value is that they are designed to work together rather than as isolated pieces. To point you to the right one, tell me what is happening in your organization or which sector you are in.",
          )
        : para(
            "Spectrum trabaja en seis frentes complementarios, integrados como un solo ecosistema:",
            lines.join("\n"),
            "El valor está en que están pensados para funcionar juntos y no como piezas aisladas. Para orientarte al indicado, cuéntame qué está pasando en tu organización o en qué sector estás.",
          ),
    suggestions: chips(locale, "start"),
  };
}

function replyService(id, locale, { ctx, strong, sectorId } = {}) {
  const s = SERVICES[id];
  const partners = s.pairsWith
    .map((pid) => serviceName(pid, locale))
    .join(locale === "en" ? " and " : " y ");
  const sectorPlay =
    sectorId && SECTORS[sectorId].plays.find((p) => p.service === id);

  const body =
    locale === "en"
      ? para(
          `${serviceName(id, locale)} is ${L(s.pitch, locale)}.`,
          sectorPlay
            ? `In ${sectorLabel(sectorId, locale)}, it typically applies as ${L(sectorPlay.how, locale)}.`
            : "",
          `It is usually the right move ${L(s.recommendWhen, locale)}.`,
          `What it includes:\n${bullets(L(s.highlights, locale))}`,
          `It pairs especially well with ${partners}.`,
          `To recommend the right scope, I would need to understand:\n${bullets(L(s.discovery, locale).slice(0, 2))}`,
          `More detail: ${serviceUrl(id)}`,
          strong ? cta(locale, { strong: true, ctx }) : "",
        )
      : para(
          `${serviceName(id, locale)} es ${L(s.pitch, locale)}.`,
          sectorPlay
            ? `En ${sectorLabel(sectorId, locale)}, se aplica típicamente como ${L(sectorPlay.how, locale)}.`
            : "",
          `Suele ser la jugada correcta ${L(s.recommendWhen, locale)}.`,
          `Qué incluye:\n${bullets(L(s.highlights, locale))}`,
          `Se complementa especialmente con ${partners}.`,
          `Para recomendarte el alcance adecuado, necesitaría entender:\n${bullets(L(s.discovery, locale).slice(0, 2))}`,
          `Más detalle: ${serviceUrl(id)}`,
          strong ? cta(locale, { strong: true, ctx }) : "",
        );
  return { text: body, suggestions: chips(locale, "service") };
}

function replySector(sectorId, locale, { serviceId, ctx, strong } = {}) {
  const sec = SECTORS[sectorId];
  const plays = serviceId
    ? [
        ...sec.plays.filter((p) => p.service === serviceId),
        ...sec.plays.filter((p) => p.service !== serviceId),
      ]
    : sec.plays;
  const caseInfo = sec.caseClient
    ? knowledgeBase.casos_de_exito.find((c) => c.cliente === sec.caseClient)
    : null;

  const playLines = plays
    .slice(0, 3)
    .map((p) => `${serviceName(p.service, locale)}: ${L(p.how, locale)}`);
  if (serviceId && !plays.some((p) => p.service === serviceId)) {
    playLines.unshift(
      `${serviceName(serviceId, locale)}: ${L(SERVICES[serviceId].pitch, locale).split(",")[0]}`,
    );
    playLines.length = Math.min(playLines.length, 3);
  }

  const text =
    locale === "en"
      ? para(
          `In ${sectorLabel(sectorId, locale)} the usual challenges are ${L(sec.challenges, locale)}.`,
          `This is how I would approach it with Spectrum's services:\n${bullets(playLines)}`,
          caseInfo
            ? `Related experience: ${caseInfo.cliente} (${caseInfo.sector}). ${translateCase(caseInfo, locale)}`
            : "",
          `To recommend where to start, I would want to know:\n${bullets(L(sec.questions, locale))}`,
          strong ? cta(locale, { strong: true, ctx }) : "",
        )
      : para(
          `En ${sectorLabel(sectorId, locale)} los retos habituales son ${L(sec.challenges, locale)}.`,
          `Así lo abordaría con los servicios de Spectrum:\n${bullets(playLines)}`,
          caseInfo
            ? `Experiencia relacionada: ${caseInfo.cliente} (${caseInfo.sector}). ${caseInfo.resumen}`
            : "",
          `Para recomendarte por dónde empezar, me gustaría saber:\n${bullets(L(sec.questions, locale))}`,
          strong ? cta(locale, { strong: true, ctx }) : "",
        );
  return { text, suggestions: chips(locale, "sector") };
}

const CASE_EN = {
  "Alcaldía de Yumbo":
    "Implementation of backup infrastructure and continuous monitoring (NOC) to guarantee the availability of critical citizen services.",
  "Universidad Militar Nueva Granada":
    "Redesign of the network architecture and deployment of perimeter cybersecurity controls across all campuses.",
  Redeban:
    "24/7 NOC and SOC monitoring of the infrastructure that supports nationwide transactions.",
  "Armada de Colombia":
    "Implementation of intrusion detection and prevention systems to shield the digital perimeter.",
};

function translateCase(caseInfo, locale) {
  return locale === "en"
    ? CASE_EN[caseInfo.cliente] || caseInfo.resumen
    : caseInfo.resumen;
}

function replyProblem(
  problemId,
  locale,
  { ctx, urgent, preventive, sectorId, previous } = {},
) {
  const p = PROBLEMS[problemId];
  const isUrgent = !preventive && (urgent || p.urgent);
  const usePrevent = preventive && p.prevent;

  const questions = L(p.questions, locale).slice(0, 3);
  const steps = usePrevent ? L(p.prevent, locale) : L(p.firstSteps, locale);
  const serviceList = p.services.map((id) => serviceName(id, locale));
  const es = locale !== "en";

  const opening = usePrevent
    ? es
      ? `Es una preocupación muy razonable, y lo mejor es atenderla antes de que ocurra.`
      : `That is a very reasonable concern, and it is best to address it before it happens.`
    : isUrgent
      ? es
        ? `Esto suena a ${L(p.title, locale)} y merece atención de inmediato.`
        : `This sounds like ${L(p.title, locale)} and deserves immediate attention.`
      : previous
        ? es
          ? `Buena pregunta, y se conecta con lo que hablábamos. Esto tiene que ver con ${L(p.title, locale)}.`
          : `Good question, and it connects with what we were discussing. This is about ${L(p.title, locale)}.`
        : es
          ? `Esto parece ${L(p.title, locale)}.`
          : `This looks like ${L(p.title, locale)}.`;

  const sectorNote = sectorId
    ? es
      ? `Como estás en ${sectorLabel(sectorId, locale)}, ten presente ${L(SECTORS[sectorId].challenges, locale)}.`
      : `Since you are in ${sectorLabel(sectorId, locale)}, keep in mind ${L(SECTORS[sectorId].challenges, locale)}.`
    : "";

  const urgentLine = isUrgent
    ? es
      ? `Si esto está pasando ahora mismo, contacta de inmediato al equipo en ${EMAIL} e indica que es un incidente activo.`
      : `If this is happening right now, contact the team immediately at ${EMAIL} and mention that it is an active incident.`
    : "";

  // El cierre comercial no se repite en cada turno: se guarda para el 1er y 3er mensaje.
  const showCta = ctx.turns === 0 || ctx.turns >= 2;

  const text = es
    ? para(
        opening,
        usePrevent && p.preventExplain
          ? L(p.preventExplain, locale)
          : L(p.explain, locale),
        usePrevent
          ? `Las medidas que más reducen el riesgo:\n${bullets(steps)}`
          : `Lo primero que haría:\n${bullets(steps)}`,
        usePrevent
          ? `Para decirte por dónde empezar en tu caso:\n${bullets(questions)}`
          : `Para identificar la causa necesito un poco más de información:\n${bullets(questions)}`,
        sectorNote,
        `Según el diagnóstico, los servicios de Spectrum que entrarían son ${serviceList.join(" y ")}, trabajando de forma conjunta.`,
        urgentLine || (showCta ? cta(locale, { ctx }) : ""),
      )
    : para(
        opening,
        usePrevent && p.preventExplain
          ? L(p.preventExplain, locale)
          : L(p.explain, locale),
        usePrevent
          ? `The measures that reduce risk the most:\n${bullets(steps)}`
          : `What I would do first:\n${bullets(steps)}`,
        usePrevent
          ? `To tell you where to start in your case:\n${bullets(questions)}`
          : `To pinpoint the cause I need a bit more information:\n${bullets(questions)}`,
        sectorNote,
        `Depending on the diagnosis, the relevant Spectrum services would be ${serviceList.join(" and ")}, working together.`,
        urgentLine || (showCta ? cta(locale, { ctx }) : ""),
      );
  return { text, suggestions: chips(locale, "problem") };
}

function replyProblemFollowUp(problemId, locale, { ctx, sectorId }) {
  const p = PROBLEMS[problemId];
  const extra = L(p.questions, locale).slice(-2);
  const serviceList = p.services.map((id) => serviceName(id, locale));
  const text =
    locale === "en"
      ? para(
          "That is completely normal: many times the cause is not obvious from the outside, and guessing would send you in the wrong direction. The way to find it is to narrow it down step by step.",
          `Start by checking:\n${bullets([...L(p.firstSteps, locale).slice(0, 2), ...extra])}`,
          `If after that it is still unclear, a technical diagnosis by ${serviceList.join(" and ")} specialists is the fastest way to find the real cause without trial and error.`,
          cta(locale, { strong: true, ctx }),
        )
      : para(
          "Es completamente normal: muchas veces la causa no es evidente desde afuera, y adivinar te llevaría por el camino equivocado. La forma de encontrarla es ir acotando paso a paso.",
          `Empieza por revisar:\n${bullets([...L(p.firstSteps, locale).slice(0, 2), ...extra])}`,
          `Si después de eso sigue sin estar claro, un diagnóstico técnico con especialistas en ${serviceList.join(" y ")} es la forma más rápida de encontrar la causa real sin ensayo y error.`,
          cta(locale, { strong: true, ctx }),
        );
  void sectorId;
  return { text, suggestions: chips(locale, "sales") };
}

function replyPrice(locale, { ctx, serviceId }) {
  const es = locale !== "en";
  const target = serviceId ? serviceName(serviceId, locale) : null;
  const text = es
    ? para(
        `No tengo precios publicados que compartirte, y prefiero no inventarte una cifra. El costo de ${target ? `un proyecto de ${target}` : "estas soluciones"} depende de factores como el tamaño de la operación, el número de sedes y usuarios, el nivel de disponibilidad y seguridad requerido y lo que ya tengan implementado.`,
        "Por eso el camino recomendado es un diagnóstico breve: le permite al equipo dimensionar el alcance correcto, priorizar lo que más impacto tiene y, si ayuda, escalonar la inversión o usar esquemas como el leasing tecnológico.",
        "Para preparar una conversación útil te ayuda tener claro:\n" +
          bullets([
            "tu sector y el tamaño aproximado de la organización",
            "el problema principal o el objetivo",
            "qué infraestructura o proveedores tienen hoy",
          ]),
        cta(locale, { strong: true, ctx }),
      )
    : para(
        `I do not have published prices to share, and I would rather not give you a made-up number. The cost of ${target ? `a ${target} project` : "these solutions"} depends on things like the size of the operation, the number of sites and users, the level of availability and security required, and what you already have in place.`,
        "That is why the recommended route is a short diagnosis: it lets the team size the right scope, prioritize what has the most impact and, if it helps, phase the investment or use schemes such as technology leasing.",
        "To prepare a useful conversation, it helps to have:\n" +
          bullets([
            "your sector and the approximate size of the organization",
            "the main problem or goal",
            "what infrastructure or providers you have today",
          ]),
        cta(locale, { strong: true, ctx }),
      );
  return { text, suggestions: chips(locale, "sales") };
}

function replyContact(locale, { ctx }) {
  const bits = [];
  if (ctx?.sector) bits.push(L(SECTORS[ctx.sector].name, locale));
  if (ctx?.problem) bits.push(L(PROBLEMS[ctx.problem].title, locale));
  else if (ctx?.service) bits.push(serviceName(ctx.service, locale));

  const message =
    locale === "en"
      ? `Hi, I'm coming from Spectrum's website and I'd like to talk to an advisor.${bits.length ? ` I'm interested in: ${bits.join("; ")}.` : ""}`
      : `Hola, vengo del sitio web de Spectrum y quiero hablar con un asesor.${bits.length ? ` Me interesa: ${bits.join("; ")}.` : ""}`;

  const text =
    locale === "en"
      ? para(
          "Of course. The fastest way to talk to one of our advisors is WhatsApp: tap the button below and the chat opens with your message ready to send.",
          bits.length
            ? `I already included what we talked about (${bits.join("; ")}) so you do not have to explain it again.`
            : "You can also tell me now what you need, and I will help you word the message.",
          `If you prefer email, you can write to ${EMAIL}.`,
        )
      : para(
          "Claro que sí. La forma más rápida de hablar con uno de nuestros asesores es por WhatsApp: toca el botón de abajo y se abre el chat con tu mensaje listo para enviar.",
          bits.length
            ? `Ya incluí lo que hemos conversado (${bits.join("; ")}) para que no tengas que explicarlo de nuevo.`
            : "Si quieres, cuéntame ahora qué necesitas y te ayudo a redactar el mensaje.",
          `Si prefieres correo, puedes escribir a ${EMAIL}.`,
        );

  return {
    text,
    suggestions: chips(locale, "after"),
    cta: {
      type: "whatsapp",
      label: locale === "en" ? "Chat on WhatsApp" : "Hablar por WhatsApp",
      href: whatsappUrl(message),
    },
  };
}

function replyPartners(locale) {
  const list = knowledgeBase.aliados_tecnologicos.join(", ");
  return {
    text:
      locale === "en"
        ? para(
            `Spectrum works with more than 20 technology partners, including ${list}.`,
            "They cover the main layers of the ecosystem: security (such as Fortinet, CrowdStrike, Check Point and SentinelOne), infrastructure and data (Nutanix, Hitachi, IBM, Veeam), cloud (Microsoft, AWS, Google Cloud) and networking (Aruba, Extreme Networks). Having several partners lets us recommend what fits each case instead of pushing a single brand.",
            "Do you have a specific brand or platform in mind? I can tell you where it fits.",
          )
        : para(
            `Spectrum trabaja con más de 20 aliados tecnológicos, entre ellos ${list}.`,
            "Cubren las capas principales del ecosistema: seguridad (como Fortinet, CrowdStrike, Check Point y SentinelOne), infraestructura y datos (Nutanix, Hitachi, IBM, Veeam), nube (Microsoft, AWS, Google Cloud) y redes (Aruba, Extreme Networks). Contar con varios aliados permite recomendar lo que encaja en cada caso en lugar de empujar una sola marca.",
            "¿Tienes alguna marca o plataforma en mente? Te cuento dónde encaja.",
          ),
    suggestions: chips(locale, "sales"),
  };
}

function replyCases(locale) {
  const lines = knowledgeBase.casos_de_exito.map(
    (c) => `- ${c.cliente} (${c.sector}): ${translateCase(c, locale)}`,
  );
  return {
    text:
      locale === "en"
        ? para(
            "These are some of the organizations Spectrum has worked with:",
            lines.join("\n"),
            "They show experience in demanding environments such as government, education, finance and defense. Which sector are you in? I can tell you how it would apply.",
          )
        : para(
            "Estas son algunas de las organizaciones con las que Spectrum ha trabajado:",
            lines.join("\n"),
            "Muestran experiencia en entornos exigentes como gobierno, educación, sector financiero y defensa. ¿En qué sector estás? Te cuento cómo se aplicaría.",
          ),
    suggestions: chips(locale, "sales"),
  };
}

function replyTeam(locale) {
  const lines = knowledgeBase.equipo_directivo.map(
    (p) => `- ${p.nombre}, ${p.cargo}`,
  );
  return {
    text:
      locale === "en"
        ? para(
            "Spectrum's leadership team is:",
            lines.join("\n"),
            "You can see them on the Team page (/equipo). If you want to talk to someone about your project, the channel is " +
              EMAIL +
              ".",
          )
        : para(
            "El equipo directivo de Spectrum está conformado por:",
            lines.join("\n"),
            "Puedes verlos en la página de Equipo (/equipo). Si quieres hablar con alguien sobre tu proyecto, el canal es " +
              EMAIL +
              ".",
          ),
    suggestions: chips(locale, "after"),
  };
}

function replyLocation(locale) {
  return {
    text:
      locale === "en"
        ? `Spectrum operates in Colombia, serving public and private organizations. For meetings or visits, the team coordinates directly: write to ${EMAIL}. Which city or region is your organization in?`
        : `Spectrum opera en Colombia y atiende organizaciones públicas y privadas. Para reuniones o visitas, el equipo las coordina directamente: escribe a ${EMAIL}. ¿En qué ciudad o región está tu organización?`,
    suggestions: chips(locale, "after"),
  };
}

function replyProcess(locale, ctx) {
  const steps = L(PROCESS_STEPS, locale);
  return {
    text:
      locale === "en"
        ? para(
            "This is how the work usually goes with Spectrum:",
            steps.map((s, i) => `${i + 1}. ${s}`).join("\n"),
            "The starting point is always understanding your case, so no commitment is needed to have that first conversation.",
            cta(locale, { ctx }),
          )
        : para(
            "Así suele ser el trabajo con Spectrum:",
            steps.map((s, i) => `${i + 1}. ${s}`).join("\n"),
            "El punto de partida siempre es entender tu caso, así que para tener esa primera conversación no hay compromiso.",
            cta(locale, { ctx }),
          ),
    suggestions: chips(locale, "sales"),
  };
}

function replyObjection(key, locale) {
  return {
    text: L(OBJECTIONS[key], locale),
    suggestions: chips(locale, "sales"),
  };
}

function replyGlossary(entry, locale, ctx) {
  const service = entry.service;
  return {
    text:
      locale === "en"
        ? para(
            entry.en,
            `At Spectrum this is part of ${serviceName(service, locale)}: ${serviceUrl(service)}.`,
            "Are you evaluating this for your organization? Tell me your context and I will tell you how much sense it makes for you.",
            ctx && ctx.turns >= 2 ? cta(locale) : "",
          )
        : para(
            entry.es,
            `En Spectrum esto hace parte de ${serviceName(service, locale)}: ${serviceUrl(service)}.`,
            "¿Lo estás evaluando para tu organización? Cuéntame tu contexto y te digo qué tanto sentido tiene para ti.",
            ctx && ctx.turns >= 2 ? cta(locale) : "",
          ),
    suggestions: chips(locale, "service"),
  };
}

const NAV_TARGETS = [
  {
    keys: [
      "novedades",
      "noticias",
      "blog",
      "articulos",
      "publicaciones",
      "news",
    ],
    es: "Las noticias y artículos están en Novedades (/novedades) y en el Blog (/blog).",
    en: "News and articles are in News (/novedades) and the Blog (/blog).",
  },
  {
    keys: ["equipo", "directivos", "team", "lideres"],
    es: "El equipo directivo está en la página de Equipo (/equipo), junto con la cultura organizacional.",
    en: "The leadership team is on the Team page (/equipo), along with the organizational culture.",
  },
  {
    keys: [
      "nosotros",
      "historia",
      "mision",
      "vision",
      "quienes somos",
      "about",
    ],
    es: "La historia, la misión y la visión están en Nosotros (/nosotros).",
    en: "The story, mission and vision are on About us (/nosotros).",
  },
  {
    keys: ["soluciones", "servicios", "solutions", "services"],
    es: "Los servicios están en la sección Soluciones del inicio (/#soluciones), y cada uno tiene su página: /soluciones/infraestructura-tecnologica, /soluciones/ciberseguridad, /soluciones/conectividad, /soluciones/servicios-de-ti, /soluciones/inteligencia-artificial y /soluciones/desarrollo-a-la-medida.",
    en: "Services are in the Solutions section on the home page (/#soluciones), and each has its own page: /soluciones/infraestructura-tecnologica, /soluciones/ciberseguridad, /soluciones/conectividad, /soluciones/servicios-de-ti, /soluciones/inteligencia-artificial and /soluciones/desarrollo-a-la-medida.",
  },
  {
    keys: ["casos", "clientes", "casos de exito", "success"],
    es: "Los casos de éxito están en el inicio, en la sección Casos (/#casos).",
    en: "Success stories are on the home page, in the Cases section (/#casos).",
  },
  {
    keys: ["aliados", "partners", "marcas"],
    es: "Los aliados tecnológicos están en el inicio (/#aliados).",
    en: "Technology partners are on the home page (/#aliados).",
  },
  {
    keys: [
      "politica",
      "datos personales",
      "privacidad",
      "habeas data",
      "privacy",
    ],
    es: "La política de tratamiento de datos está en /politica-de-datos.",
    en: "The data processing policy is at /politica-de-datos.",
  },
  {
    keys: ["contacto", "formulario", "contact"],
    es: `Para contactar al equipo, el correo es ${EMAIL} y cada página de soluciones tiene el formulario "Solicitar información".`,
    en: `To contact the team, the email is ${EMAIL} and every solution page has the "Request information" form.`,
  },
];

function replyNavigation(norm, locale) {
  const target = NAV_TARGETS.find((t) =>
    t.keys.some((k) => ` ${norm} `.includes(` ${normalize(k)} `)),
  );
  if (!target) return null;
  return { text: L(target, locale), suggestions: chips(locale, "after") };
}

function replyCompare(ids, locale) {
  const [a, b] = ids;
  const sa = SERVICES[a];
  const sb = SERVICES[b];
  return {
    text:
      locale === "en"
        ? para(
            `They solve different things and usually complement each other.`,
            `${serviceName(a, locale)} is ${L(sa.pitch, locale)}.`,
            `${serviceName(b, locale)} is ${L(sb.pitch, locale)}.`,
            "The right choice depends on the problem you are trying to solve. What is happening in your organization? I will tell you which one to prioritize.",
          )
        : para(
            "Resuelven cosas distintas y normalmente se complementan.",
            `${serviceName(a, locale)} es ${L(sa.pitch, locale)}.`,
            `${serviceName(b, locale)} es ${L(sb.pitch, locale)}.`,
            "La elección depende del problema que quieras resolver. ¿Qué está pasando en tu organización? Te digo cuál priorizar.",
          ),
    suggestions: chips(locale, "service"),
  };
}

function contactLine(locale) {
  return locale === "en" ? `write to ${EMAIL}` : `escríbenos a ${EMAIL}`;
}

function replyHelp(locale) {
  return {
    text:
      locale === "en"
        ? para(
            "Of course, tell me. To guide you well it helps to know:",
            bullets([
              "what is happening or what you want to achieve",
              "which sector your organization is in",
              "how urgent it is",
            ]),
            "The more concrete you are, the better the advice. You can also pick one of the options below.",
          )
        : para(
            "Claro que sí, cuéntame. Para orientarte bien me ayuda saber:",
            bullets([
              "qué está pasando o qué quieres lograr",
              "en qué sector está tu organización",
              "qué tan urgente es",
            ]),
            "Mientras más concreto seas, mejor será la asesoría. También puedes elegir una de las opciones de abajo.",
          ),
    suggestions: chips(locale, "start"),
  };
}

function replyCertifications(locale) {
  return {
    text:
      locale === "en"
        ? para(
            "Spectrum works with more than 20 leading technology partners and can support you in aligning with ISO 27001 and data protection regulations.",
            `About specific certifications or accreditations of the company or its team, I do not have a published list to share and I would rather not give you inaccurate information. The team can send you the documentation you need: ${contactLine(locale)}.`,
            "If it is your organization that needs to get certified in something, such as ISO 27001, there I can guide you.",
          )
        : para(
            "Spectrum trabaja con más de 20 aliados tecnológicos de primer nivel y puede acompañarte en la alineación con ISO 27001 y con normativas de protección de datos.",
            `Sobre certificaciones o acreditaciones específicas de la compañía o de su equipo, no tengo un listado publicado que compartirte y prefiero no darte información imprecisa. El equipo puede enviarte la documentación que necesites: ${contactLine(locale)}.`,
            "Si es tu organización la que necesita certificarse en algo, por ejemplo ISO 27001, ahí sí te puedo orientar.",
          ),
    suggestions: chips(locale, "sales"),
  };
}

function replyCoverage(locale) {
  return {
    text:
      locale === "en"
        ? `Spectrum operates in Colombia and serves public and private organizations; its vision is to be the leading technology partner in Latin America. For projects in other cities or outside the country, the team evaluates each case: ${contactLine(locale)} with the location of your sites and what you need.`
        : `Spectrum opera en Colombia y atiende organizaciones públicas y privadas; su visión es ser el aliado tecnológico de referencia en Latinoamérica. Para proyectos en otras ciudades o fuera del país, el equipo evalúa cada caso: ${contactLine(locale)} con la ubicación de tus sedes y lo que necesitas.`,
    suggestions: chips(locale, "after"),
  };
}

function replySupport247(locale) {
  return {
    text:
      locale === "en"
        ? para(
            "Several fronts of Spectrum's work run 24/7: the NOC monitors infrastructure, the SOC watches and responds to security incidents continuously, and there is 24/7 network support.",
            "Specific service levels (response times, coverage and channels) are defined according to the scope of each project, so I will not quote figures that are not confirmed; the team details them in the proposal.",
            `If you need support right now, ${contactLine(locale)}.`,
          )
        : para(
            "Varios frentes del trabajo de Spectrum funcionan 24/7: el NOC monitorea la infraestructura, el SOC vigila y responde a incidentes de seguridad de forma continua y existe soporte de red 24/7.",
            "Los niveles de servicio específicos (tiempos de respuesta, cobertura y canales) se definen según el alcance de cada proyecto, así que no te voy a dar cifras que no estén confirmadas; el equipo las detalla en la propuesta.",
            `Si necesitas soporte ahora mismo, ${contactLine(locale)}.`,
          ),
    suggestions: chips(locale, "sales"),
  };
}

function replyTrust(locale) {
  return {
    text:
      locale === "en"
        ? para(
            "Spectrum turns five years in 2026, working with public and private organizations in Colombia.",
            L(OBJECTIONS.confianza, locale),
          )
        : para(
            "Spectrum cumple cinco años de trayectoria en 2026, trabajando con organizaciones públicas y privadas en Colombia.",
            L(OBJECTIONS.confianza, locale),
          ),
    suggestions: chips(locale, "sales"),
  };
}

function replyCompetition(locale) {
  return {
    text:
      locale === "en"
        ? para(
            "I prefer not to speak ill of anyone: the market has good providers. What I can tell you is what makes Spectrum different.",
            L(OBJECTIONS.confianza, locale),
          )
        : para(
            "Prefiero no hablar mal de nadie: el mercado tiene buenos proveedores. Lo que sí te puedo contar es qué hace diferente a Spectrum.",
            L(OBJECTIONS.confianza, locale),
          ),
    suggestions: chips(locale, "sales"),
  };
}

function replyDataSafety(locale) {
  return {
    text:
      locale === "en"
        ? para(
            "That is exactly the right question before trusting information to a provider.",
            "Spectrum publishes its personal data processing policy (/politica-de-datos), and its work is precisely protecting information: security, backup and continuity. When a project is contracted, the recommended practice is to formalize confidentiality and the scope of access to your data in the agreement, which is arranged with the team.",
            `If you need details about controls or security documents, request them directly: ${contactLine(locale)}.`,
          )
        : para(
            "Es justo la pregunta correcta antes de confiarle información a un proveedor.",
            "Spectrum publica su política de tratamiento de datos personales (/politica-de-datos) y su trabajo es precisamente proteger información: seguridad, respaldo y continuidad. Cuando se contrata un proyecto, lo recomendable es formalizar en el contrato la confidencialidad y el alcance de acceso a tus datos, y eso se acuerda con el equipo.",
            `Si necesitas detalles de los controles o documentos de seguridad, pídelos directamente: ${contactLine(locale)}.`,
          ),
    suggestions: chips(locale, "sales"),
  };
}

function replyLanguages(locale) {
  return {
    text:
      locale === "en"
        ? `The site and this assistant are available in Spanish and English. For meetings or documentation in a specific language, coordinate directly with the team: ${contactLine(locale)}.`
        : `El sitio y este asistente están disponibles en español y en inglés. Para reuniones o documentación en un idioma específico, coordínalo directamente con el equipo: ${contactLine(locale)}.`,
    suggestions: chips(locale, "after"),
  };
}

function replyTraining(locale) {
  return {
    text:
      locale === "en"
        ? para(
            "Within Artificial Intelligence, Spectrum includes adoption and team training to bring AI into daily work.",
            `For other training topics, such as cybersecurity awareness, I do not have a published program to confirm; the team can evaluate it with you: ${contactLine(locale)}. Training the team is, by the way, one of the most cost-effective measures against phishing.`,
          )
        : para(
            "Dentro de Inteligencia Artificial, Spectrum incluye la adopción y capacitación de equipos para incorporar la IA en el trabajo diario.",
            `Para otros temas de capacitación, como concientización en ciberseguridad, no tengo un programa publicado que confirmar; el equipo puede evaluarlo contigo: ${contactLine(locale)}. Formar al equipo es, además, una de las medidas más rentables contra el phishing.`,
          ),
    suggestions: chips(locale, "service"),
  };
}

function replyTimeline(locale, ctx) {
  return {
    text:
      locale === "en"
        ? para(
            "Timelines depend on scope, and I would rather not give you a number without knowing your case. A diagnosis is quick; infrastructure projects and migrations are planned in stages.",
            "What determines the timeline:\n" +
              bullets([
                "size of the operation, number of sites and users",
                "complexity of integration with what you already have",
                "maintenance windows your operation allows",
                "how available your own team is",
              ]),
            "The team delivers a schedule in the proposal, and it is common to start with the most critical piece and expand from there.",
            cta(locale, { strong: true, ctx }),
          )
        : para(
            "Los tiempos dependen del alcance, y prefiero no darte un número sin conocer tu caso. Un diagnóstico es rápido; los proyectos de infraestructura y las migraciones se planifican por etapas.",
            "Lo que define el plazo:\n" +
              bullets([
                "tamaño de la operación, número de sedes y usuarios",
                "complejidad de la integración con lo que ya tienen",
                "ventanas de mantenimiento que permita tu operación",
                "disponibilidad de tu propio equipo",
              ]),
            "El equipo entrega un cronograma en la propuesta, y es común empezar por la pieza más crítica y ampliar desde ahí.",
            cta(locale, { strong: true, ctx }),
          ),
    suggestions: chips(locale, "sales"),
  };
}

function replyPartner(partner, locale) {
  const url = serviceUrl(partner.service);
  const sname = serviceName(partner.service, locale);
  return {
    text:
      locale === "en"
        ? para(
            `${partner.name} is one of Spectrum's technology partners. It is a recognized manufacturer in ${partner.en}, and within the ecosystem it is part of ${sname} (${url}).`,
            "Having several partners lets us recommend the technology that best fits each case instead of pushing a single brand.",
            `What do you need to solve with ${partner.name}? That way I can tell you how it fits.`,
          )
        : para(
            `${partner.name} es uno de los aliados tecnológicos de Spectrum. Es un fabricante reconocido en ${partner.es}, y dentro del ecosistema hace parte de ${sname} (${url}).`,
            "Contar con varios aliados permite recomendar la tecnología que mejor encaje en cada caso en lugar de empujar una sola marca.",
            `¿Qué necesitas resolver con ${partner.name}? Así te digo cómo encaja.`,
          ),
    suggestions: chips(locale, "service"),
  };
}

function replyThanks(locale) {
  return {
    text:
      locale === "en"
        ? `You are welcome. If something else comes up, I am here, and if you want to move forward with the team you can write to ${EMAIL}.`
        : `Con gusto. Si surge algo más, aquí estoy, y si quieres avanzar con el equipo puedes escribir a ${EMAIL}.`,
    suggestions: chips(locale, "after"),
  };
}

function replyBye(locale) {
  return {
    text:
      locale === "en"
        ? `Thanks for stopping by. Whenever you need technology advice, come back, or write to ${EMAIL}. Have a great day.`
        : `Gracias por escribir. Cuando necesites asesoría en tecnología, vuelve, o escríbenos a ${EMAIL}. Que tengas un excelente día.`,
    suggestions: [],
  };
}

/* Respuesta cuando no se entiende: nunca un "no se". Orienta y pregunta. */
function replyClarify(locale, a) {
  const partial = a.services[0];
  const outOfScope =
    !partial &&
    a.tokens.length >= 3 &&
    /\b(cual|que|quien|quienes|cuando|donde|como|cuanto|por que|why|what|who|when|where|how)\b/.test(
      a.norm,
    );
  const hint = partial
    ? locale === "en"
      ? `From what you say, it might relate to ${serviceName(partial.id, locale)}. `
      : `Por lo que comentas, podría relacionarse con ${serviceName(partial.id, locale)}. `
    : "";
  return {
    text:
      locale === "en"
        ? para(
            `${outOfScope ? "That question is outside what I can advise on: my specialty is business technology. " : ""}${hint}I want to advise you well, so I need a bit more context. Which of these is closest to what you need?`,
            bullets([
              "something is failing or slow (systems, network, servers)",
              "concern about security (attacks, viruses, phishing, data protection)",
              "you want to grow, modernize or migrate to the cloud",
              "you need support, equipment or a technology partner",
              "you want to automate a process or build an application",
            ]),
            "You can also tell me your sector and I will show you how our services apply. My expertise is business technology, so I can help most with questions in that area.",
          )
        : para(
            `${outOfScope ? "Esa consulta se sale de lo que puedo asesorar: mi especialidad es la tecnología empresarial. " : ""}${hint}Quiero asesorarte bien y para eso necesito un poco más de contexto. ¿Cuál de estas opciones se parece más a lo que necesitas?`,
            bullets([
              "algo está fallando o lento (sistemas, red, servidores)",
              "preocupación por la seguridad (ataques, virus, phishing, protección de datos)",
              "quieres crecer, modernizar o migrar a la nube",
              "necesitas soporte, equipos o un aliado tecnológico",
              "quieres automatizar un proceso o construir una aplicación",
            ]),
            "También puedes contarme tu sector y te muestro cómo aplican nuestros servicios. Mi especialidad es la tecnología empresarial, así que ahí es donde más te puedo ayudar.",
          ),
    suggestions: chips(locale, "start"),
  };
}

/* ---------------- Enrutamiento ---------------- */

const isShort = (a) => a.tokens.length <= 7;

export function generateAdvice({ messages, locale = "es" }) {
  const lang = locale === "en" ? "en" : "es";
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const text = lastUser ? lastUser.content : "";

  if (detectUserSecrets(text)) {
    return {
      reply: L(SECRET_WARNING, lang),
      suggestions: chips(lang, "start"),
      intent: "user_secret",
      blocked: true,
    };
  }

  const inspection = inspectInput(text);
  if (inspection.blocked) {
    return {
      reply: refusalFor(inspection.category, lang),
      suggestions: chips(lang, "start"),
      intent: `blocked:${inspection.category}`,
      blocked: true,
    };
  }

  const a = analyze(text);
  const ctx = buildContext(messages);
  const { intents } = a;

  const done = (result, intent) => ({
    reply: result.text.replace(/—/g, ","),
    suggestions: result.suggestions || [],
    cta: result.cta || null,
    intent,
    blocked: false,
  });

  // Seguimientos: heredan el tema de la conversacion.
  const followUp =
    !a.hasEntity && (intents.affirm || intents.more || isShort(a));
  const service = a.services[0]?.id || (followUp ? ctx.service : null);
  const sector = a.sectors[0]?.id || (followUp ? ctx.sector : null);
  const problem = a.problems[0]?.id || (followUp ? ctx.problem : null);
  const buying = intents.buying || intents.contact || intents.price;
  const urgent = intents.urgent;
  const shape = { ctx: { ...ctx, service, sector, problem } };

  // Prioridades: cierre, objeciones, cotizacion/contacto, problemas.
  if (intents.thanks && isShort(a) && !a.hasEntity)
    return done(replyThanks(lang), "thanks");
  if (intents.bye && isShort(a) && !a.hasEntity)
    return done(replyBye(lang), "bye");

  if (a.objection)
    return done(replyObjection(a.objection, lang), `objection:${a.objection}`);

  if (intents.greeting && isShort(a) && !a.hasEntity)
    return done(replyGreeting(lang), "greeting");
  if (intents.identity && !a.hasEntity)
    return done(replyIdentity(lang), "identity");
  if (intents.capabilities && !a.hasEntity)
    return done(replyCapabilities(lang), "capabilities");

  if (intents.help && isShort(a) && !a.hasEntity)
    return done(replyHelp(lang), "help");

  if (intents.concept && a.glossary && !intents.urgent) {
    return done(replyGlossary(a.glossary, lang, ctx), "glossary");
  }

  if (intents.price)
    return done(
      replyPrice(lang, { ctx: shape.ctx, serviceId: service }),
      "price",
    );
  if (intents.timeline) return done(replyTimeline(lang, shape.ctx), "timeline");
  if (intents.certifications)
    return done(replyCertifications(lang), "certifications");
  if (intents.coverage) return done(replyCoverage(lang), "coverage");
  if (intents.support247 && !a.problems[0])
    return done(replySupport247(lang), "support247");
  if (intents.trust) return done(replyTrust(lang), "trust");
  if (intents.competition) return done(replyCompetition(lang), "competition");
  if (intents.dataSafety && !a.problems[0])
    return done(replyDataSafety(lang), "dataSafety");
  if (intents.languages) return done(replyLanguages(lang), "languages");
  if (intents.training && !a.problems[0])
    return done(replyTraining(lang), "training");

  if (intents.contact && !a.problems[0] && !a.glossary)
    return done(replyContact(lang, shape), "contact");

  if (a.problems[0] || (urgent && problem)) {
    const preventive =
      !urgent && PREVENTIVE.test(a.norm) && !INCIDENT.test(a.norm);
    return done(
      replyProblem(problem, lang, {
        ctx: shape.ctx,
        urgent,
        preventive,
        sectorId: sector,
        previous: ctx.turns > 0,
      }),
      `problem:${problem}`,
    );
  }

  if (followUp && problem && !a.glossary) {
    return done(
      replyProblemFollowUp(problem, lang, { ctx: shape.ctx, sectorId: sector }),
      `problem-followup:${problem}`,
    );
  }

  if (
    a.glossary &&
    (intents.concept ||
      (a.tokens.length <= 2 && !a.glossary.broad && !intents.buying))
  ) {
    return done(replyGlossary(a.glossary, lang, ctx), "glossary");
  }

  if (intents.compare && a.services.length >= 2) {
    return done(
      replyCompare([a.services[0].id, a.services[1].id], lang),
      "compare",
    );
  }

  if (intents.partners) return done(replyPartners(lang), "partners");
  if (intents.cases && !sector) return done(replyCases(lang), "cases");
  if (intents.team) return done(replyTeam(lang), "team");
  if (intents.location) return done(replyLocation(lang), "location");
  if (intents.process) return done(replyProcess(lang, shape.ctx), "process");
  if (intents.servicesOverview)
    return done(replyServicesOverview(lang), "services");
  if (intents.about) return done(replyAbout(lang), "about");

  if (intents.navigation) {
    const nav = replyNavigation(a.norm, lang);
    if (nav) return done(nav, "navigation");
  }

  // Sector (con o sin servicio).
  if (sector && (a.sectors[0] || (!service && followUp))) {
    return done(
      replySector(sector, lang, {
        serviceId: service,
        ctx: shape.ctx,
        strong: buying,
      }),
      "sector",
    );
  }

  // Aliado por marca.
  if (
    a.partner &&
    !a.problems[0] &&
    (isShort(a) ||
      /(trabajan con|manejan|son partner|aliado|distribuyen|venden|implementan|saber de|hablame de|cuentame de|tienen)/.test(
        a.norm,
      ))
  ) {
    return done(replyPartner(a.partner, lang), `partner:${a.partner.name}`);
  }

  // Servicio.
  if (service) {
    return done(
      replyService(service, lang, {
        ctx: shape.ctx,
        strong: buying,
        sectorId: sector,
      }),
      `service:${service}`,
    );
  }

  // Seguimiento sobre lo que el asistente acaba de decir ("y cuales son esos?").
  if (
    /(servicios|soluciones|frentes)/i.test(ctx.lastAssistant) &&
    /(cuales|esos|esas|enumer|list|detall|nombr|cuentame|explica|cuenta)/.test(
      a.norm,
    ) &&
    !a.hasEntity
  ) {
    return done(replyServicesOverview(lang), "services");
  }

  if (intents.cases) return done(replyCases(lang), "cases");
  if (intents.greeting) return done(replyGreeting(lang), "greeting");
  if (a.glossary) return done(replyGlossary(a.glossary, lang, ctx), "glossary");

  // Seguimiento sin tema previo: retoma la conversacion.
  if ((intents.affirm || intents.more) && ctx.lastAssistant) {
    return done(replyServicesOverview(lang), "services");
  }
  if (intents.help || intents.more || intents.affirm) {
    return done(replyHelp(lang), "help");
  }

  return done(replyClarify(lang, a), "clarify");
}

/*
  Resumen del hilo para Gemini: sector, necesidad y servicio detectados en
  los mensajes previos, y el numero de turnos. Ayuda a que el modelo
  mantenga la coherencia (no repetir preguntas ya respondidas ni el cierre
  comercial) igual que lo hace el asesor local.
*/
export function conversationHint(messages, locale = "es") {
  const lang = locale === "en" ? "en" : "es";
  const ctx = buildContext(messages);
  const last = [...messages].reverse().find((m) => m.role === "user");
  const now = last ? analyze(last.content) : null;
  const sector = now?.sectors[0]?.id || ctx.sector;
  const problem = now?.problems[0]?.id || ctx.problem;
  const service = now?.services[0]?.id || ctx.service;

  const lines = [
    `Turnos de asistente hasta ahora: ${ctx.turns}.`,
    sector ? `Sector detectado: ${L(SECTORS[sector].name, lang)}.` : "",
    problem
      ? `Necesidad o problema detectado: ${L(PROBLEMS[problem].title, lang)}.`
      : "",
    service ? `Servicio más relacionado: ${serviceName(service, lang)}.` : "",
  ].filter(Boolean);

  return [
    "# CONTEXTO DE ESTA CONVERSACIÓN (uso interno, no lo menciones)",
    ...lines,
    "Mantén la coherencia con lo ya dicho: no repitas preguntas que la persona ya respondió, retoma su sector y su necesidad, no repitas el cierre comercial si ya lo diste y responde a lo que acaba de escribir en el contexto de todo el hilo.",
  ].join("\n");
}
