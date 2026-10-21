import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const CATEGORIES = ["Markets", "Crypto", "Global Economy", "Regulations & Law"] as const;
export type Category = (typeof CATEGORIES)[number];

/** Row shape of the `news` table — matches incoming automated integrations. */
export interface News {
  id: string;
  title: string;
  category: Category;
  excerpt: string;
  content: string; // HTML or Markdown
  image_url: string;
  created_at: string; // ISO timestamp
  impact_score?: number | null; // 0-100, optional, derived if absent
}

/**
 * Single source of truth for every story on the site.
 * Reads the `news` table through the browser client, so Row Level Security
 * decides what a visitor may see — no hard-coded articles anywhere.
 */
export function newsQueryOptions() {
  return queryOptions({
    queryKey: ["news"],
    queryFn: async (): Promise<News[]> => {
      const { data, error } = await supabase
        .from("news")
        .select("id,title,category,excerpt,content,image_url,created_at,impact_score")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        category: row.category as Category,
        excerpt: row.excerpt,
        content: row.content,
        image_url: row.image_url,
        created_at: new Date(row.created_at).toISOString(),
        impact_score: row.impact_score,
      }));
    },
    staleTime: 30_000,
  });
}

export const sortedNews = (items: News[]) =>
  [...items].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));

export const findNews = (items: News[], id: string) => items.find((n) => n.id === id);

export const topStory = (items: News[]) =>
  [...items].sort((a, b) => impactOf(b) - impactOf(a))[0];

/** Stories without an explicit score sit in the middle of the scale. */
export const impactOf = (n: News) => n.impact_score ?? 50;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
