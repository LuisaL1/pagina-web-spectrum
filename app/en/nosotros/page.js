import Header from "@/components/layout/Header";
import Ecosystem from "@/components/sections/Ecosystem";
import Process from "@/components/sections/Process";
import ClientsLogos from "@/components/sections/ClientsLogos";
import CtaStrip from "@/components/sections/CtaStrip";
import Footer from "@/components/layout/Footer";
import { buildAlternates, buildOpenGraph, pageTitle } from "@/lib/seo";

const title = pageTitle("About us");
const description =
  "Meet Spectrum Technology: who we are, our story, mission and vision as an infrastructure, cybersecurity and connectivity technology ecosystem in Colombia.";

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
        <Process locale="en" />
        <ClientsLogos locale="en" />
        <CtaStrip locale="en" />
      </main>
      <Footer locale="en" />
    </>
  );
}
