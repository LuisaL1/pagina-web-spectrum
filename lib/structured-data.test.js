import { describe, it, expect } from "vitest";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "./structured-data";

describe("buildOrganizationSchema", () => {
  it("genera un schema.org Organization valido", () => {
    const schema = buildOrganizationSchema();
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Organization");
    expect(schema.name).toBe("Spectrum Technology");
    expect(schema.url).toMatch(/^https?:\/\//);
    expect(schema.logo).toMatch(/^https?:\/\//);
  });
});

describe("buildBreadcrumbSchema", () => {
  it("genera un BreadcrumbList con posiciones consecutivas desde 1", () => {
    const schema = buildBreadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Soluciones", path: "/#soluciones" },
      { name: "Ciberseguridad", path: "/soluciones/ciberseguridad" },
    ]);

    expect(schema["@type"]).toBe("BreadcrumbList");
    expect(schema.itemListElement).toHaveLength(3);
    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[2].position).toBe(3);
    expect(schema.itemListElement[2].name).toBe("Ciberseguridad");
    expect(schema.itemListElement[2].item).toMatch(/\/soluciones\/ciberseguridad$/);
  });
});

describe("buildWebSiteSchema", () => {
  it("declara Spectrum Technology como nombre del sitio", () => {
    const schema = buildWebSiteSchema();
    expect(schema["@type"]).toBe("WebSite");
    expect(schema.name).toBe("Spectrum Technology");
    expect(schema.alternateName).toContain("Spectrum");
    expect(schema.publisher["@id"]).toBe(buildOrganizationSchema()["@id"]);
  });
});

describe("buildArticleSchema", () => {
  it("genera un articulo con URL absoluta y publicado por la organizacion", () => {
    const schema = buildArticleSchema({
      type: "NewsArticle",
      title: "Titulo",
      description: "Resumen",
      path: "/en/novedades/aniversario",
      locale: "en",
      image: "/fondos/blogs/5señales.jpg",
    });
    expect(schema["@type"]).toBe("NewsArticle");
    expect(schema.headline).toBe("Titulo");
    expect(schema.url).toMatch(/^https?:\/\/.+\/en\/novedades\/aniversario$/);
    expect(schema.image).toMatch(/5se%C3%B1ales\.jpg$/);
    expect(schema.publisher["@id"]).toBe(buildOrganizationSchema()["@id"]);
  });
});
