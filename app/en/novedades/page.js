import Header from "@/components/layout/Header";
import Novedades from "@/components/sections/Novedades";
import CtaStrip from "@/components/sections/CtaStrip";
import Footer from "@/components/layout/Footer";
import { buildAlternates, buildOpenGraph, pageTitle } from "@/lib/seo";

const title = pageTitle("News");
const description =
  "News, launches and technical content from Spectrum Technology on infrastructure, cybersecurity and connectivity.";

export const metadata = {
  title,
  description,
  alternates: buildAlternates("en", "/novedades"),
  ...buildOpenGraph({ title, description, locale: "en", path: "/novedades" }),
};

export default function NovedadesPageEn() {
  return (
    <>
      <Header locale="en" />
      <main id="main-content">
        <Novedades locale="en" />
        <CtaStrip locale="en" />
      </main>
      <Footer locale="en" />
    </>
  );
}
