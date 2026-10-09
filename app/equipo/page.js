import Header from "@/components/layout/Header";
import Team from "@/components/sections/Team";
import Culture from "@/components/sections/Culture";
import Footer from "@/components/layout/Footer";
import { buildAlternates, buildOpenGraph, pageTitle } from "@/lib/seo";

const title = pageTitle("Equipo");
const description = "Conoce al equipo directivo y de trabajo que hace posible a Spectrum Technology.";

export const metadata = {
  title,
  description,
  alternates: buildAlternates("es", "/equipo"),
  ...buildOpenGraph({ title, description, locale: "es", path: "/equipo" }),
};

export default function EquipoPage() {
  return (
    <>
      <Header locale="es" />
      <main id="main-content">
        <Team locale="es" />
        <Culture locale="es" />
      </main>
      <Footer locale="es" />
    </>
  );
}
