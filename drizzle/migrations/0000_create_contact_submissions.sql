CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  whatsapp text NOT NULL CHECK (char_length(whatsapp) BETWEEN 7 AND 30),
  email text NOT NULL CHECK (char_length(email) <= 255),
  property_type text NOT NULL CHECK (property_type IN ('2 dormitorios', '3 dormitorios', 'Penthouse')),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.contact_submissions TO service_role;

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE INDEX contact_submissions_created_at_idx ON public.contact_submissions (created_at DESC);