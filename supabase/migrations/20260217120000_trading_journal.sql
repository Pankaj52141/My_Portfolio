-- Trading Journal table for DarkLab
CREATE TABLE public.trading_journal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_date DATE NOT NULL,
  screenshot_url TEXT NOT NULL,
  pnl_amount DECIMAL(12,2) NOT NULL,
  instrument TEXT DEFAULT 'OPTIONS',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.trading_journal ENABLE ROW LEVEL SECURITY;

-- Allow public read access (page is already protected by DarkLabGate)
CREATE POLICY "Allow public read on trading_journal"
  ON public.trading_journal
  FOR SELECT
  USING (true);

-- Allow insert (owner verification handled by OTP API + frontend)
CREATE POLICY "Allow insert on trading_journal"
  ON public.trading_journal
  FOR INSERT
  WITH CHECK (true);

-- Allow delete (owner verification handled by OTP API + frontend)
CREATE POLICY "Allow delete on trading_journal"
  ON public.trading_journal
  FOR DELETE
  USING (true);

-- Allow update (owner verification handled by OTP API + frontend)
CREATE POLICY "Allow update on trading_journal"
  ON public.trading_journal
  FOR UPDATE
  USING (true);

-- Create index on trade_date for faster queries
CREATE INDEX idx_trading_journal_trade_date ON public.trading_journal (trade_date DESC);
