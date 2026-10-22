import { Link } from "@tanstack/react-router";
import { CATEGORIES, categorySlug, formatDate, impactOf, readingMinutes, type News } from "@/data/news";

const MARKETS = [
  ["S&P 500", "▲ 1.4%", true], ["Nasdaq", "▲ 1.9%", true], ["Dow", "▲ 0.9%", true], ["FTSE 100", "▲ 0.4%", true],
  ["Nikkei", "▼ 0.3%", false], ["BTC", "▲ 3.2%", true], ["ETH", "▲ 4.6%", true], ["Gold", "▲ 0.7%", true],
  ["Brent", "▼ 1.1%", false], ["EUR/USD", "▲ 0.2%", true], ["10Y UST", "▼ 3.92%", false],
] as const;

export function SiteHeader({ headlines = [] }: { headlines?: News[] }) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  return (
    <header className="border-b border-border bg-background">
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-1.5 text-xs">
          <span className="shrink-0 tracking-wide opacity-80">{today}</span>
          <div className="relative flex-1 overflow-hidden">
            <div className="ticker-track gap-6 font-mono">
              {[...MARKETS, ...MARKETS].map(([name, val, up], i) => (
                <span key={i} className="whitespace-nowrap">
                  {name} <b className={up ? "text-up" : "text-down"}>{val}</b>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-6 text-center">
        <Link to="/" className="font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          The Meridian Ledger
        </Link>
        <p className="mt-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">Markets · Business · Money · Law</p>
      </div>
      <nav className="border-t border-border">
        <div className="mx-auto flex max-w-7xl justify-start gap-7 overflow-x-auto px-6 py-3 text-sm font-medium md:justify-center">
          <Link to="/" activeOptions={{ exact: true }} className="whitespace-nowrap text-foreground hover:text-emerald" activeProps={{ className: "text-emerald" }}>Front Page</Link>
          {CATEGORIES.map((c) => (
            <Link key={c} to="/category/$slug" params={{ slug: categorySlug(c) }} className="whitespace-nowrap text-foreground hover:text-emerald" activeProps={{ className: "text-emerald" }}>
              {c}
            </Link>
          ))}
        </div>
      </nav>
      {headlines.length > 0 && (
        <div className="border-t border-border bg-muted">
          <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-hidden px-6 py-2 text-sm">
            <span className="breaking-label shrink-0 self-center">Latest</span>
            <div className="relative flex-1 overflow-hidden">
              <div className="ticker-track gap-10">
                {[...headlines, ...headlines].map((n, i) => (
                  <Link key={i} to="/article/$id" params={{ id: n.id }} className="whitespace-nowrap text-foreground hover:text-emerald">
                    <span className="kicker mr-2">{n.category}</span>{n.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function CategoryBadge({ category }: { category: News["category"] }) {
  return (
    <Link to="/category/$slug" params={{ slug: categorySlug(category) }} className="badge-category hover:opacity-80">
      {category}
    </Link>
  );
}

export function ImpactMeter({ score }: { score: number }) {
  const label = score >= 85 ? "High impact" : score >= 65 ? "Trending" : "Notable";
  return (
    <div className="flex items-center gap-2" title={`Impact score ${score}/100`}>
      <div className="flex items-end gap-0.5">
        {[20, 40, 60, 80, 100].map((t, i) => (
          <span key={t} className={score >= t - 10 ? "bg-emerald" : "bg-border"} style={{ width: 3, height: 5 + i * 3 }} />
        ))}
      </div>
      <span className="font-mono text-[11px] font-semibold text-emerald">{score}</span>
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  );
}

export function ArticleCard({ item }: { item: News }) {
  return (
    <article className="group flex flex-col">
      <Link to="/article/$id" params={{ id: item.id }} className="block overflow-hidden">
        <img src={item.image_url} alt={item.title} loading="lazy" width={1280} height={768}
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </Link>
      <div className="mt-4 flex items-center justify-between">
        <CategoryBadge category={item.category} />
        <time className="text-xs text-muted-foreground">{formatDate(item.created_at)}</time>
      </div>
      <Link to="/article/$id" params={{ id: item.id }}>
        <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-foreground hover:text-emerald">{item.title}</h3>
      </Link>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <ImpactMeter score={impactOf(item)} />
        <span className="text-[11px] text-muted-foreground">{readingMinutes(item.content)} min read</span>
      </div>
    </article>
  );
}

export function CompactStory({ item, rank }: { item: News; rank?: number }) {
  return (
    <Link to="/article/$id" params={{ id: item.id }} className="group flex gap-4 py-4">
      {rank !== undefined && <span className="font-display text-3xl font-bold leading-none text-emerald">{rank}</span>}
      <div className="min-w-0">
        <span className="kicker">{item.category}</span>
        <p className="mt-1 font-display font-semibold leading-snug text-foreground group-hover:text-emerald">{item.title}</p>
        <time className="mt-1 block text-xs text-muted-foreground">{formatDate(item.created_at)}</time>
      </div>
    </Link>
  );
}

/** Ad slot — paste Adsterra / Monetag script markup into `html` or render children. */
export function AdSlot({ size = "300x250", html }: { size?: string; html?: string }) {
  const [w, h] = size.split("x").map(Number);
  return (
    <div className="ad-slot" data-ad-slot={size} style={{ maxWidth: w, minHeight: h }}>
      {html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : <span>Advertisement · {size}</span>}
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-3xl font-bold">The Meridian Ledger</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed opacity-75">
            Independent reporting on global markets, business, digital assets, the world economy and the law that governs them — updated around the clock.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Sections</p>
          <ul className="mt-4 space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c}><Link to="/category/$slug" params={{ slug: categorySlug(c) }} className="opacity-85 hover:opacity-100 hover:underline">{c}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">The Ledger</p>
          <ul className="mt-4 space-y-2 text-sm opacity-85">
            <li><Link to="/" className="hover:underline">Front Page</Link></li>
            <li>Editorial standards</li>
            <li>Advertise with us</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto max-w-7xl px-6 py-5 text-xs opacity-60">
          © {new Date().getFullYear()} The Meridian Ledger. Market data shown is indicative and delayed.
        </div>
      </div>
    </footer>
  );
}
