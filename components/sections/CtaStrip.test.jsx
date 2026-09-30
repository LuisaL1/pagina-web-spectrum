import { afterEach, describe, it, expect } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import CtaStrip from "./CtaStrip";

// Sin esto, el DOM de un render queda montado para el siguiente test del
// archivo (no hay limpieza automatica configurada), lo que hace fallar los
// asserts negativos como queryByText(...).not.toBeInTheDocument().
afterEach(cleanup);

describe("CtaStrip", () => {
  it("renderiza el bloque de enfoque y la franja de contacto con su enlace de WhatsApp", () => {
    render(<CtaStrip withApproach />);

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

  it("no renderiza el bloque de enfoque fuera del inicio", () => {
    render(<CtaStrip />);

    expect(
      screen.queryByText("Tecnología con propósito."),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("¿Listo para transformar tu organización?"),
    ).toBeInTheDocument();
  });

  it("renderiza los textos en inglés", () => {
    render(<CtaStrip locale="en" withApproach />);

    expect(screen.getByText("Technology with purpose.")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Let's talk" }),
    ).toBeInTheDocument();
  });
});
