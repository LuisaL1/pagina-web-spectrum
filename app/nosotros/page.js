import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Ecosystem from "@/components/sections/Ecosystem";
import Process from "@/components/sections/Process";
import Cases from "@/components/sections/Cases";
import CasesWithSector from "@/components/sections/CasesWithSector";
import CtaStrip from "@/components/sections/CtaStrip";
import Footer from "@/components/layout/Footer";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";

const title = "Nosotros | Spectrum";
const description =
  "Quiénes somos, nuestra historia, misión y visión como ecosistema tecnológico.";

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
        <Suspense fallback={<Cases locale="es" />}>
          <CasesWithSector locale="es" />
        </Suspense>
        <CtaStrip locale="es" />
      </main>
      <Footer locale="es" />
    </>
  );
}
