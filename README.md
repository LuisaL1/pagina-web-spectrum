# Spectrum — Sitio Web

Sitio web corporativo de Spectrum (infraestructura tecnológica y ciberseguridad), construido con **React** y **Next.js** (App Router, JavaScript). Basado en el Brand Book 2026, el Brochure corporativo y el Documento de Visión del sitio. La estructura de secciones y componentes está inspirada en sitios enterprise de infraestructura/ciberseguridad (tipo Nutanix), adaptada a la identidad visual de Spectrum.

No es un sitio estático: incluye rutas de servidor propias (formulario de contacto vía Brevo, asistente de IA **SpectrIA** vía Gemini) y un middleware que aplica una política de seguridad de contenido (CSP) por petición. Está desplegado en **Vercel**.

## Cómo correrlo

Requiere Node.js `>=18.18.0`.

```bash
npm install
```

Copia `.env.local.example` (o crea `.env.local`) con las variables descritas en [Variables de entorno](#variables-de-entorno) — sin ellas, el chat y el formulario de contacto responden con un error controlado en vez de funcionar.

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Otros comandos:

```bash
npm run build      # build de produccion
npm run start      # sirve el build de produccion
npm run lint       # ESLint (next/core-web-vitals)
npm run format     # Prettier
npm test           # Vitest (una sola corrida)
npm run test:watch # Vitest en modo watch
```

## Variables de entorno

| Variable | Dónde se obtiene | Uso |
| --- | --- | --- |
| `BREVO_API_KEY` | Brevo → Settings → SMTP & API | Autenticación con la API de Brevo (envío de correos y gestión de contactos). |
| `BREVO_SENDER_EMAIL` | Brevo → Senders, Domains & Dedicated IPs | Remitente de los correos; debe estar verificado en Brevo (o el dominio autenticado por completo). |
| `BREVO_SENDER_NAME` | — | Nombre visible del remitente (por defecto `Spectrum`). |
| `CONTACT_NOTIFY_EMAIL` | — | Bandeja interna que recibe cada solicitud del formulario de contacto. |
| `BREVO_LIST_ID_INFO` | Brevo → Contacts → Lists | Lista a la que se agrega el contacto tras solicitar información. |
| `BREVO_LIST_ID_BOLETIN` | Brevo → Contacts → Lists | Lista del boletín/newsletter. |
| `GEMINI_API_KEY` | Google AI Studio | Autenticación con la API de Gemini para el asistente SpectrIA. |
| `GEMINI_MODEL` | — | Opcional; sobrescribe el modelo por defecto (`gemini-flash-latest`). |
| `SITE_URL` | — | Opcional; dominio usado en SEO/sitemap. Si falta, cae a las variables automáticas de Vercel (`VERCEL_URL`). |

En Vercel, cada variable debe marcarse para los ambientes **Production** y **Development** (no solo uno), y las que son credenciales (`BREVO_API_KEY`, `GEMINI_API_KEY`) deben guardarse con **Type: Secret**. Un cambio de variables no aplica a un deployment ya construido — hace falta un **Redeploy**.

## Arquitectura

El proyecto sigue una **arquitectura por capas** (presentación / negocio / datos). El detalle completo del modelo, el porqué de esa elección frente a otros modelos (hexagonal, microservicios, MVC), la regla de dependencia entre capas y los principios SOLID aplicados están documentados en [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Estructura del proyecto

```
spectrum-web/
├── app/                          # CAPA DE PRESENTACIÓN: rutas + route handlers
│   ├── layout.js                 # Layout raiz: metadata, fuente Montserrat, CSS global
│   ├── page.js                   # Pagina de inicio (y su espejo en app/en/)
│   ├── soluciones|blog|novedades|equipo|nosotros|politica-de-datos/
│   │                              # Paginas ES; cada una tiene su espejo bajo app/en/
│   ├── robots.js, sitemap.js     # SEO tecnico generado en build time
│   └── api/                      # Route handlers: chat (SpectrIA), contacto (Brevo)
├── components/                   # CAPA DE PRESENTACIÓN: UI
│   ├── layout/                   # Header, Footer — chrome compartido entre paginas
│   ├── sections/                 # Hero, Ecosystem, Solutions, Cases, Partners,
│   │                              # Blog, Team, Culture, Novedades, DataPolicy, CtaStrip
│   ├── widgets/                  # ChatWidget, SearchModal, InfoRequestForm
│   └── icons/
├── lib/                           # CAPA DE NEGOCIO: logica de la aplicacion
│   ├── assistant-prompt.js       # Arma el prompt del asistente IA a partir de knowledge-base.json
│   ├── search-index.js           # Logica de busqueda
│   ├── email-templates.js        # Genera el HTML de los correos (escapa entradas)
│   ├── validation.js             # Valida/normaliza el payload de contacto
│   ├── rate-limit.js             # Limitador de tasa en memoria para /api/*
│   ├── i18n.js                   # Construccion de rutas localizadas (es/en)
│   ├── seo.js                    # Canonical, hreflang, Open Graph/Twitter por pagina
│   ├── structured-data.js        # JSON-LD (Organization, BreadcrumbList)
│   └── site-url.js               # Resuelve el dominio publico segun el entorno
├── data/                          # CAPA DE DATOS: contenido estatico
│   ├── solutions-data.js, articles.js, news.js, nav-menu-data.js
│   └── knowledge-base.json       # Base de conocimiento del asistente SpectrIA
├── styles/                        # Espejo de components/: shared, layout, sections, widgets
├── public/                        # Assets estaticos (logos, fondos, recursos/portafolio)
├── middleware.js                  # CSP con nonce por peticion + deteccion de idioma
├── ARCHITECTURE.md                # Modelo de arquitectura y buenas practicas aplicadas
├── vitest.config.js               # Configuracion de testing
├── package.json
├── next.config.js                 # Cabeceras HTTP de seguridad
├── jsconfig.json                  # Alias "@/" -> raiz del proyecto
└── .eslintrc.json
```

### Por qué esta organización

- **Capas explícitas**: `app/` + `components/` (presentación), `lib/` (negocio) y `data/` (datos) se corresponden 1:1 con el modelo de arquitectura documentado en `ARCHITECTURE.md`. Ninguna capa inferior importa de una superior.
- **Componentes por rol, no en una lista plana**: `components/layout` (chrome compartido), `components/sections` (bloques de una página) y `components/widgets` (piezas interactivas autocontenidas) separan responsabilidades distintas dentro de la UI.
- **Client components solo donde hace falta**: `Header`, `Cases`, `ChatWidget`, `SearchModal` e `InfoRequestForm` son los componentes con interactividad (`"use client"`); el resto son componentes de servidor, estáticos y ligeros.
- **CSS organizado por dueño**: `styles/` refleja la misma subdivisión que `components/` (`shared/`, `layout/`, `sections/`, `widgets/`), en vez de archivos monolíticos con estilos de todos los componentes mezclados.
- **`public/`**: convención de Next.js para archivos estáticos servidos tal cual (logos, fondos, PDFs del portafolio).

## Internacionalización

El sitio existe en español (`/`) y en inglés (`/en/...`). El middleware detecta el prefijo `/en` y lo expone a las páginas vía la cabecera `x-locale`; `lib/i18n.js` construye los enlaces localizados y `lib/seo.js` genera las etiquetas `hreflang` correspondientes para evitar contenido duplicado ante buscadores.

## Seguridad

- **CSP con nonce por petición** (`middleware.js`): cada request genera un nonce único que habilita únicamente los scripts que Next.js inyecta (`strict-dynamic`), en vez de depender de listas de dominios permitidos.
- **Cabeceras HTTP** (`next.config.js`): `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, y `X-Powered-By` desactivado.
- **Validación y saneamiento**: `lib/validation.js` valida el payload del formulario de contacto; `lib/email-templates.js` escapa cualquier valor interpolado antes de insertarlo en el HTML de los correos.
- **Rate limiting** (`lib/rate-limit.js`): limitador en memoria, suficiente para tráfico moderado en una sola instancia — no escala a múltiples instancias serverless concurrentes bajo alto tráfico.
- **Secretos**: se leen únicamente vía `process.env`; ninguna variable de servidor llega al bundle del cliente. Ver [Variables de entorno](#variables-de-entorno).

## Design tokens (Brand Book 2026)

Fuente única de verdad: [`styles/variables.css`](./styles/variables.css).

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-black` | `#020202` | Fondo principal |
| `--color-graphite` | `#1f1f1f` | Superficies secundarias |
| `--color-red` / `--color-red-hover` | `#fa0001` / `#d10000` | Acentos, CTAs, énfasis |
| `--color-white` | `#ffffff` | Texto sobre fondo oscuro |
| `--color-gray-100 … 700` | `#f4f4f4 → #444a54` | Jerarquía de texto/bordes |
| `--font-family-base` | Montserrat (via `next/font/google`) | Tipografía corporativa (400/500/600/800) |
| `--space-xs … xl` | `8px → 64px` | Escala de espaciado |
| `--radius-sm` / `--radius-md` | `10px` / `20px` | Bordes redondeados |

## Buenas prácticas aplicadas

- HTML semántico (`header`, `nav`, `main`, `section`, `footer`, `article`) y un enlace "saltar al contenido" para usuarios de teclado.
- Accesibilidad: `aria-label`, `aria-expanded`, `aria-controls`, `aria-pressed`, `aria-current`, soporte de foco por teclado en el submenú (`:focus-within`) y respeto de `prefers-reduced-motion`.
- CSS con variables (design tokens), sin valores mágicos repetidos, y `scroll-margin-top` para que el header sticky no tape las secciones ancladas.
- Interactividad con hooks de React (`useState`, `useEffect`) en lugar de manipulación directa del DOM.
- Mobile-first en la interacción: el menú y el submenú funcionan igual con mouse, teclado y touch.

## Testing

Vitest + Testing Library, tests colocados junto al código que cubren: validación del formulario de contacto, rate limiting, construcción de SEO (canonical/hreflang/Open Graph), datos estructurados (JSON-LD), el índice de soluciones y un componente de presentación (`CtaStrip`).

## Despliegue

El sitio corre en **Vercel**, que ejecuta el middleware y las rutas de API de Next.js de forma nativa (no requiere servidor propio ni exportación estática). Checklist antes de publicar cambios de configuración:

1. Las variables de la sección [Variables de entorno](#variables-de-entorno) existen con el ambiente **Production** marcado (no solo Development).
2. `BREVO_API_KEY` y `GEMINI_API_KEY` están guardadas como **Secret**, sin alertas de "Needs attention" en el panel de Vercel.
3. El remitente (`BREVO_SENDER_EMAIL`) o el dominio completo está verificado/autenticado en Brevo.
4. Se ejecutó **Redeploy** después del último cambio de variables — no se aplican solas a un build existente.

## Próximos pasos sugeridos

1. Extraer los datos de contenido (soluciones, artículos, noticias, aliados) a un CMS o fuente de datos externa en vez de arrays estáticos en `data/`.
2. Si el tráfico crece, mover el rate limiting de `lib/rate-limit.js` (en memoria, por instancia) a un almacén compartido (ej. Redis/Upstash) para que funcione correctamente entre instancias serverless concurrentes.
3. Definir un proceso periódico de rotación de credenciales (`BREVO_API_KEY`, `GEMINI_API_KEY`) y verificar que ninguna quede expuesta en capturas, tickets o mensajes internos.
4. Ampliar la cobertura de tests a componentes de UI adicionales (hoy solo `CtaStrip` tiene test de presentación).
