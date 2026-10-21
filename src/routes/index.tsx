import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CATEGORIES, formatDate, impactOf, newsQueryOptions, sortedNews, topStory } from "@/data/news";
import { ArticleCard, CategoryBadge, ImpactMeter, SiteFooter, SiteHeader } from "@/components/news-ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Meridian Ledger — Global Markets, Crypto, Economy & Law" },
      { name: "description", content: "Premium financial and legal news for a global audience: markets, crypto, the global economy and regulation." },
      { property: "og:title", content: "The Meridian Ledger — Global Financial & Legal News" },
      { property: "og:description", content: "Markets, crypto, global economy and regulation — reported with authority." },
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

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <nav className="border-b border-border">
        <div className="mx-auto flex max-w-7xl justify-center gap-8 overflow-x-auto px-6 py-3 text-sm font-medium">
          {CATEGORIES.map((c) => (
            <a key={c} href={`#${c}`} className="whitespace-nowrap text-foreground hover:text-emerald">{c}</a>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6">
        {hero ? (
          <section className="grid gap-10 border-b border-border py-10 lg:grid-cols-5">
            <Link to="/article/$id" params={{ id: hero.id }} className="group lg:col-span-3">
              <img src={hero.image_url} alt={hero.title} width={1280} height={768} className="aspect-[16/10] w-full object-cover" />
            </Link>
            <div className="flex flex-col justify-center lg:col-span-2">
              <span className="breaking-label">Breaking</span>
              <div className="mt-4"><CategoryBadge category={hero.category} /></div>
              <Link to="/article/$id" params={{ id: hero.id }}>
                <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-foreground hover:text-emerald md:text-5xl">
                  {hero.title}
                </h1>
              </Link>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{hero.excerpt}</p>
              <div className="mt-6 flex items-center gap-6">
                <time className="text-sm text-muted-foreground">{formatDate(hero.created_at)}</time>
                <ImpactMeter score={impactOf(hero)} />
              </div>
            </div>
          </section>
        ) : null}

        {CATEGORIES.map((c) => {
          const items = all.filter((n) => n.category === c);
          return (
            <section key={c} id={c} className="scroll-mt-6 py-10">
              <h2 className="section-title">{c}</h2>
              {items.length ? (
                <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((n) => <ArticleCard key={n.id} item={n} />)}
                </div>
              ) : (
                <p className="mt-6 text-sm text-muted-foreground">No stories yet.</p>
              )}
            </section>
          );
        })}
      </main>
      <SiteFooter />
    </div>
  );
}
