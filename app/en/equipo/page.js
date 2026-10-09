import Header from "@/components/layout/Header";
import Team from "@/components/sections/Team";
import Culture from "@/components/sections/Culture";
import Footer from "@/components/layout/Footer";
import { buildAlternates, buildOpenGraph, pageTitle } from "@/lib/seo";

const title = pageTitle("Team");
const description = "Meet the leadership and working team that makes Spectrum Technology possible.";

export const metadata = {
  title,
  description,
  alternates: buildAlternates("en", "/equipo"),
  ...buildOpenGraph({ title, description, locale: "en", path: "/equipo" }),
};

export default function EquipoPageEn() {
  return (
    <>
      <Header locale="en" />
      <main id="main-content">
        <Team locale="en" />
        <Culture locale="en" />
      </main>
      <Footer locale="en" />
    </>
  );
}
