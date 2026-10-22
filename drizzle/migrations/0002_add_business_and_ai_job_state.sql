ALTER TABLE public.news DROP CONSTRAINT IF EXISTS news_category_check;
ALTER TABLE public.news ADD CONSTRAINT news_category_check CHECK (category IN ('Markets','Crypto','Global Economy','Regulations & Law','Business'));

CREATE TABLE public.news_job_state (
  id text PRIMARY KEY,
  locked_until timestamptz,
  paused_reason text,
  last_run_at timestamptz,
  last_error text
);
GRANT ALL ON public.news_job_state TO service_role;
ALTER TABLE public.news_job_state ENABLE ROW LEVEL SECURITY;
INSERT INTO public.news_job_state (id) VALUES ('ai-writer') ON CONFLICT DO NOTHING;