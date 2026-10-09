import Header from "@/components/layout/Header";
import Novedades from "@/components/sections/Novedades";
import CtaStrip from "@/components/sections/CtaStrip";
import Footer from "@/components/layout/Footer";
import { buildAlternates, buildOpenGraph, pageTitle } from "@/lib/seo";

const title = pageTitle("Novedades");
const description =
  "Noticias, lanzamientos y contenido técnico de Spectrum Technology sobre infraestructura, ciberseguridad y conectividad.";

export const metadata = {
  title,
  description,
  alternates: buildAlternates("es", "/novedades"),
  ...buildOpenGraph({ title, description, locale: "es", path: "/novedades" }),
};

export default function NovedadesPage() {
  return (
    <>
      <Header locale="es" />
      <main id="main-content">
        <Novedades locale="es" />
        <CtaStrip locale="es" />
      </main>
      <Footer locale="es" />
    </>
  );
}
