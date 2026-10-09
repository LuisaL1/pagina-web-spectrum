import { headers } from "next/headers";
import Script from "next/script";

/*
  Google Analytics (gtag.js). Se carga con next/script en vez de un <script>
  suelto en el <head>, que es la forma recomendada por Next.js: no bloquea
  el render y no interfiere con la hidratacion.

  No se monta si falta NEXT_PUBLIC_GA_ID (por ejemplo, en desarrollo local
  sin la variable configurada), para no ensuciar las metricas ni gastar la
  cuota del proyecto de Analytics con visitas de prueba.
*/
export default async function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  // Nonce de la CSP (lo genera middleware.js): sin el, script-src bloquea
  // tanto el gtag.js externo como el snippet inline de configuracion.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
        nonce={nonce}
      />
      <Script id="google-analytics" strategy="afterInteractive" nonce={nonce}>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
