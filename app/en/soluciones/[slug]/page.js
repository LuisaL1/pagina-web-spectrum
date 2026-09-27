import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import CtaStrip from "@/components/sections/CtaStrip";
import SolutionView from "@/components/sections/SolutionView";
import Footer from "@/components/layout/Footer";
import { solutions, getSolutionBySlug } from "@/data/solutions-data";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

const locale = "en";

export function generateStaticParams() {
  return solutions.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug, locale);
  if (!solution) return {};
  const title = `${solution.title} | Spectrum`;
  const description = solution.intro;
  const path = `/soluciones/${slug}`;
  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    ...buildOpenGraph({ title, description, locale, path }),
  };
}

export default async function SolutionPageEn({ params }) {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug, locale);
  if (!solution) notFound();

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/en" },
    { name: "Solutions", path: "/en/#soluciones" },
    { name: solution.title, path: `/en/soluciones/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header locale={locale} />
      <main id="main-content">
        <SolutionView solution={solution} locale={locale} />

        <CtaStrip locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
