import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { marked } from "marked";
import { formatDate, getNews, impactOf, sortedNews } from "@/data/news";
import { AdSlot, CategoryBadge, ImpactMeter, SiteFooter, SiteHeader } from "@/components/news-ui";

export const Route = createFileRoute("/article/$id")({
  loader: ({ params }) => {
    const article = getNews(params.id);
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
  const html = marked.parse(article.content, { async: false }) as string;
  const others = sortedNews().filter((n) => n.id !== article.id);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto grid max-w-7xl gap-12 px-6 py-10 lg:grid-cols-[1fr_320px]">
        <article className="mx-auto w-full max-w-3xl">
          <CategoryBadge category={article.category} />
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">{article.title}</h1>
          <p className="mt-5 text-xl leading-relaxed text-muted-foreground">{article.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-6 border-y border-border py-3">
            <time className="text-sm text-muted-foreground">{formatDate(article.created_at)}</time>
            <ImpactMeter score={impactOf(article)} />
          </div>
          <img src={article.image_url} alt={article.title} width={1280} height={768} className="mt-8 aspect-[16/9] w-full object-cover" />
          <div className="prose-news mt-10" dangerouslySetInnerHTML={{ __html: html }} />
          <div className="mt-12 flex justify-center"><AdSlot size="728x90" /></div>
        </article>

        <aside className="space-y-10 lg:sticky lg:top-6 lg:self-start">
          <AdSlot size="300x250" />
          <div>
            <h2 className="section-title text-lg">Other Top Financial Stories</h2>
            <ol className="mt-4 divide-y divide-border">
              {others.map((n, i) => (
                <li key={n.id} className="py-4">
                  <Link to="/article/$id" params={{ id: n.id }} className="group flex gap-4">
                    <span className="font-display text-3xl font-bold text-emerald">{i + 1}</span>
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{n.category}</span>
                      <p className="mt-1 font-display font-semibold leading-snug text-foreground group-hover:text-emerald">{n.title}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
          <AdSlot size="300x600" />
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}
