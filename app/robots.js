import { getSiteUrl } from "@/lib/site-url";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Endpoints del formulario y del chat: no son paginas, no hay nada
      // que indexar ahi.
      disallow: "/api/",
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
