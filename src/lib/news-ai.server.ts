import { createOpenAI } from "@ai-sdk/openai";
import { NoObjectGeneratedError, Output, streamText } from "ai";
import { z } from "zod";
import { CATEGORIES, defaultImage, slugify, type Category } from "@/data/news";

const GATEWAY = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";
const JOB_ID = "ai-writer";

const storySchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  content: z.string(),
  impact_score: z.number(),
});

export type JobResult = { status: number; body: Record<string, unknown> };

/** Writes and publishes ONE new story per run. Locked, pausable, idempotent by slug. */
export async function runNewsWriter(signal?: AbortSignal): Promise<JobResult> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const now = new Date();

  const { data: state } = await supabaseAdmin.from("news_job_state").select("*").eq("id", JOB_ID).maybeSingle();
  if (state?.paused_reason) return { status: 200, body: { skipped: "paused", reason: state.paused_reason } };

  // Single-flight lease
  const { data: lease } = await supabaseAdmin
    .from("news_job_state")
    .update({ locked_until: new Date(now.getTime() + 5 * 60_000).toISOString() })
    .eq("id", JOB_ID)
    .or(`locked_until.is.null,locked_until.lt.${now.toISOString()}`)
    .select("id");
  if (!lease?.length) return { status: 200, body: { skipped: "already running" } };

  const release = (patch: Record<string, unknown>) =>
    supabaseAdmin.from("news_job_state").update({ locked_until: null, last_run_at: new Date().toISOString(), ...patch }).eq("id", JOB_ID);

  try {
    // Rotate sections: pick the one with the oldest latest story
    const { data: recent } = await supabaseAdmin.from("news").select("title,category,created_at").order("created_at", { ascending: false }).limit(40);
    const lastByCat = new Map<string, number>();
    for (const r of recent ?? []) if (!lastByCat.has(r.category)) lastByCat.set(r.category, +new Date(r.created_at));
    const category: Category = [...CATEGORIES].sort((a, b) => (lastByCat.get(a) ?? 0) - (lastByCat.get(b) ?? 0))[0]!;
    const avoid = (recent ?? []).slice(0, 15).map((r) => `- ${r.title}`).join("\n");

    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { status: 500, body: { error: "AI key missing" } };
    const provider = createOpenAI({
      baseURL: GATEWAY,
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });

    const result = streamText({
      model: provider.responses(MODEL),
      instructions:
        "You are a senior editor at The Meridian Ledger, a premium financial and legal newspaper in the style of the Financial Times. Write in polished American English. Never invent quotes attributed to named real people; attribute to roles (e.g. 'a senior strategist'). Present analysis as plausible reporting on current themes.",
      messages: [
        {
          role: "user",
          content: `Today is ${now.toDateString()}. Write one new article for the "${category}" section.
Requirements: headline under 90 characters; excerpt of 1-2 sentences (max 220 characters); body in Markdown, 450-650 words, with 2 '##' subheadings, at least one **bold** phrase, one '>' blockquote, and one bullet list. Do not repeat the headline in the body. impact_score is an integer 40-95 reflecting market significance.
Avoid topics already covered:
${avoid}`,
        },
      ],
      output: Output.object({ schema: storySchema }),
      ...(signal ? { abortSignal: signal } : {}),
      providerOptions: {
        openai: { forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", store: false, include: ["reasoning.encrypted_content"] },
      },
    });

    let story: z.infer<typeof storySchema>;
    try {
      story = await result.output;
    } catch (e) {
      if (NoObjectGeneratedError.isInstance(e)) {
        await release({ last_error: "AI returned an unusable article" });
        return { status: 502, body: { error: "unusable article" } };
      }
      throw e;
    }

    const id = `${slugify(story.title)}-${now.toISOString().slice(0, 10)}`;
    const { error } = await supabaseAdmin.from("news").upsert(
      {
        id,
        title: story.title.slice(0, 160),
        category,
        excerpt: story.excerpt.slice(0, 300),
        content: story.content,
        image_url: defaultImage(category),
        impact_score: Math.min(100, Math.max(0, Math.round(story.impact_score))),
      },
      { onConflict: "id", ignoreDuplicates: true },
    );
    if (error) throw error;
    await release({ last_error: null });
    return { status: 200, body: { published: id, category } };
  } catch (e) {
    const status = (e as { statusCode?: number; status?: number }).statusCode ?? (e as { status?: number }).status;
    const msg = e instanceof Error ? e.message : String(e);
    // Circuit breaker: credits / policy blocks pause the job until the owner clears it.
    if (status === 402 || status === 403) {
      await release({ paused_reason: `AI blocked (${status}): ${msg}`.slice(0, 500), last_error: msg.slice(0, 500) });
    } else {
      await release({ last_error: msg.slice(0, 500) });
    }
    return { status: status === 402 || status === 403 ? status : 500, body: { error: msg } };
  }
}
