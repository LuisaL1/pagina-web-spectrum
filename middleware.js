import { NextResponse } from "next/server";

// CSP con nonce por peticion (patron oficial de Next.js App Router). El
// unico tercero es Google Analytics; fuera de eso el sitio no depende de
// fuentes externas en runtime (next/font auto-hospeda Google Fonts), asi que
// script-src puede ser estricto: 'strict-dynamic' confia en los scripts que
// llevan el nonce (incluido gtag.js, ver components/GoogleAnalytics.js) y en
// los que esos mismos scripts carguen, ignorando listas de origenes para
// navegadores que lo soportan, con 'self' y googletagmanager.com como
// respaldo para los que no. img-src y connect-src permiten los dominios de
// Google Analytics porque gtag envia las visitas por fetch/beacon/pixel.
// style-src si necesita 'unsafe-inline': varios
// componentes usan la prop `style` de React (fondos dinamicos, transforms de
// los carruseles) que el navegador aplica como atributo `style=""` inline, y
// CSP no cubre eso con nonce (solo cubre <style> como elemento, no el
// atributo) sin reescribir esos componentes a variables CSS. Verificado con
// un build de produccion real + Playwright antes de habilitarla.
function buildCsp(nonce) {
  // 'unsafe-eval' solo en desarrollo: el Fast Refresh/HMR de `next dev`
  // envuelve los modulos con eval() para mejores stack traces, y sin este
  // permiso ningun componente cliente (menu, buscador, chat) ejecuta su JS
  // en local. El build de produccion (`next build` + `next start`) no usa
  // eval y no lo necesita -- verificado que ahi la CSP queda completa.
  const scriptSrc =
    process.env.NODE_ENV === "development"
      ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval' https://www.googletagmanager.com`
      : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com`;

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https://*.google-analytics.com https://*.googletagmanager.com",
    "font-src 'self'",
    "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export function middleware(request) {
  const locale = request.nextUrl.pathname.startsWith("/en") ? "en" : "es";
  const nonce = btoa(crypto.randomUUID());
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("x-locale", locale);
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
