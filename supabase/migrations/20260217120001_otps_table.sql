-- OTP table for email verification (used by /api/send-otp and /api/verify-otp)
CREATE TABLE IF NOT EXISTS public.otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  otp TEXT NOT NULL,
  expiry TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.otps ENABLE ROW LEVEL SECURITY;

-- No public access — only the service_role key (used by API endpoints) can read/write
-- This is intentional: OTP operations happen server-side via Supabase service role key

-- Index for fast lookups by email
CREATE INDEX IF NOT EXISTS idx_otps_email ON public.otps (email);

-- Index for expiry-based cleanup
CREATE INDEX IF NOT EXISTS idx_otps_expiry ON public.otps (expiry);
