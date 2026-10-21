CREATE OR REPLACE VIEW public.posts_public_view AS
SELECT id, title, category, excerpt, content, image_url, impact_score, created_at
FROM public.news;

GRANT SELECT ON public.posts_public_view TO anon;
GRANT SELECT ON public.posts_public_view TO authenticated;
GRANT SELECT ON public.posts_public_view TO service_role;