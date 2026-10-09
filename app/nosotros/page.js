import Header from "@/components/layout/Header";
import Ecosystem from "@/components/sections/Ecosystem";
import Process from "@/components/sections/Process";
import ClientsLogos from "@/components/sections/ClientsLogos";
import CtaStrip from "@/components/sections/CtaStrip";
import Footer from "@/components/layout/Footer";
import { buildAlternates, buildOpenGraph, pageTitle } from "@/lib/seo";

const title = pageTitle("Nosotros");
const description =
  "Conoce Spectrum Technology: quiénes somos, nuestra historia, misión y visión como ecosistema tecnológico de infraestructura, ciberseguridad y conectividad en Colombia.";

export const metadata = {
  title,
  description,
  alternates: buildAlternates("es", "/nosotros"),
  ...buildOpenGraph({ title, description, locale: "es", path: "/nosotros" }),
};

export default function NosotrosPage() {
  return (
    <>
      <Header locale="es" />
      <main id="main-content">
        <Ecosystem locale="es" />
        <Process locale="es" />
        <ClientsLogos locale="es" />
        <CtaStrip locale="es" />
      </main>
      <Footer locale="es" />
    </>
  );
}
