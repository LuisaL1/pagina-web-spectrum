import { describe, it, expect } from "vitest";
import { buildServiceRequestEmail } from "./email-templates";
import { getSolutionBySlug } from "@/data/solutions-data";

describe("buildServiceRequestEmail", () => {
  it("incluye el botón de PDF cuando la solución tiene brochure", () => {
    const solution = getSolutionBySlug("ciberseguridad");
    const html = buildServiceRequestEmail({ solution, nombre: "Ana" });
    expect(html).toContain("/recursos/servicios/ciberseguridad.pdf");
  });

  it("omite el botón de PDF cuando la solución no tiene brochure", () => {
    const solution = getSolutionBySlug("desarrollo-a-la-medida");
    const html = buildServiceRequestEmail({ solution, nombre: "Ana" });
    expect(html).not.toContain(".pdf");
    expect(html).toContain("Desarrollo a la medida");
  });
});
