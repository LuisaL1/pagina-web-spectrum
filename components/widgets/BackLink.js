"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

/*
  Enlace "volver": si la persona llego desde otra pagina del sitio, regresa
  en el historial para que el navegador restaure el scroll donde estaba.
  Si entro directo (sin historial propio), navega al href de respaldo.
*/
export default function BackLink({ href, onClick, children, ...props }) {
  const router = useRouter();

  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0)
      return;

    let cameFromSite = false;
    try {
      cameFromSite =
        document.referrer !== "" &&
        new URL(document.referrer).origin === window.location.origin;
    } catch {
      cameFromSite = false;
    }

    if (cameFromSite && window.history.length > 1) {
      event.preventDefault();
      router.back();
    }
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
