import Header from "@/components/layout/Header";
import BlogArchive from "@/components/sections/BlogArchive";
import CtaStrip from "@/components/sections/CtaStrip";
import Footer from "@/components/layout/Footer";
import { buildAlternates, buildOpenGraph, pageTitle } from "@/lib/seo";

const title = pageTitle("Blog");
const description =
  "Technical articles from Spectrum Technology on infrastructure, cybersecurity, connectivity and artificial intelligence.";

export const metadata = {
  title,
  description,
  alternates: buildAlternates("en", "/blog"),
  ...buildOpenGraph({ title, description, locale: "en", path: "/blog" }),
};

export default function BlogPageEn() {
  return (
    <>
      <Header locale="en" />
      <main id="main-content">
        <BlogArchive locale="en" />
        <CtaStrip locale="en" />
      </main>
      <Footer locale="en" />
    </>
  );
}
