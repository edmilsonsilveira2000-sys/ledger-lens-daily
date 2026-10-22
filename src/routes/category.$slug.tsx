import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { categoryFromSlug, mostImpactful, newsQueryOptions, sortedNews } from "@/data/news";
import { AdSlot, ArticleCard, CompactStory, SiteFooter, SiteHeader } from "@/components/news-ui";

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ params, context }) => {
    const category = categoryFromSlug(params.slug);
    if (!category) throw notFound();
    await context.queryClient.ensureQueryData(newsQueryOptions());
    return { category };
  },
  head: ({ loaderData }) => {
    const c = loaderData?.category;
    if (!c) return { meta: [{ title: "Section unavailable — The Meridian Ledger" }, { name: "robots", content: "noindex" }] };
    return {
      meta: [
        { title: `${c} News & Analysis — The Meridian Ledger` },
        { name: "description", content: `The latest ${c} news, analysis and high-impact stories from The Meridian Ledger.` },
        { property: "og:title", content: `${c} — The Meridian Ledger` },
        { property: "og:description", content: `Latest ${c} reporting and analysis.` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="p-20 text-center">
      <p className="font-display text-2xl">Section not found.</p>
      <Link to="/" className="mt-4 inline-block text-emerald underline">Back to front page</Link>
    </div>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const { data } = useSuspenseQuery(newsQueryOptions());
  const all = sortedNews(data);
  const items = all.filter((n) => n.category === category);
  const elsewhere = mostImpactful(all.filter((n) => n.category !== category), 5);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader headlines={all.slice(0, 8)} />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <p className="kicker">Section</p>
        <h1 className="mt-2 font-display text-5xl font-bold text-foreground">{category}</h1>
        <p className="mt-2 text-muted-foreground">{items.length} {items.length === 1 ? "story" : "stories"}</p>
        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_300px]">
          {items.length ? (
            <div className="grid content-start gap-10 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((n) => <ArticleCard key={n.id} item={n} />)}
            </div>
          ) : (
            <p className="text-muted-foreground">New {category} stories are on the way.</p>
          )}
          <aside className="space-y-10 lg:sticky lg:top-6 lg:self-start">
            <div>
              <h2 className="section-title text-lg">Across the Ledger</h2>
              <div className="divide-y divide-border">
                {elsewhere.map((n, i) => <CompactStory key={n.id} item={n} rank={i + 1} />)}
              </div>
            </div>
            <AdSlot size="300x250" />
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
