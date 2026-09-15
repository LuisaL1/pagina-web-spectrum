"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CloseIcon } from "../icons";
import { localizedHref } from "@/lib/i18n";

const content = {
  es: {
    requestInfo: "Solicitar información",
    close: "Cerrar",
    thanks: "¡Gracias por su interés!",
    received: (serviceName) =>
      `Recibimos su solicitud sobre ${serviceName}. Nuestro equipo le responderá a la brevedad.`,
    fullName: "Nombre completo *",
    corporateEmail: "Correo corporativo *",
    company: "Empresa *",
    role: "Cargo",
    phone: "Teléfono",
    serviceOfInterest: "Servicio de interés",
    message: "Mensaje",
    messagePlaceholder: "Cuéntenos en qué podemos ayudarle",
    consentPrefix: "Autorizo el tratamiento de mis datos personales conforme a la",
    privacyPolicy: "política de privacidad",
    consentSuffix: "de Spectrum. *",
    sending: "Enviando...",
    submit: "Enviar solicitud",
    genericError:
      "No pudimos enviar su solicitud. Intente de nuevo o escríbanos a soporte@spectrumt.co.",
  },
  en: {
    requestInfo: "Request information",
    close: "Close",
    thanks: "Thanks for your interest!",
    received: (serviceName) =>
      `We received your request about ${serviceName}. Our team will get back to you shortly.`,
    fullName: "Full name *",
    corporateEmail: "Corporate email *",
    company: "Company *",
    role: "Role",
    phone: "Phone",
    serviceOfInterest: "Service of interest",
    message: "Message",
    messagePlaceholder: "Tell us how we can help you",
    consentPrefix: "I authorize the processing of my personal data in accordance with the",
    privacyPolicy: "privacy policy",
    consentSuffix: "of Spectrum. *",
    sending: "Sending...",
    submit: "Submit request",
    genericError:
      "We couldn't send your request. Please try again or email us at soporte@spectrumt.co.",
  },
};

export default function InfoRequestForm({ serviceName, serviceSlug, locale = "es" }) {
  const t = content[locale] || content.es;
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function close() {
    setOpen(false);
    setSubmitted(false);
    setError(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSending(true);
    setError(null);

    const data = new FormData(event.target);
    const payload = {
      nombre: data.get("nombre"),
      correo: data.get("correo"),
      empresa: data.get("empresa"),
      cargo: data.get("cargo"),
      telefono: data.get("telefono"),
      mensaje: data.get("mensaje"),
      servicio: serviceName,
      servicioSlug: serviceSlug,
    };

    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || "request-failed");
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err.message && err.message !== "request-failed"
          ? err.message
          : t.genericError
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button type="button" className="btn btn-outline" onClick={() => setOpen(true)}>
        {t.requestInfo}
      </button>

      {open && (
        <div className="modal-overlay" onClick={close}>
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-form-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              aria-label={t.close}
              onClick={close}
            >
              <CloseIcon size={16} />
            </button>

            {submitted ? (
              <div className="modal-success">
                <h3>{t.thanks}</h3>
                <p>{t.received(serviceName)}</p>
                <button type="button" className="btn btn-primary" onClick={close}>
                  {t.close}
                </button>
              </div>
            ) : (
              <>
                <p className="eyebrow">{t.requestInfo}</p>
                <h3 id="info-form-title">{serviceName}</h3>
                <form className="info-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <label>
                      {t.fullName}
                      <input type="text" name="nombre" required />
                    </label>
                    <label>
                      {t.corporateEmail}
                      <input type="email" name="correo" required />
                    </label>
                  </div>
                  <div className="form-row">
                    <label>
                      {t.company}
                      <input type="text" name="empresa" required />
                    </label>
                    <label>
                      {t.role}
                      <input type="text" name="cargo" />
                    </label>
                  </div>
                  <div className="form-row">
                    <label>
                      {t.phone}
                      <input type="tel" name="telefono" />
                    </label>
                    <label>
                      {t.serviceOfInterest}
                      <input type="text" value={serviceName} disabled />
                    </label>
                  </div>
                  <label className="form-field-full">
                    {t.message}
                    <textarea
                      name="mensaje"
                      rows={3}
                      placeholder={t.messagePlaceholder}
                    />
                  </label>
                  <label className="form-checkbox">
                    <input type="checkbox" name="consentimiento" required />
                    <span>
                      {t.consentPrefix}{" "}
                      <Link
                        href={localizedHref(locale, "/politica-de-datos")}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t.privacyPolicy}
                      </Link>{" "}
                      {t.consentSuffix}
                    </span>
                  </label>
                  {error && <p className="form-error">{error}</p>}
                  <button
                    type="submit"
                    className="btn btn-primary form-submit"
                    disabled={sending}
                  >
                    {sending ? t.sending : t.submit}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
