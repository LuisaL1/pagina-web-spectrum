import { getSiteUrl } from "./site-url";

const SITE_URL = getSiteUrl();
const COLOR_BLACK = "#020202";
const COLOR_RED = "#fa0001";
const COLOR_GRAPHITE = "#1f1f1f";
const COLOR_GRAY_300 = "#d6d8dd";
const COLOR_GRAY_700 = "#444a54";
const FONT_STACK = "'Montserrat', 'Segoe UI', Helvetica, Arial, sans-serif";

function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );
}

function emailShell({ preheader, bodyHtml }) {
  // Documento HTML completo (no solo un fragmento): asi los clientes de
  // correo respetan el meta de color-scheme y no reinterpretan el diseno en
  // modo oscuro invirtiendo el banner negro y el logo. bgcolor ademas de
  // background en CSS: algunos clientes ignoran uno u otro segun el motor.
  return `<!doctype html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>Spectrum</title>
<!--[if mso]>
<style>table, td, div, h1, p { font-family: Arial, sans-serif; }</style>
<![endif]-->
<style>
  :root { color-scheme: light; supported-color-schemes: light; }
  body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  body { margin: 0; padding: 0; width: 100% !important; background: #f4f4f4 !important; }
  img { -ms-interpolation-mode: bicubic; }
</style>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;opacity:0;">${escapeHtml(
    preheader,
  )}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f4f4f4" style="background:#f4f4f4;padding:32px 0;font-family:${FONT_STACK};">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:8px;overflow:hidden;">
          <tr>
            <td bgcolor="${COLOR_BLACK}" style="background-color:${COLOR_BLACK};padding:28px 36px;border-bottom:3px solid ${COLOR_RED};">
              <img
                src="${SITE_URL}/logos/logo-spectrum-email.png"
                alt="Spectrum"
                width="150"
                style="display:block;border:0;outline:none;height:auto;width:150px;"
              />
            </td>
          </tr>
          <tr>
            <td bgcolor="#ffffff" style="background-color:#ffffff;padding:36px;">
              <img
                src="${SITE_URL}/logos/logo-spectrum-black.png"
                alt="Spectrum"
                width="110"
                style="display:block;border:0;outline:none;height:auto;width:110px;margin-bottom:24px;"
              />
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td bgcolor="${COLOR_GRAPHITE}" style="background-color:${COLOR_GRAPHITE};padding:22px 36px;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:${COLOR_GRAY_300};">
                Este mensaje fue enviado porque solicitaste información en
                <a href="${SITE_URL}" style="color:#ffffff;">spectrumt.co</a>.
                Conoce nuestra
                <a href="${SITE_URL}/politica-de-datos" style="color:#ffffff;">política de tratamiento de datos</a>.
              </p>
              <p style="margin:10px 0 0;font-size:12px;color:${COLOR_GRAY_300};">
                &copy; ${new Date().getFullYear()} Spectrum Technology S.A.S
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function buildServiceRequestEmail({ solution, nombre }) {
  const firstName = escapeHtml(String(nombre || "").split(" ")[0] || "");

  const capabilitiesHtml = solution.capabilities
    .map(
      (item) => `
        <tr>
          <td style="padding:0 0 16px;vertical-align:top;width:20px;">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${COLOR_RED};margin-top:6px;"></span>
          </td>
          <td style="padding:0 0 16px;">
            <p style="margin:0;font-size:14.5px;font-weight:700;color:${COLOR_BLACK};">${escapeHtml(
              item.title,
            )}</p>
            <p style="margin:4px 0 0;font-size:13.5px;line-height:1.6;color:${COLOR_GRAY_700};">${escapeHtml(
              item.desc,
            )}</p>
          </td>
        </tr>`,
    )
    .join("");

  const valuesHtml = solution.values
    .map(
      (value) => `
        <tr>
          <td style="padding:0 0 10px;vertical-align:top;width:20px;">
            <span style="color:${COLOR_RED};font-weight:700;">&#10003;</span>
          </td>
          <td style="padding:0 0 10px;">
            <p style="margin:0;font-size:13.5px;font-weight:600;color:${COLOR_BLACK};">${escapeHtml(
              value,
            )}</p>
          </td>
        </tr>`,
    )
    .join("");

  // No todas las soluciones tienen PDF en /recursos/servicios; sin PDF no se
  // muestra el boton para no enviar un enlace roto.
  const brochureHtml =
    solution.brochure === false
      ? ""
      : `
    <table role="presentation" cellpadding="0" cellspacing="0">
      <tr>
        <td style="border-radius:6px;background:${COLOR_RED};">
          <a href="${SITE_URL}/recursos/servicios/${solution.slug}.pdf" style="display:inline-block;padding:14px 26px;font-size:12.5px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#ffffff;text-decoration:none;">
            Descargar información completa
          </a>
        </td>
      </tr>
    </table>
  `;

  const bodyHtml = `
    <p style="margin:0 0 18px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${COLOR_RED};font-weight:700;">
      Unidad de negocio ${escapeHtml(solution.icon)}
    </p>
    <h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;color:${COLOR_BLACK};">
      ${firstName ? `Hola ${firstName}, gracias por tu interés en` : "Gracias por tu interés en"}
      ${escapeHtml(solution.title)}
    </h1>
    <p style="margin:0 0 22px;font-size:15px;font-weight:600;line-height:1.5;color:${COLOR_BLACK};">
      ${escapeHtml(solution.tagline)}
    </p>
    <p style="margin:0 0 26px;font-size:14.5px;line-height:1.7;color:${COLOR_GRAY_700};">
      ${escapeHtml(solution.intro)}
    </p>

    <p style="margin:0 0 14px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${COLOR_GRAY_700};font-weight:700;">
      Qué incluye
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
      ${capabilitiesHtml}
    </table>

    <p style="margin:8px 0 14px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${COLOR_GRAY_700};font-weight:700;">
      Por qué Spectrum
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${valuesHtml}
    </table>

    ${brochureHtml}

    <p style="margin:26px 0 0;font-size:13px;line-height:1.6;color:${COLOR_GRAY_700};">
      Un asesor de Spectrum se pondrá en contacto contigo pronto para resolver
      cualquier duda adicional.
    </p>
  `;

  return emailShell({
    preheader: `Gracias por tu interés en ${solution.title}. Esto es lo que necesitas saber.`,
    bodyHtml,
  });
}

export function buildSupportRequestEmail({ nombre }) {
  const firstName = escapeHtml(String(nombre || "").split(" ")[0] || "");

  const bodyHtml = `
    <p style="margin:0 0 18px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${COLOR_RED};font-weight:700;">
      Solicitud de soporte
    </p>
    <h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;color:${COLOR_BLACK};">
      ${firstName ? `Hola ${firstName}, recibimos tu solicitud` : "Recibimos tu solicitud"}
    </h1>
    <p style="margin:0 0 22px;font-size:14.5px;line-height:1.7;color:${COLOR_GRAY_700};">
      Un miembro de nuestro equipo revisará tu caso y te contactará a través
      de este correo en el menor tiempo posible.
    </p>
    <p style="margin:0 0 26px;font-size:14.5px;line-height:1.7;color:${COLOR_GRAY_700};">
      Si ya cuentas con un servicio contratado con nosotros y tienes las
      credenciales que te suministramos, también puedes ingresar directamente
      a la mesa de ayuda mientras te respondemos.
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0">
      <tr>
        <td style="border-radius:6px;background:${COLOR_RED};">
          <a href="https://soporte.spectrumt.co" style="display:inline-block;padding:14px 26px;font-size:12.5px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#ffffff;text-decoration:none;">
            Ir a la mesa de ayuda
          </a>
        </td>
      </tr>
    </table>
  `;

  return emailShell({
    preheader:
      "Recibimos tu solicitud de soporte. Un asesor te contactará pronto.",
    bodyHtml,
  });
}

export function buildLeadNotificationEmail({
  nombre,
  correo,
  empresa,
  cargo,
  telefono,
  servicio,
  mensaje,
}) {
  const rows = [
    ["Servicio de interés", servicio],
    ["Nombre", nombre],
    ["Correo", correo],
    ["Empresa", empresa],
    ["Cargo", cargo || "-"],
    ["Teléfono", telefono || "-"],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 0;font-size:12px;letter-spacing:0.04em;text-transform:uppercase;color:${COLOR_GRAY_700};width:190px;">${escapeHtml(
            label,
          )}</td>
          <td style="padding:8px 0;font-size:14px;color:${COLOR_BLACK};font-weight:600;">${escapeHtml(
            value,
          )}</td>
        </tr>`,
    )
    .join("");

  const bodyHtml = `
    <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${COLOR_RED};font-weight:700;">
      Nueva solicitud
    </p>
    <h1 style="margin:0 0 22px;font-size:22px;color:${COLOR_BLACK};">
      Solicitud de información: ${escapeHtml(servicio)}
    </h1>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #eaeaea;">
      ${rowsHtml}
    </table>
    <p style="margin:24px 0 0;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:${COLOR_GRAY_700};font-weight:700;">
      Mensaje
    </p>
    <p style="margin:8px 0 0;font-size:14px;line-height:1.7;color:${COLOR_GRAY_700};white-space:pre-wrap;">${
      escapeHtml(mensaje) || "-"
    }</p>
  `;

  return emailShell({
    preheader: `Nueva solicitud de ${nombre} (${empresa}) sobre ${servicio}`,
    bodyHtml,
  });
}
