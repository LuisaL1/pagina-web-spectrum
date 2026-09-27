import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CtaStrip from "./CtaStrip";

describe("CtaStrip", () => {
  it("renderiza el bloque de enfoque y la franja de contacto con su enlace de WhatsApp", () => {
    render(<CtaStrip />);

    expect(screen.getByText("Tecnología con propósito.")).toBeInTheDocument();
    expect(
      screen.getByText("Operación segura, eficiente y disponible 24/7."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("¿Listo para transformar tu organización?"),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Hablemos" })).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me/"),
    );
  });

  it("renderiza los textos en inglés", () => {
    render(<CtaStrip locale="en" />);

    expect(screen.getByText("Technology with purpose.")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Let's talk" }),
    ).toBeInTheDocument();
  });
});
