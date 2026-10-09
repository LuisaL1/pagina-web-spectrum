# Arquitectura del proyecto

Este documento describe el modelo de arquitectura de software aplicado en Spectrum Web y las buenas prácticas de ingeniería asociadas, en el marco de una práctica de "modelo de buenas prácticas y arquitectura de software".

## Modelo elegido: arquitectura por capas

Se evaluaron los modelos habituales de arquitectura de software:

| Modelo | ¿Por qué se descartó o se eligió? |
| --- | --- |
| **Por capas (elegido)** | Encaja naturalmente con Next.js App Router: la presentación (rutas + UI), la lógica de negocio y el acceso a datos ya están conceptualmente separados en el proyecto; solo faltaba hacerlo explícito en la estructura de carpetas. |
| Hexagonal (puertos y adaptadores) | Aísla el núcleo de negocio de infraestructura externa mediante interfaces. Se descartó porque exigiría crear puertos/adaptadores para un dominio pequeño (contenido de un sitio corporativo) sin un beneficio real: no hay múltiples adaptadores intercambiables (una sola fuente de datos, un solo framework web). |
| Microservicios | Divide la aplicación en servicios independientes desplegables por separado. No aplica: este es un único sitio Next.js con un solo despliegue; partirlo en servicios introduciría complejidad operativa sin necesidad de negocio. |
| MVC clásico | El modelo Modelo-Vista-Controlador asume controladores explícitos orquestando vistas y modelos. El App Router de Next.js (Server/Client Components + Route Handlers) no mapea limpiamente a esa separación tradicional. |

## Mapeo de capas a carpetas

```
CAPA DE PRESENTACIÓN        app/  +  components/
CAPA DE NEGOCIO (servicios) lib/
CAPA DE DATOS                data/
```

| Capa | Carpeta | Responsabilidad |
| --- | --- | --- |
| Presentación | `app/` | Rutas del App Router y *route handlers* (`app/api/*/route.js`), que actúan como controladores: reciben la petición HTTP y orquestan las capas inferiores. |
| Presentación | `components/layout/` | Chrome de la aplicación compartido entre páginas: `Header`, `Footer`. |
| Presentación | `components/sections/` | Bloques de contenido de una página (`Hero`, `Ecosystem`, `Solutions`, `Partners`, `ClientsLogos`, `Blog`, `BlogArchive`, `Team`, `Culture`, `Novedades`, `DataPolicy`, `CtaStrip`). |
| Presentación | `components/widgets/` | Piezas interactivas autocontenidas (`ChatWidget`, `SearchModal`, `InfoRequestForm`). |
| Negocio | `lib/` | Reglas y lógica de la aplicación: `assistant-prompt.js` (arma el prompt del asistente IA), `search-index.js` (lógica de búsqueda), `email-templates.js` (genera el HTML de los correos), `validation.js` (valida y normaliza las entradas del formulario de contacto). |
| Datos | `data/` | Contenido y datos estáticos: `solutions-data.js`, `knowledge-base.json`, `articles.js` (artículos técnicos del blog, `/blog/[slug]`), `news.js` (noticias de la empresa, `/novedades/[slug]`). |

`styles/` es transversal a la capa de presentación y refleja la misma subdivisión (`shared/`, `layout/`, `sections/`, `widgets/`), para que cada archivo CSS tenga un dueño claro.

## Regla de dependencia entre capas

Las capas inferiores **no conocen** a las superiores:

- `data/` no importa nada de `lib/` ni de `app/`.
- `lib/` puede leer de `data/`, pero no importa nada de `app/` ni de `components/`.
- `app/` (presentación) es quien orquesta: los *route handlers* importan de `lib/` y `data/`, nunca al revés.

Ejemplo real: `app/api/contacto/route.js` (presentación) llama a `validateContactPayload` (`lib/validation.js`, negocio) y a `getSolutionBySlug` (`data/solutions-data.js`, datos) — pero ninguno de esos dos módulos sabe que existe la ruta que los invoca.

## Principios SOLID aplicados

- **Single Responsibility (SRP)**: cada módulo de `lib/` tiene una única razón para cambiar — `email-templates.js` solo genera HTML de correos, `validation.js` solo valida datos de entrada, `search-index.js` solo indexa/busca contenido. En `components/`, cada componente renderiza una única sección o widget.
- **Open/Closed (OCP)**: `data/solutions-data.js` se extiende agregando nuevos objetos de solución al array `solutions`, sin modificar los componentes que lo consumen (`Header`, `Solutions`, la página de detalle de solución).
- **Dependency Inversion (DIP)**: los *route handlers* dependen de funciones expuestas por `lib/`/`data/` (`getSolutionBySlug`, `validateContactPayload`, `buildSystemPrompt`) en lugar de conocer la forma interna de los datos (estructura del JSON, reglas de validación) — esa forma puede cambiar sin tocar la capa de presentación.

## Buenas prácticas de seguridad

- Secretos (`BREVO_API_KEY`, `GEMINI_API_KEY`, etc.) se leen únicamente vía `process.env`, nunca hardcodeados en el código.
- `.env.local` está excluido del control de versiones (`.gitignore`), por lo que las credenciales nunca llegan al repositorio.
- El HTML de los correos (`lib/email-templates.js`) escapa cualquier valor interpolado (`escapeHtml`) antes de insertarlo, previniendo inyección de HTML a partir de datos del formulario.
- Las entradas del formulario de contacto se validan y normalizan en `lib/validation.js` (formato de email, límites de longitud, recorte de espacios) antes de reenviarlas a servicios externos (Brevo).
- Cabeceras HTTP de seguridad configuradas en `next.config.js`: `X-Content-Type-Options`, `X-Frame-Options` (anti-clickjacking), `Referrer-Policy` y `Permissions-Policy`, además de desactivar `X-Powered-By` (evita revelar el framework/versión al inspeccionar la respuesta).
- Verificado que ninguna variable de entorno de servidor (`BREVO_*`, `GEMINI_API_KEY`) llega al bundle de JavaScript del cliente.

## Rendimiento

Las imágenes de fondo de las páginas de solución (`app/soluciones/[slug]/page.js`) usan `next/image` con `fill` en vez de `background-image` inline, para que Next.js genere versiones responsive optimizadas (WebP/AVIF, múltiples resoluciones) en lugar de servir el JPEG original de hasta 3 MB a cualquier dispositivo.

## Testing

Configuración en `vitest.config.js`. Los tests están colocados junto a su archivo fuente (`lib/validation.test.js`, `data/solutions-data.test.js`, `components/sections/CtaStrip.test.jsx`), cubriendo lógica de la capa de negocio/datos y un componente de presentación simple, para validar que la separación de capas también es verificable de forma independiente.
