CREATE TABLE public.leads (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 profile text NOT NULL CHECK (profile IN ('investidor','proprietario','parceiro','institucional','newsletter')),
 name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
 email text NOT NULL CHECK (char_length(email) <= 255),
 whatsapp text NOT NULL DEFAULT '',
 company text NOT NULL DEFAULT '',
 fields jsonb NOT NULL DEFAULT '{}'::jsonb,
 language text NOT NULL DEFAULT 'pt' CHECK (language IN ('pt','en','es')),
 utm jsonb NOT NULL DEFAULT '{}'::jsonb,
 consent boolean NOT NULL CHECK (consent = true),
 request_hash text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE INDEX leads_request_time ON public.leads(request_hash,created_at);
CREATE FUNCTION public.submit_sueloss_lead(payload jsonb, fingerprint text) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE result uuid;
BEGIN
 PERFORM pg_advisory_xact_lock(hashtext(fingerprint));
 IF (SELECT count(*) FROM public.leads WHERE request_hash = fingerprint AND created_at > now() - interval '1 hour') >= 5 THEN
 RAISE EXCEPTION 'RATE_LIMIT';
 END IF;
 INSERT INTO public.leads(profile,name,email,whatsapp,company,fields,language,utm,consent,request_hash)
 VALUES(payload->>'profile',payload->>'name',payload->>'email',coalesce(payload->>'whatsapp',''),coalesce(payload->>'company',''),payload->'fields',payload->>'language',payload->'utm',(payload->>'consent')::boolean,fingerprint) RETURNING id INTO result;
 RETURN result;
END;
$$;
REVOKE ALL ON FUNCTION public.submit_sueloss_lead(jsonb,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_sueloss_lead(jsonb,text) TO service_role;