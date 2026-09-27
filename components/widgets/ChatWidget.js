"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CloseIcon, SendIcon } from "../icons";

const MASCOT = "/logos/spectria-mascota.png";

function Mascot({ size }) {
  return (
    <Image
      src={MASCOT}
      alt=""
      width={size}
      height={size}
      className="chat-mascot"
      aria-hidden="true"
    />
  );
}

const content = {
  es: {
    greeting:
      "Hola, soy SpectrIA, el asistente virtual de Spectrum. ¿En qué puedo ayudarte?",
    starters: [
      "¿Qué servicios ofrecen?",
      "Tenemos caídas y lentitud",
      "¿Cómo protegen a una empresa de ransomware?",
      "Quiero hablar con un asesor",
    ],
    dialogLabel: "SpectrIA, asistente virtual de Spectrum",
    aiBadge: "IA",
    subtitle: "Asistente virtual de Spectrum",
    disclaimer:
      "SpectrIA es una IA: sus respuestas son orientativas. No compartas contraseñas ni datos sensibles.",
    close: "Cerrar chat",
    placeholder: "Escribe tu pregunta...",
    send: "Enviar",
    openAssistant: "Pregúntale a SpectrIA",
    openAssistantLabel: "Preguntar a SpectrIA, asistente virtual de Spectrum",
    noInfo:
      "No dispongo de información suficiente para responder esa consulta. Te recomiendo contactar directamente con nuestro equipo.",
    connectionError:
      "Tuvimos un problema de conexión. Intenta de nuevo o escribe a soporte@spectrumt.co.",
  },
  en: {
    greeting:
      "Hi, I'm SpectrIA, Spectrum's virtual assistant. How can I help you?",
    starters: [
      "What services do you offer?",
      "We have outages and slowness",
      "How do you protect a company from ransomware?",
      "I want to talk to an advisor",
    ],
    dialogLabel: "SpectrIA, Spectrum's virtual assistant",
    aiBadge: "AI",
    subtitle: "Spectrum virtual assistant",
    disclaimer:
      "SpectrIA is an AI: its answers are guidance only. Do not share passwords or sensitive data.",
    close: "Close chat",
    placeholder: "Type your question...",
    send: "Send",
    openAssistant: "Ask SpectrIA",
    openAssistantLabel: "Ask SpectrIA, Spectrum's virtual assistant",
    noInfo:
      "I don't have enough information to answer that question. I'd recommend contacting our team directly.",
    connectionError:
      "We had a connection issue. Please try again or email us at soporte@spectrumt.co.",
  },
};

export default function ChatWidget({ locale = "es" }) {
  const t = content[locale] || content.es;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: t.greeting },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [suggestions, setSuggestions] = useState(t.starters);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (!isTouchDevice) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, sending, open]);

  function sendMessage(event) {
    event.preventDefault();
    submit(input);
  }

  async function submit(rawText) {
    const text = rawText.trim();
    if (!text || sending) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setSuggestions([]);
    setSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, locale }),
      });
      const data = await response.json();
      setSuggestions(
        Array.isArray(data.suggestions) ? data.suggestions.slice(0, 4) : [],
      );
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply || t.noInfo,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: t.connectionError,
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-panel" role="dialog" aria-label={t.dialogLabel}>
          <div className="chat-panel-header">
            <span className="chat-header-avatar">
              <Mascot size={44} />
            </span>
            <div className="chat-panel-title">
              <strong>
                SpectrIA
                <span className="chat-ai-badge">{t.aiBadge}</span>
              </strong>
              <span>{t.subtitle}</span>
            </div>
            <button
              type="button"
              className="chat-close"
              aria-label={t.close}
              onClick={() => setOpen(false)}
            >
              <CloseIcon size={18} />
            </button>
          </div>

          <div className="chat-messages" ref={listRef}>
            {messages.map((msg, index) =>
              msg.role === "assistant" ? (
                <div
                  key={index}
                  className={`chat-row${index === 0 ? " chat-row--hero" : ""}`}
                >
                  <span className="chat-avatar">
                    <Mascot size={index === 0 ? 132 : 40} />
                  </span>
                  <div className="chat-bubble assistant">{msg.content}</div>
                </div>
              ) : (
                <div key={index} className="chat-bubble user">
                  {msg.content}
                </div>
              ),
            )}
            {sending && (
              <div className="chat-row">
                <span className="chat-avatar">
                  <Mascot size={40} />
                </span>
                <div className="chat-bubble assistant chat-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </div>

          {suggestions.length > 0 && !sending && (
            <div className="chat-suggestions">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="chat-suggestion"
                  onClick={() => submit(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <p className="chat-disclaimer">{t.disclaimer}</p>

          <form className="chat-input-row" onSubmit={sendMessage}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t.placeholder}
              aria-label={t.placeholder}
              autoComplete="off"
              disabled={sending}
            />
            <button
              type="submit"
              className="chat-send"
              aria-label={t.send}
              disabled={sending || !input.trim()}
            >
              <SendIcon size={16} />
            </button>
          </form>
        </div>
      )}

      {!open && (
        <button
          type="button"
          className="chat-toggle"
          aria-label={t.openAssistantLabel}
          onClick={() => setOpen(true)}
        >
          <span className="chat-toggle-icon" aria-hidden="true">
            <Mascot size={46} />
          </span>
          <span className="chat-toggle-label">{t.openAssistant}</span>
          <span className="chat-toggle-ai" aria-hidden="true">
            {t.aiBadge}
          </span>
        </button>
      )}
    </div>
  );
}
