import { describe, it, expect } from "vitest";
import { buildAlternates, buildOpenGraph, pageTitle, SITE_NAME } from "./seo";

describe("buildAlternates", () => {
  it("genera el canonical en espanol para locale es", () => {
    const result = buildAlternates("es", "/nosotros");
    expect(result.canonical).toBe("/nosotros");
  });

  it("genera el canonical en ingles para locale en", () => {
    const result = buildAlternates("en", "/nosotros");
    expect(result.canonical).toBe("/en/nosotros");
  });

  it("incluye las 3 etiquetas hreflang (es, en, x-default)", () => {
    const result = buildAlternates("es", "/blog/mi-articulo");
    expect(result.languages).toEqual({
      es: "/blog/mi-articulo",
      en: "/en/blog/mi-articulo",
      "x-default": "/blog/mi-articulo",
    });
  });

  it("maneja correctamente la ruta raiz", () => {
    const result = buildAlternates("en", "/");
    expect(result.canonical).toBe("/en");
    expect(result.languages.es).toBe("/");
  });
});

describe("buildOpenGraph", () => {
  it("usa el titulo/descripcion de la pagina, no uno generico", () => {
    const result = buildOpenGraph({
      title: "Ciberseguridad | Spectrum Technology",
      description: "Proteja lo que mas importa.",
      locale: "es",
      path: "/soluciones/ciberseguridad",
    });

    expect(result.openGraph.title).toBe("Ciberseguridad | Spectrum Technology");
    expect(result.openGraph.description).toBe("Proteja lo que mas importa.");
    expect(result.twitter.title).toBe("Ciberseguridad | Spectrum Technology");
  });

  it("usa el locale correcto para openGraph.locale", () => {
    const es = buildOpenGraph({ title: "t", description: "d", locale: "es", path: "/" });
    const en = buildOpenGraph({ title: "t", description: "d", locale: "en", path: "/" });
    expect(es.openGraph.locale).toBe("es_CO");
    expect(en.openGraph.locale).toBe("en_US");
  });

  it("incluye una imagen valida para openGraph y twitter", () => {
    const result = buildOpenGraph({ title: "t", description: "d", locale: "es", path: "/" });
    expect(result.openGraph.images[0].url).toMatch(/logo-spectrum\.png$/);
    expect(result.twitter.card).toBe("summary_large_image");
  });
});

describe("marca", () => {
  it("pageTitle agrega el nombre completo de la marca", () => {
    expect(SITE_NAME).toBe("Spectrum Technology");
    expect(pageTitle("Blog")).toBe("Blog | Spectrum Technology");
  });

  it("buildOpenGraph declara el nombre del sitio", () => {
    const result = buildOpenGraph({ title: "t", description: "d", locale: "es", path: "/" });
    expect(result.openGraph.siteName).toBe("Spectrum Technology");
  });

  it("los articulos usan type article y su foto de portada (codificada)", () => {
    const result = buildOpenGraph({
      title: "t",
      description: "d",
      locale: "es",
      path: "/blog/x",
      type: "article",
      image: "/fondos/blogs/5señales.jpg",
    });
    expect(result.openGraph.type).toBe("article");
    expect(result.openGraph.images[0].url).toBe("/fondos/blogs/5se%C3%B1ales.jpg");
    expect(result.twitter.images[0]).toBe("/fondos/blogs/5se%C3%B1ales.jpg");
  });
});
