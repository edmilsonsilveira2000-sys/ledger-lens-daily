<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Articles come from the `public.news` table, read only through `newsQueryOptions()` in src/data/news.ts; components must never hold or hard-code article content, so an automated feed can publish by inserting rows alone.
- Automated publishing writes to `public.news` only from server routes under src/routes/api/public/ (bearer-token ingest at /api/public/news, cron-authenticated AI writer at /api/public/jobs/write-news); the AI writer is single-flight and pausable via `public.news_job_state` so failures never loop or overspend.
