import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import ArticleView from "@/components/sections/ArticleView";
import CtaStrip from "@/components/sections/CtaStrip";
import Footer from "@/components/layout/Footer";
import { articles, getArticleBySlug, getArticles } from "@/data/articles";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

const locale = "en";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug, locale);
  if (!article) return {};
  const title = `${article.title} | Spectrum`;
  const description = article.excerpt;
  const path = `/blog/${slug}`;
  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    ...buildOpenGraph({ title, description, locale, path }),
  };
}

export default async function ArticlePageEn({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug, locale);
  if (!article) notFound();
  const related = getArticles(locale)
    .filter((entry) => entry.slug !== slug)
    .slice(0, 2);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/en" },
    { name: "Blog", path: "/en/blog" },
    { name: article.title, path: `/en/blog/${slug}` },
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
          item={article}
          kind="blog"
          basePath="/blog"
          related={related}
          locale={locale}
        />

        <CtaStrip locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
