"use client";

import { useState } from "react";
import ContactModal from "./ContactModal";

const content = {
  es: { requestInfo: "Solicitar información" },
  en: { requestInfo: "Request information" },
};

export default function InfoRequestForm({
  serviceName,
  serviceSlug,
  locale = "es",
}) {
  const t = content[locale] || content.es;
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => setOpen(true)}
      >
        {t.requestInfo}
      </button>

      <ContactModal
        open={open}
        onClose={() => setOpen(false)}
        serviceName={serviceName}
        serviceSlug={serviceSlug}
        locale={locale}
      />
    </>
  );
}
