import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CATEGORIES, categorySlug, formatDate, impactOf, mostImpactful, newsQueryOptions, readingMinutes, sortedNews, topStory } from "@/data/news";
import { AdSlot, ArticleCard, CategoryBadge, CompactStory, ImpactMeter, SiteFooter, SiteHeader } from "@/components/news-ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Meridian Ledger — Global Markets, Business, Crypto, Economy & Law" },
      { name: "description", content: "Premium financial and legal news for a global audience: markets, business, crypto, the global economy and regulation." },
      { property: "og:title", content: "The Meridian Ledger — Global Financial & Legal News" },
      { property: "og:description", content: "Markets, business, crypto, global economy and regulation — reported with authority." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(newsQueryOptions()),
  component: Home,
});

function Home() {
  const { data } = useSuspenseQuery(newsQueryOptions());
  const all = sortedNews(data);
  const hero = topStory(all);
  const latest = all.filter((n) => n.id !== hero?.id).slice(0, 5);
  const mostRead = mostImpactful(all, 5);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader headlines={all.slice(0, 8)} />

      <main className="mx-auto max-w-7xl px-6">
        {hero ? (
          <section className="grid gap-10 border-b border-border py-10 lg:grid-cols-[1fr_300px]">
            <div className="grid gap-8 md:grid-cols-5">
              <Link to="/article/$id" params={{ id: hero.id }} className="group overflow-hidden md:col-span-3">
                <img src={hero.image_url} alt={hero.title} width={1280} height={768}
                  className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </Link>
              <div className="flex flex-col justify-center md:col-span-2">
                <span className="breaking-label">Breaking</span>
                <div className="mt-4"><CategoryBadge category={hero.category} /></div>
                <Link to="/article/$id" params={{ id: hero.id }}>
                  <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-foreground hover:text-emerald md:text-4xl">{hero.title}</h1>
                </Link>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">{hero.excerpt}</p>
                <div className="mt-5 flex flex-wrap items-center gap-5">
                  <time className="text-sm text-muted-foreground">{formatDate(hero.created_at)}</time>
                  <span className="text-sm text-muted-foreground">{readingMinutes(hero.content)} min read</span>
                  <ImpactMeter score={impactOf(hero)} />
                </div>
              </div>
            </div>
            <aside className="lg:border-l lg:border-border lg:pl-8">
              <h2 className="section-title text-lg">Latest</h2>
              <div className="divide-y divide-border">
                {latest.map((n) => <CompactStory key={n.id} item={n} />)}
              </div>
            </aside>
          </section>
        ) : (
          <p className="py-20 text-center text-muted-foreground">The newsroom is preparing today's edition.</p>
        )}

        <div className="flex justify-center py-8"><AdSlot size="728x90" /></div>

        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          <div>
            {CATEGORIES.map((c) => {
              const items = all.filter((n) => n.category === c).slice(0, 6);
              return (
                <section key={c} className="py-8">
                  <div className="flex items-baseline justify-between">
                    <h2 className="section-title flex-1">{c}</h2>
                    <Link to="/category/$slug" params={{ slug: categorySlug(c) }} className="ml-4 text-sm font-medium text-emerald hover:underline">
                      More {c} →
                    </Link>
                  </div>
                  {items.length ? (
                    <div className="mt-6 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                      {items.map((n) => <ArticleCard key={n.id} item={n} />)}
                    </div>
                  ) : (
                    <p className="mt-6 text-sm text-muted-foreground">New stories for this section are on the way.</p>
                  )}
                </section>
              );
            })}
          </div>
          <aside className="space-y-10 py-8 lg:sticky lg:top-6 lg:self-start">
            <div>
              <h2 className="section-title text-lg">Most Read</h2>
              <div className="divide-y divide-border">
                {mostRead.map((n, i) => <CompactStory key={n.id} item={n} rank={i + 1} />)}
              </div>
            </div>
            <AdSlot size="300x250" />
            <AdSlot size="300x600" />
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
