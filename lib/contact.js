// Canal comercial por WhatsApp (mismo numero que el boton "Hablemos" del sitio).
export const WHATSAPP_NUMBER = "573124650754";

export function whatsappUrl(message) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
