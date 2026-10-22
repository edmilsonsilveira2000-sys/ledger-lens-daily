import { createFileRoute } from "@tanstack/react-router";
import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";

export const Route = createFileRoute("/api/public/jobs/write-news")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authFailure = await authenticateCronRequest(request);
        if (authFailure) return authFailure;
        const { runNewsWriter } = await import("@/lib/news-ai.server");
        const { status, body } = await runNewsWriter(request.signal);
        return Response.json(body, { status });
      },
    },
  },
});
