import { describe, expect, it } from "vitest";

import { findNews, formatDate, impactOf, sortedNews, topStory, type News } from "@/data/news";

const story = (over: Partial<News>): News => ({
  id: "x",
  title: "T",
  category: "Markets",
  excerpt: "E",
  content: "C",
  image_url: "/news/markets.jpg",
  created_at: "2026-10-20T09:00:00Z",
  ...over,
});

describe("news rules", () => {
  it("scores a story without an impact_score at the middle of the scale", () => {
    expect(impactOf(story({}))).toBe(50);
    expect(impactOf(story({ impact_score: 94 }))).toBe(94);
    expect(impactOf(story({ impact_score: 0 }))).toBe(0);
  });

  it("makes the highest-impact story the front-page lead", () => {
    const items = [story({ id: "a", impact_score: 66 }), story({ id: "b", impact_score: 94 })];
    expect(topStory(items)?.id).toBe("b");
  });

  it("lists newest stories first", () => {
    const items = [
      story({ id: "old", created_at: "2026-10-19T18:30:00Z" }),
      story({ id: "new", created_at: "2026-10-21T16:45:00Z" }),
    ];
    expect(sortedNews(items).map((n) => n.id)).toEqual(["new", "old"]);
  });

  it("finds a story by its id and none for an unknown id", () => {
    const items = [story({ id: "sec-ai-disclosure-rules" })];
    expect(findNews(items, "sec-ai-disclosure-rules")?.id).toBe("sec-ai-disclosure-rules");
    expect(findNews(items, "nope")).toBeUndefined();
  });

  it("prints dates in US style, fixed to UTC", () => {
    expect(formatDate("2026-10-21T16:45:00Z")).toBe("Oct 21, 2026");
  });
});
