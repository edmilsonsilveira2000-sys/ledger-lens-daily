import { Link } from "@tanstack/react-router";
import { formatDate, impactOf, type News } from "@/data/news";

export function SiteHeader() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
  return (
    <header className="border-b border-border bg-background">
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-xs tracking-wide">
          <span>{today}</span>
          <span className="hidden gap-5 font-mono sm:flex">
            <span>S&P 500 <b className="text-up">▲ 1.4%</b></span>
            <span>BTC <b className="text-up">▲ 3.2%</b></span>
            <span>10Y <b className="text-down">▼ 3.92%</b></span>
          </span>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-6 text-center">
        <Link to="/" className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          The Meridian Ledger
        </Link>
        <p className="mt-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Markets · Money · Law
        </p>
      </div>
    </header>
  );
}

export function CategoryBadge({ category }: { category: News["category"] }) {
  return <span className="badge-category">{category}</span>;
}

export function ImpactMeter({ score }: { score: number }) {
  const label = score >= 85 ? "High impact" : score >= 65 ? "Trending" : "Notable";
  return (
    <div className="flex items-center gap-2" title={`Impact score ${score}/100`}>
      <div className="flex items-end gap-0.5">
        {[20, 40, 60, 80, 100].map((t, i) => (
          <span
            key={t}
            className={score >= t - 10 ? "bg-emerald" : "bg-border"}
            style={{ width: 3, height: 5 + i * 3 }}
          />
        ))}
      </div>
      <span className="font-mono text-[11px] font-semibold text-emerald">{score}</span>
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  );
}

export function ArticleCard({ item }: { item: News }) {
  return (
    <Link to="/article/$id" params={{ id: item.id }} className="group flex flex-col">
      <div className="overflow-hidden">
        <img
          src={item.image_url}
          alt={item.title}
          loading="lazy"
          width={1280}
          height={768}
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <CategoryBadge category={item.category} />
        <time className="text-xs text-muted-foreground">{formatDate(item.created_at)}</time>
      </div>
      <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-foreground group-hover:text-emerald">
        {item.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p>
      <div className="mt-4 border-t border-border pt-3">
        <ImpactMeter score={impactOf(item)} />
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
    <footer className="mt-20 border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-10 text-sm opacity-80">
        © {new Date().getFullYear()} The Meridian Ledger. Independent financial & legal journalism.
      </div>
    </footer>
  );
}
