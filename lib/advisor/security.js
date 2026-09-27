/*
  Confidencialidad de SpectrIA.

  Tres capas independientes del modelo:
    1. inspectInput: clasifica la consulta ANTES de responder o de llamar a
       Gemini. Si pide informacion sensible, intenta manipular al asistente o
       pide ayuda ofensiva, se responde localmente y nunca llega al modelo.
    2. detectUserSecrets: si la persona pega credenciales, tarjetas o llaves,
       se le advierte y no se reenvia ese texto al modelo.
    3. sanitizeOutput: revisa lo que responde Gemini y descarta cualquier
       respuesta que filtre instrucciones internas, secretos o datos que no
       son publicos.

  Lo unico publico: lo que ya esta en el sitio (servicios, aliados, casos de
  exito, equipo directivo con nombre y cargo, correo de soporte).
*/

import { normalize } from "./text";

const PUBLIC_EMAILS = ["soporte@spectrumt.co"];

const CATEGORIES = [
  {
    id: "injection",
    patterns: [
      /ignora (todas )?(las |tus )?(instrucciones|reglas|indicaciones)/,
      /olvida (todas )?(las |tus )?(instrucciones|reglas|indicaciones|todo lo anterior)/,
      /ignore (all )?(the |your )?(previous |above )?(instructions|rules)/,
      /forget (all )?(your |the )?(previous |above )?(instructions|rules)/,
      /(system|developer|hidden|internal) prompt/,
      /prompt (del sistema|de sistema|inicial|interno|oculto)/,
      /instrucciones (internas|del sistema|de sistema|ocultas|iniciales|originales)/,
      /(muestrame|dime|repite|revela|imprime|copia|dame|comparte|lista) (tus|las|tu) (reglas|instrucciones|prompt|configuracion|directrices|indicaciones)/,
      /(show|tell|repeat|reveal|print|give) (me )?(your|the) (rules|instructions|prompt|configuration|guidelines)/,
      /repite (todo )?(lo|el texto) (anterior|de arriba|que se te dio)/,
      /(modo|mode) (desarrollador|developer|dios|god|sin restricciones|jailbreak|dan)/,
      /jailbreak/,
      /\bdan\b.*(sin restricciones|no rules|unrestricted)/,
      /(actua|compórtate|comportate|finge|pretende|pretend|act) (como|as|like) (si fueras|if you were|un |una |an? )?(hacker|administrador|desarrollador|root|sin filtros|unfiltered|otro asistente|otra ia)/,
      /(desactiva|quita|salta|omite|bypass|disable|remove) (tus|los|tu|las|the|your) (filtros|restricciones|reglas|limites|safeguards|filters|restrictions|limits)/,
      /eres (ahora|desde ahora) (un|una)/,
      /you are now (a|an)/,
      /base de conocimiento (completa|entera|interna)/,
      /(full|entire|internal) knowledge base/,
      /(que|what) (modelo|model) (eres|are you|usas|do you use|utilizas)/,
      /(quien|who) (te|has) (programo|creo|entreno|desarrollo|built|trained|made)/,
    ],
  },
  {
    id: "secrets",
    patterns: [
      /api ?key/,
      /gemini ?api/,
      /(clave|llave|token|secreto|secret|credencial(es)?) (de |del |de la |of |for )?(api|gemini|google|servidor|server|base de datos|database|admin|sistema|spectrum|aws|azure)/,
      /variables? de entorno/,
      /environment variables?/,
      /\benv\b/,
      /(contrasena|password|clave) (de |del |of |for )?(admin|administrador|root|servidor|wifi|correo|email|base de datos|vpn|spectrum|la empresa|los sistemas)/,
      /(dame|dime|pasame|comparte|share|give me|tell me|what is|cual es) (la |el |las |los |your |their |the )?(contrasena|password|credenciales|credentials|token|llave|api key)/,
      /(acceso|access) (a los |a las |al |to the |to )?(servidores?|panel|admin|base de datos|database|repositorio|codigo fuente|source code|backend|consola|console) (de|del|of) (spectrum|la empresa|ustedes|your|the company)/,
    ],
  },
  {
    id: "internal_business",
    patterns: [
      /(cuanto|how much) (factura|facturan|ganan|gana|vende|venden|earn|earns|make|makes|bill|bills) (spectrum|la empresa|ustedes|you|the company)/,
      /how much does (spectrum|the company|your company) (earn|make|bill|charge|pay|sell)/,
      /(ingresos|utilidades|ganancias|facturacion|margenes?|revenue|profit|estados financieros|financial statements) (anuales? |mensuales? |annual |monthly )?(de |del |of )(spectrum|la empresa|ustedes|the company|your company)/,
      /(salarios?|sueldos?|nomina|salary|salaries|payroll) (de |del |of )?(spectrum|los empleados|empleados|del equipo|the employees|your employees|ustedes)/,
      /(cuanto (le |les )?pagan|how much do you pay)/,
      /(precios?|costos?|tarifas?|descuentos?|comisiones?) (internos?|internas?|reales|de proveedor|al por mayor|para aliados|de los aliados|de canal|wholesale|internal)/,
      /(cuanto|how much) (le |les |nos |does )?(cobra|cobran|pago|pagaron|paid|pay|cost|charge|charged|charges) (a )?(redeban|la armada|armada|alcaldia|yumbo|universidad militar|nueva granada|otros clientes|other clients|a otros)/,
      /(contratos?|contracts?) (de |con |del |of |with )?(redeban|la armada|armada|alcaldia|yumbo|universidad|clientes|other clients|sus clientes)/,
      /(valor|monto|value|amount) (del |de los |of the )?(contrato|contratos|contract)/,
      /(lista|listado|list) (completa |completo |de todos |de todas |of all |of )?(sus |your |all |todos los |todas las )?(de |of )?(clientes|customers|clients|proveedores|suppliers|contratos|contracts)/,
      /(proveedores|suppliers) (internos|de spectrum|de la empresa|of spectrum|of the company)/,
      /(planes? (estrategicos?|de negocio internos?)|strategic plans?|internal business plans?|roadmap interno|internal roadmap)/,
      /(cuantos|how many) (empleados|trabajadores|clientes|contratos|employees|customers|contracts) (tiene|tienen|has|have) (spectrum|ustedes|la empresa|you|the company)/,
      /(numero|cantidad|number) (exact[oa]|de) (de )?(empleados|clientes|contratos|employees|customers) (de |of )(spectrum|ustedes|la empresa)/,
    ],
  },
  {
    id: "internal_it",
    patterns: [
      /(ip|direccion ip|puertos?|ports?|dns|arquitectura|architecture|infraestructura|infrastructure|servidores?|servers?|base de datos|database|codigo fuente|source code|repositorio|repository|github|stack tecnologico|tech stack|hosting) (interno |interna )?(de spectrum|de ustedes|de su empresa|of spectrum|of your company)/,
      /(como|how) (esta|estan|is|are) (configurad[oa]s?|protegid[oa]s?|configured|protected|built|hosted|deployed) (el sitio|la pagina|el servidor|spectrum|ustedes|the site|the website|your servers|your infrastructure)/,
      /(vulnerabilidades?|vulnerabilities|fallas|debilidades|weaknesses|puntos debiles) (de |del |en |of |in )(spectrum|su sitio|su pagina|su empresa|the site|your site|your website|your company)/,
      /(vulnerabilidades?|vulnerabilities|fallas|debilidades|weaknesses) (tiene|tienen|has|have) (el |la |su |the |your )?(sitio|pagina|web|site|website|infraestructura|empresa) ?(web)? (de |of )?(spectrum|spectrumt)/,
      /(hackear|hack|vulnerar|atacar|explotar|exploit|romper|break into|attack) (a )?(spectrum|el sitio de spectrum|la pagina de spectrum|spectrumt|su sitio|your site|your website|this website|este sitio)/,
      /(que|which|what) (tecnologias?|frameworks?|lenguajes?|librerias?|technologies|languages|libraries|stack) (usa|usan|utiliza|utilizan|uses|use) (este sitio|la pagina|el sitio|this site|the website|spectrum|su sitio|your site)/,
      /(codigo|code) (fuente )?(de |del |of )(este sitio|la pagina|del sitio|the site|the website|spectrum)/,
      /(configuracion|configuration|config) (interna|de seguridad|del servidor|internal|security|server) (de |del |of )(spectrum|ustedes|su empresa|your company)/,
    ],
  },
  {
    id: "personal_data",
    patterns: [
      /(telefono|celular|numero|movil|whatsapp|direccion|casa|correo personal|email personal|cedula|documento|redes sociales personales|personal (phone|number|address|email|cell)|home address|phone number|cell number) (personal |privado |privada |directo |directa )?(de|del|of|for) (cristian|edison|sneyder|paola|valencia|hernandez|martinez|molano|luisa|juan|leidy|sebastian|johana|los directivos|el ceo|la ceo|los empleados|empleados|the ceo|the executives|employees)/,
      /(donde vive|where does .* live|vive en|edad de|how old is|estado civil|marital status)/,
      /(correo|email|telefono|celular|phone|whatsapp) (directo |privado |personal )?(del |de la |de |of the |of )(ceo|gerente|director|directora|gerente|cristian|edison|sneyder|paola|equipo|team|manager)/,
      /(datos personales|informacion personal|personal (data|information)) (de |del |of |about )(empleados|clientes|personas|equipo|cristian|edison|sneyder|paola|employees|customers|team members)/,
    ],
  },
  {
    id: "offensive",
    patterns: [
      /(como|how (do i|to|can i)|ayudame a|help me) (hackear|hack|vulnerar|robar|steal|crackear|crack|espiar|spy on|infiltrar|infiltrate|desplegar ransomware|deploy ransomware|hacer un ddos|ddos|crear (un )?(malware|virus|ransomware|keylogger|troyano|botnet)|create (a |an )?(malware|virus|ransomware|keylogger|trojan|botnet))\b/,
      /\b(hackeame|acceder sin autorizacion|access without authorization|sin que se den cuenta|without them knowing)\b/,
      /(robar (la )?(contrasena|cuenta|cuentas|password|account|datos)|steal (a |the )?(password|account|data)|espiar (a )?(mi|una|un|el|la) (pareja|jefe|empleado|vecino|ex)|spy on (my|a|an|the) (partner|boss|employee|neighbor|ex))\b/,
      /(script|codigo|code|herramienta|tool|payload|exploit) (para|to|for) (hackear|hack|atacar|attack|robar|steal|espiar|spy|ddos|phishing|ransomware|keylogger)\b/,
      /(bypass|evadir|evade|saltar|burlar) (el |la |un |una |the |a |an )?(antivirus|edr|firewall|mfa|doble factor|autenticacion|authentication|deteccion|detection)\b/,
    ],
  },
];

const REFUSALS = {
  injection: {
    es: "Mi función es asesorarte sobre tecnología empresarial y los servicios de Spectrum, y no comparto cómo estoy configurado ni mis instrucciones internas. Sí puedo ayudarte a analizar un reto de infraestructura, ciberseguridad, conectividad, TI, IA o desarrollo. ¿Qué necesitas resolver?",
    en: "My role is to advise you on business technology and Spectrum's services, and I do not share how I am configured or my internal instructions. I can help you analyze an infrastructure, cybersecurity, connectivity, IT, AI or development challenge. What do you need to solve?",
  },
  secrets: {
    es: "Por seguridad no comparto credenciales, claves, llaves ni datos de configuración de ningún sistema, de Spectrum ni de nadie. Si necesitas acceso a algo, el camino correcto es solicitarlo por los canales oficiales escribiendo a soporte@spectrumt.co. Si te sirve, con gusto te oriento sobre buenas prácticas de gestión de credenciales y accesos.",
    en: "For security reasons I do not share credentials, keys, tokens or configuration data of any system, from Spectrum or anyone else. If you need access to something, the right path is to request it through official channels by writing to soporte@spectrumt.co. If it helps, I am happy to guide you on credential and access management best practices.",
  },
  internal_business: {
    es: "Esa es información interna de la empresa que no comparto. Sí puedo contarte todo lo público: los servicios, cómo los aplicamos por sector, los aliados tecnológicos y los casos de éxito. Y si lo que buscas es una propuesta económica para tu organización, lo mejor es hablar con el equipo comercial en soporte@spectrumt.co; ¿quieres que te ayude a dejar bien planteada tu necesidad para que te respondan más rápido?",
    en: "That is internal company information that I do not share. I can tell you everything that is public: the services, how we apply them by sector, the technology partners and the success stories. And if you are looking for a commercial proposal for your organization, the best route is the sales team at soporte@spectrumt.co; would you like help framing your need so they can respond faster?",
  },
  internal_it: {
    es: "No comparto detalles técnicos internos de los sistemas de Spectrum, como arquitectura, configuraciones o su estado de seguridad. Si tu interés es proteger la infraestructura de tu propia organización, ahí sí puedo ayudarte mucho: buenas prácticas, cómo evaluar vulnerabilidades y qué pruebas de seguridad tienen sentido. ¿Lo miramos?",
    en: "I do not share internal technical details of Spectrum's systems, such as architecture, configurations or security posture. If your interest is protecting your own organization's infrastructure, I can help a lot: best practices, how to assess vulnerabilities and which security tests make sense. Shall we look at it?",
  },
  personal_data: {
    es: "No comparto datos personales ni de contacto privado de las personas de Spectrum. Para comunicarte con el equipo, el canal oficial es soporte@spectrumt.co, y también puedes usar el formulario de cualquiera de las páginas de soluciones. ¿Sobre qué tema quieres que te atiendan? Puedo ayudarte a redactar tu solicitud.",
    en: "I do not share personal or private contact data of Spectrum's people. To reach the team, the official channel is soporte@spectrumt.co, and you can also use the form on any solutions page. What topic would you like them to help you with? I can help you draft your request.",
  },
  offensive: {
    es: "No puedo ayudar con acciones ofensivas contra sistemas, cuentas o personas sin autorización. Lo que sí puedo hacer es orientarte del lado defensivo: si necesitas medir qué tan expuesta está tu organización, una prueba de intrusión (hacking ético) autorizada es la forma correcta y segura de hacerlo, y es un servicio que ofrece Spectrum. ¿Quieres que te explique cómo funciona?",
    en: "I cannot help with offensive actions against systems, accounts or people without authorization. What I can do is guide you on the defensive side: if you need to measure how exposed your organization is, an authorized penetration test (ethical hacking) is the right and safe way, and Spectrum offers it. Want me to explain how it works?",
  },
};

export function inspectInput(text) {
  const norm = normalize(text);
  for (const category of CATEGORIES) {
    if (category.patterns.some((pattern) => pattern.test(norm))) {
      return { blocked: true, category: category.id };
    }
  }
  return { blocked: false, category: null };
}

export function refusalFor(category, locale = "es") {
  const entry = REFUSALS[category] || REFUSALS.injection;
  return locale === "en" ? entry.en : entry.es;
}

const USER_SECRET_PATTERNS = [
  /\b(?:\d[ -]*?){13,19}\b/,
  /(contrasena|password|clave|pass|pwd)\s*(es|is|:|=)\s*\S{4,}/i,
  /(api[_ -]?key|token|secret|bearer)\s*[:=]?\s*[a-z0-9_\-]{16,}/i,
  /\b(AIza[0-9A-Za-z_\-]{20,}|sk-[A-Za-z0-9]{16,}|ghp_[A-Za-z0-9]{20,})\b/,
];

export function detectUserSecrets(text) {
  const plain = String(text || "");
  const norm = normalize(plain);
  return USER_SECRET_PATTERNS.some(
    (pattern) => pattern.test(plain) || pattern.test(norm),
  );
}

export const SECRET_WARNING = {
  es: "Ojo: parece que incluiste una contraseña, una llave o un número de tarjeta en tu mensaje. Por seguridad no lo utilizo ni lo guardo, y te recomiendo no compartir credenciales ni datos financieros por este chat; si ya lo hiciste, cámbialo cuanto antes. Para tu consulta no lo necesito. ¿Me cuentas el reto sin esos datos?",
  en: "Heads up: it looks like you included a password, a key or a card number in your message. For security I do not use or store it, and I recommend not sharing credentials or financial data in this chat; if you already did, change it as soon as possible. I do not need it for your question. Can you tell me the challenge without that data?",
};

/* ---- Salida de Gemini ---- */

const OUTPUT_LEAK_PATTERNS = [
  /base de conocimiento/i,
  /--- ?fin de la base/i,
  /system ?prompt/i,
  /instrucciones (internas|del sistema)/i,
  /mis instrucciones (son|dicen|indican)/i,
  /\bmy (system )?instructions (are|say)\b/i,
  /gemini[_ ]?api[_ ]?key/i,
  /AIza[0-9A-Za-z_\-]{20,}/,
  /\bsk-[A-Za-z0-9]{16,}\b/,
  /\bbearer [a-z0-9._\-]{16,}/i,
  /process\.env/i,
  /\.env(\.local)?\b/i,
  /# ?(reglas?|objetivo|personalidad|forma de pensar)/i,
];

export function sanitizeOutput(reply) {
  const text = String(reply || "");
  if (OUTPUT_LEAK_PATTERNS.some((pattern) => pattern.test(text))) {
    return { safe: false, text: "" };
  }
  const emails = text.match(/[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}/gi) || [];
  const foreign = emails.filter(
    (email) => !PUBLIC_EMAILS.includes(email.toLowerCase()),
  );
  if (foreign.length > 0) return { safe: false, text: "" };
  return { safe: true, text };
}
