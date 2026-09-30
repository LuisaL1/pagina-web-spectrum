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
  "Spectrum is a technology ecosystem of infrastructure, cybersecurity and connectivity for public and private organizations.";

export const metadata = {
  title,
  description,
  alternates: buildAlternates("en", "/"),
  ...buildOpenGraph({ title, description, locale: "en", path: "/" }),
};

export default function HomeEn() {
  return (
    <>
      <Header locale="en" />
      <main id="main-content">
        <Hero locale="en" />
        <UnitNav locale="en" />
        <AISpotlight locale="en" />
        <QualityStrip locale="en" />
        <Solutions locale="en" />
        <Partners locale="en" />
        <Blog locale="en" />
        <CtaStrip locale="en" />
      </main>
      <Footer locale="en" />
    </>
  );
}
