-- Table to temporarily store signature drafts keyed by email+phone
CREATE TABLE public.signature_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  data JSONB NOT NULL,
  last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (email, phone)
);

CREATE INDEX idx_signature_drafts_last_accessed ON public.signature_drafts (last_accessed_at);
CREATE INDEX idx_signature_drafts_email_phone ON public.signature_drafts (email, phone);

ALTER TABLE public.signature_drafts ENABLE ROW LEVEL SECURITY;

-- Public access by composite key (email + phone). No auth required.
CREATE POLICY "Anyone can insert a draft"
ON public.signature_drafts
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can read drafts"
ON public.signature_drafts
FOR SELECT
USING (true);

CREATE POLICY "Anyone can update drafts"
ON public.signature_drafts
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete drafts"
ON public.signature_drafts
FOR DELETE
USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_signature_drafts_updated_at
BEFORE UPDATE ON public.signature_drafts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Cleanup function: delete drafts older than 5 minutes since last access
CREATE OR REPLACE FUNCTION public.cleanup_expired_signature_drafts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.signature_drafts
  WHERE last_accessed_at < now() - INTERVAL '5 minutes';
END;
$$;

-- Schedule cleanup every minute via pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'cleanup-expired-signature-drafts',
  '* * * * *',
  $$ SELECT public.cleanup_expired_signature_drafts(); $$
);