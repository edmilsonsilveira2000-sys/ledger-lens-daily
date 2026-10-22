import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { CATEGORIES, defaultImage, slugify } from "@/data/news";

const storySchema = z.object({
  id: z.string().min(3).max(120).regex(/^[a-z0-9-]+$/).optional(),
  title: z.string().min(5).max(200),
  category: z.enum(CATEGORIES),
  excerpt: z.string().min(10).max(500),
  content: z.string().min(50).max(60_000),
  image_url: z.string().url().max(1000).optional(),
  impact_score: z.number().int().min(0).max(100).optional(),
  created_at: z.string().datetime().optional(),
});
const bodySchema = z.union([storySchema, z.array(storySchema).min(1).max(50)]);

async function authorized(request: Request) {
  const token = process.env["NEWS_INGEST_TOKEN"];
  const given = /^Bearer (\S+)$/.exec(request.headers.get("authorization") ?? "")?.[1];
  if (!token || !given) return false;
  const { createHash, timingSafeEqual } = await import("node:crypto");
  const h = (v: string) => createHash("sha256").update(v).digest();
  return timingSafeEqual(h(token), h(given));
}

export const Route = createFileRoute("/api/public/news")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!(await authorized(request))) return new Response("Unauthorized", { status: 401 });
        let json: unknown;
        try {
          json = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const parsed = bodySchema.safeParse(json);
        if (!parsed.success) return Response.json({ error: parsed.error.issues }, { status: 400 });
        const items = (Array.isArray(parsed.data) ? parsed.data : [parsed.data]).map((s) => ({
          id: s.id ?? `${slugify(s.title)}-${new Date().toISOString().slice(0, 10)}`,
          title: s.title,
          category: s.category,
          excerpt: s.excerpt,
          content: s.content,
          image_url: s.image_url ?? defaultImage(s.category),
          impact_score: s.impact_score ?? null,
          ...(s.created_at ? { created_at: s.created_at } : {}),
        }));
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin.from("news").upsert(items, { onConflict: "id" });
        if (error) return Response.json({ error: "Could not save" }, { status: 500 });
        return Response.json({ published: items.map((i) => i.id) });
      },
    },
  },
});
