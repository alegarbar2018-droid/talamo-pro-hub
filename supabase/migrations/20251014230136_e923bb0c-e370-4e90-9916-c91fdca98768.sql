-- Create trading journal entries table
CREATE TABLE public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trade_date TIMESTAMP WITH TIME ZONE NOT NULL,
  instrument TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('BUY', 'SELL')),
  entry_price NUMERIC NOT NULL,
  exit_price NUMERIC,
  lot_size NUMERIC NOT NULL,
  stop_loss NUMERIC,
  take_profit NUMERIC,
  result NUMERIC,
  result_pips NUMERIC,
  commission NUMERIC DEFAULT 0,
  swap NUMERIC DEFAULT 0,
  notes TEXT,
  emotions TEXT[],
  tags TEXT[],
  screenshots TEXT[],
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled')),
  closed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_journal_entries_user_id ON public.journal_entries(user_id);
CREATE INDEX idx_journal_entries_trade_date ON public.journal_entries(trade_date DESC);
CREATE INDEX idx_journal_entries_status ON public.journal_entries(status);

-- Enable RLS
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own journal entries"
  ON public.journal_entries
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journal entries"
  ON public.journal_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
  ON public.journal_entries
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
  ON public.journal_entries
  FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can view all journal entries
CREATE POLICY "Admins can view all journal entries"
  ON public.journal_entries
  FOR SELECT
  USING (has_admin_permission('journal', 'read'));

-- Create trigger to update updated_at
CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for AI mentor recommendations
CREATE TABLE public.journal_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_text TEXT NOT NULL,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('pattern', 'risk', 'psychology', 'strategy', 'general')),
  based_on_entries UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for recommendations
CREATE INDEX idx_journal_recommendations_user_id ON public.journal_recommendations(user_id);
CREATE INDEX idx_journal_recommendations_created_at ON public.journal_recommendations(created_at DESC);

-- Enable RLS for recommendations
ALTER TABLE public.journal_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recommendations
CREATE POLICY "Users can view their own recommendations"
  ON public.journal_recommendations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert recommendations"
  ON public.journal_recommendations
  FOR INSERT
  WITH CHECK (true);