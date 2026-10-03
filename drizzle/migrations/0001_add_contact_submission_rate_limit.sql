ALTER TABLE public.contact_submissions ADD COLUMN source_hash text;

CREATE INDEX contact_submissions_source_hash_created_at_idx ON public.contact_submissions (source_hash, created_at DESC);

COMMENT ON COLUMN public.contact_submissions.source_hash IS 'One-way request fingerprint used only for submission rate limiting';