import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import ArticleView from "@/components/sections/ArticleView";
import CtaStrip from "@/components/sections/CtaStrip";
import Footer from "@/components/layout/Footer";
import { news, getNewsItemBySlug, getNews } from "@/data/news";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

const locale = "en";

export function generateStaticParams() {
  return news.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = getNewsItemBySlug(slug, locale);
  if (!item) return {};
  const title = `${item.title} | Spectrum`;
  const description = item.excerpt;
  const path = `/novedades/${slug}`;
  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    ...buildOpenGraph({ title, description, locale, path }),
  };
}

export default async function NewsItemPageEn({ params }) {
  const { slug } = await params;
  const item = getNewsItemBySlug(slug, locale);
  if (!item) notFound();
  const related = getNews(locale)
    .filter((entry) => entry.slug !== slug)
    .slice(0, 2);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/en" },
    { name: "News", path: "/en/novedades" },
    { name: item.title, path: `/en/novedades/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header locale={locale} />
      <main id="main-content">
        <ArticleView
          item={item}
          kind="news"
          basePath="/novedades"
          related={related}
          locale={locale}
        />

        <CtaStrip locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
