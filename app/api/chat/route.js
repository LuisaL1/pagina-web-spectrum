import {
  buildSystemPrompt,
  FALLBACK_MESSAGE,
  FALLBACK_MESSAGE_EN,
} from "@/lib/assistant-prompt";
import { conversationHint, generateAdvice } from "@/lib/advisor/engine";
import { detectUserSecrets, sanitizeOutput } from "@/lib/advisor/security";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const GEMINI_MODEL_DEFAULT = "gemini-flash-latest";
const GEMINI_TIMEOUT_MS = 15000;
const MAX_HISTORY_MESSAGES = 12;
const RATE_LIMIT = 20;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;

/*
  Flujo de una consulta:
    1. El asesor local (lib/advisor) analiza el mensaje. Si es una consulta
       sensible, un intento de manipulacion o trae secretos del usuario, se
       responde ahi mismo y NUNCA se envia a Gemini.
    2. Sin llave, o si Gemini falla, agota el tiempo o devuelve algo vacio o
       no seguro, responde el asesor local: SpectrIA sigue asesorando.
    3. Lo que responde Gemini pasa por sanitizeOutput antes de salir.
*/
export async function POST(request) {
  const { limited, retryAfterSeconds } = rateLimit({
    key: `chat:${getClientIp(request)}`,
    limit: RATE_LIMIT,
    windowMs: RATE_LIMIT_WINDOW_MS,
  });
  if (limited) {
    return Response.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en unos minutos." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const messages = Array.isArray(body?.messages) ? body.messages : [];
  const locale = body?.locale === "en" ? "en" : "es";
  const fallback = locale === "en" ? FALLBACK_MESSAGE_EN : FALLBACK_MESSAGE;

  const clean = messages
    .filter(
      (msg) =>
        msg &&
        (msg.role === "user" || msg.role === "assistant") &&
        typeof msg.content === "string" &&
        msg.content.trim().length > 0,
    )
    .slice(-MAX_HISTORY_MESSAGES)
    .map((msg) => ({ role: msg.role, content: msg.content.slice(0, 2000) }));

  if (clean.length === 0 || clean[clean.length - 1].role !== "user") {
    return Response.json({ error: "Mensaje vacío." }, { status: 400 });
  }

  // 1. Asesor local: analisis y barrera de seguridad previa a cualquier modelo.
  const advice = generateAdvice({ messages: clean, locale });
  const local = (source) =>
    Response.json({
      reply: advice.reply,
      suggestions: advice.suggestions,
      cta: advice.cta,
      source,
    });

  if (advice.blocked) return local("guard");

  // Quiere hablar con una persona: respuesta directa con boton de WhatsApp.
  if (advice.intent === "contact") return local("local-contact");

  // 2. Sin llave: el asesor local responde solo.
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return local("local");

  // El historial que sale hacia Gemini no incluye mensajes con secretos.
  const contents = clean
    .filter((msg) => !(msg.role === "user" && detectUserSecrets(msg.content)))
    .map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

  const model = process.env.GEMINI_MODEL || GEMINI_MODEL_DEFAULT;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const payload = {
    systemInstruction: {
      parts: [
        {
          text: `${buildSystemPrompt(locale)}\n\n${conversationHint(clean, locale)}`,
        },
      ],
    },
    contents,
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2048,
      thinkingConfig: { thinkingLevel: "low" },
    },
  };

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
    });
  } catch {
    return local("local-network");
  }

  if (!response.ok) {
    console.error("Gemini error status:", response.status);
    return local("local-gemini");
  }

  let data;
  try {
    data = await response.json();
  } catch {
    return local("local-gemini");
  }

  const parts = data?.candidates?.[0]?.content?.parts || [];
  const raw = parts
    .filter((part) => typeof part?.text === "string" && !part.thought)
    .map((part) => part.text)
    .join("")
    .trim();
  // Una respuesta que termina en ":" quedo cortada (sin la lista o el cierre).
  const truncated = /[:,]\s*$/.test(raw);

  const checked = sanitizeOutput(raw);
  if (!raw || raw === fallback || truncated || !checked.safe) {
    console.warn("chat: respuesta de Gemini descartada", {
      empty: !raw,
      generic: raw === fallback,
      truncated,
      unsafe: !checked.safe,
    });
    return local("local-fallback");
  }

  return Response.json({
    reply: checked.text,
    suggestions: advice.suggestions,
    source: "gemini",
  });
}
