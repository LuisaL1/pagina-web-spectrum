import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Ecosystem from "@/components/sections/Ecosystem";
import Cases from "@/components/sections/Cases";
import CasesWithSector from "@/components/sections/CasesWithSector";
import CtaStrip from "@/components/sections/CtaStrip";
import Footer from "@/components/layout/Footer";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";

const title = "About us | Spectrum";
const description =
  "Who we are, our story, mission and vision as a technology ecosystem.";

export const metadata = {
  title,
  description,
  alternates: buildAlternates("en", "/nosotros"),
  ...buildOpenGraph({ title, description, locale: "en", path: "/nosotros" }),
};

export default function NosotrosPageEn() {
  return (
    <>
      <Header locale="en" />
      <main id="main-content">
        <Ecosystem locale="en" />
        <Suspense fallback={<Cases locale="en" />}>
          <CasesWithSector locale="en" />
        </Suspense>
        <CtaStrip locale="en" />
      </main>
      <Footer locale="en" />
    </>
  );
}
