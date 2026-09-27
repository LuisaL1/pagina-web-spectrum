import { describe, it, expect } from "vitest";
import { solutions, solutionsEn, getSolutionBySlug } from "./solutions-data";
import { capabilityIconMap } from "@/components/icons/capability-icon-map";
import knowledgeBase from "./knowledge-base.json";

describe("getSolutionBySlug", () => {
  it("devuelve la solución correspondiente a un slug existente", () => {
    const [first] = solutions;
    expect(getSolutionBySlug(first.slug)).toEqual(first);
  });

  it("devuelve undefined para un slug que no existe", () => {
    expect(getSolutionBySlug("no-existe")).toBeUndefined();
  });

  it("incluye Desarrollo a la medida en español e inglés", () => {
    expect(getSolutionBySlug("desarrollo-a-la-medida")?.title).toBe(
      "Desarrollo a la medida",
    );
    expect(getSolutionBySlug("desarrollo-a-la-medida", "en")?.title).toBe(
      "Custom Development",
    );
  });
});

describe("consistencia de las soluciones", () => {
  it("español e inglés tienen los mismos slugs en el mismo orden", () => {
    expect(solutionsEn.map((s) => s.slug)).toEqual(
      solutions.map((s) => s.slug),
    );
  });

  it("todos los slugs son únicos y cada solución trae los campos requeridos", () => {
    const slugs = solutions.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const item of [...solutions, ...solutionsEn]) {
      expect(item.title).toBeTruthy();
      expect(item.desc).toBeTruthy();
      expect(item.bg).toMatch(/^\/fondos\//);
      expect(item.capabilities.length).toBeGreaterThan(0);
      expect(item.values.length).toBeGreaterThan(0);
    }
  });

  it("los íconos de las capacidades existen en el mapa de íconos", () => {
    for (const item of [...solutions, ...solutionsEn]) {
      for (const cap of item.capabilities) {
        expect(
          capabilityIconMap[cap.icon],
          `${item.slug}: ${cap.icon}`,
        ).toBeDefined();
      }
    }
  });
});

describe("consistencia con la base de conocimiento del asistente", () => {
  it("el asistente conoce cada solución y el mismo número de capacidades", () => {
    for (const item of solutions) {
      const service = knowledgeBase.servicios.find(
        (entry) => entry.pagina === `/soluciones/${item.slug}`,
      );
      expect(service, item.slug).toBeDefined();
      expect(service.capacidades.length, item.slug).toBe(
        item.capabilities.length,
      );
    }
  });

  it("cada solución trae resumen, destacados y texto de cierre en ambos idiomas", () => {
    for (const item of [...solutions, ...solutionsEn]) {
      expect(item.overview, item.slug).toBeTruthy();
      expect(item.highlights.length, item.slug).toBe(4);
      expect(item.closing.title, item.slug).toBeTruthy();
      expect(item.closing.text, item.slug).toBeTruthy();
    }
  });
});
