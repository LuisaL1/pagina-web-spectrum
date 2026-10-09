import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import ArticleView from "@/components/sections/ArticleView";
import CtaStrip from "@/components/sections/CtaStrip";
import Footer from "@/components/layout/Footer";
import { news, getNewsItemBySlug, getNews } from "@/data/news";
import { buildAlternates, buildOpenGraph, pageTitle } from "@/lib/seo";
import { localizedHref } from "@/lib/i18n";
import { buildArticleSchema, buildBreadcrumbSchema } from "@/lib/structured-data";

const locale = "es";

export function generateStaticParams() {
  return news.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = getNewsItemBySlug(slug, locale);
  if (!item) return {};
  const title = pageTitle(item.title);
  const description = item.excerpt;
  const path = `/novedades/${slug}`;
  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    ...buildOpenGraph({
      title,
      description,
      locale,
      path,
      type: "article",
      image: item.bg,
    }),
  };
}

export default async function NewsItemPage({ params }) {
  const { slug } = await params;
  const item = getNewsItemBySlug(slug, locale);
  if (!item) notFound();
  const related = getNews(locale)
    .filter((entry) => entry.slug !== slug)
    .slice(0, 2);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Inicio", path: "/" },
    { name: "Novedades", path: "/novedades" },
    { name: item.title, path: `/novedades/${slug}` },
  ]);
  const articleSchema = buildArticleSchema({
    type: "NewsArticle",
    title: item.title,
    description: item.excerpt,
    path: localizedHref(locale, `/novedades/${slug}`),
    locale,
    image: item.bg,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
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
