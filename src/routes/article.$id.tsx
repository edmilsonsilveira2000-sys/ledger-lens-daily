import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { marked } from "marked";
import { findNews, formatDate, impactOf, newsQueryOptions, readingMinutes, sortedNews } from "@/data/news";
import { AdSlot, ArticleCard, CategoryBadge, CompactStory, ImpactMeter, SiteFooter, SiteHeader } from "@/components/news-ui";

export const Route = createFileRoute("/article/$id")({
  loader: async ({ params, context }) => {
    const items = await context.queryClient.ensureQueryData(newsQueryOptions());
    const article = findNews(items, params.id);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    const a = loaderData?.article;
    if (!a) return { meta: [{ title: "Article not found — The Meridian Ledger" }, { name: "robots", content: "noindex" }] };
    return {
      meta: [
        { title: `${a.title} — The Meridian Ledger` },
        { name: "description", content: a.excerpt },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.excerpt },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="p-20 text-center">
      <p className="font-display text-2xl">Story not found.</p>
      <Link to="/" className="mt-4 inline-block text-emerald underline">Back to front page</Link>
    </div>
  ),
  component: ArticlePage,
});

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const { data } = useSuspenseQuery(newsQueryOptions());
  const html = marked.parse(article.content, { async: false }) as string;
  const all = sortedNews(data);
  const others = all.filter((n) => n.id !== article.id);
  const related = others.filter((n) => n.category === article.category).slice(0, 3);
  const more = (related.length ? related : others).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader headlines={all.slice(0, 8)} />
      <main className="mx-auto grid max-w-7xl gap-12 px-6 py-10 lg:grid-cols-[1fr_320px]">
        <article key={article.id} className="mx-auto w-full max-w-3xl">
          <nav className="mb-5 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-emerald">Front Page</Link> <span className="mx-1">/</span> {article.category}
          </nav>
          <CategoryBadge category={article.category} />
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">{article.title}</h1>
          <p className="mt-5 text-xl leading-relaxed text-muted-foreground">{article.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-6 border-y border-border py-3">
            <span className="text-sm font-medium text-foreground">By The Meridian Ledger Newsroom</span>
            <time className="text-sm text-muted-foreground">{formatDate(article.created_at)}</time>
            <span className="text-sm text-muted-foreground">{readingMinutes(article.content)} min read</span>
            <ImpactMeter score={impactOf(article)} />
          </div>
          <img src={article.image_url} alt={article.title} width={1280} height={768} className="mt-8 aspect-[16/9] w-full object-cover" />
          <div className="prose-news mt-10" dangerouslySetInnerHTML={{ __html: html }} />
          <div className="mt-12 flex justify-center"><AdSlot size="728x90" /></div>
          {more.length > 0 && (
            <section className="mt-14">
              <h2 className="section-title">Keep Reading</h2>
              <div className="mt-6 grid gap-8 sm:grid-cols-3">
                {more.map((n) => <ArticleCard key={n.id} item={n} />)}
              </div>
            </section>
          )}
        </article>

        <aside className="space-y-10 lg:sticky lg:top-6 lg:self-start">
          <AdSlot size="300x250" />
          <div>
            <h2 className="section-title text-lg">Other Top Financial Stories</h2>
            <div className="divide-y divide-border">
              {others.slice(0, 6).map((n, i) => <CompactStory key={n.id} item={n} rank={i + 1} />)}
            </div>
          </div>
          <AdSlot size="300x600" />
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}
