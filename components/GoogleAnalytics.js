import Script from "next/script";

/*
  Google Analytics (gtag.js). Se carga con next/script en vez de un <script>
  suelto en el <head>, que es la forma recomendada por Next.js: no bloquea
  el render y no interfiere con la hidratacion.

  No se monta si falta NEXT_PUBLIC_GA_ID (por ejemplo, en desarrollo local
  sin la variable configurada), para no ensuciar las metricas ni gastar la
  cuota del proyecto de Analytics con visitas de prueba.
*/
export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
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
