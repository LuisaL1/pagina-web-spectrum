import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import AISpotlight from "@/components/sections/AISpotlight";
import UnitNav from "@/components/sections/UnitNav";
import QualityStrip from "@/components/sections/QualityStrip";
import Solutions from "@/components/sections/Solutions";
import Partners from "@/components/sections/Partners";
import Blog from "@/components/sections/Blog";
import CtaStrip from "@/components/sections/CtaStrip";
import Footer from "@/components/layout/Footer";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";

const title = "Spectrum | Future Powered";
const description =
  "Spectrum es un ecosistema tecnológico de infraestructura, ciberseguridad y conectividad para organizaciones públicas y privadas.";

export const metadata = {
  title,
  description,
  alternates: buildAlternates("es", "/"),
  ...buildOpenGraph({ title, description, locale: "es", path: "/" }),
};

export default function Home() {
  return (
    <>
      <Header locale="es" />
      <main id="main-content">
        <Hero locale="es" />
        <UnitNav locale="es" />
        <AISpotlight locale="es" />
        <QualityStrip locale="es" />
        <Solutions locale="es" />
        <Partners locale="es" />
        <Blog locale="es" />
        <CtaStrip locale="es" withApproach />
      </main>
      <Footer locale="es" />
    </>
  );
}
