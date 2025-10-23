-- Create referral_agents table for Exness IB agent links
CREATE TABLE public.referral_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  
  -- Exness data
  exness_agent_link_id TEXT UNIQUE NOT NULL,
  exness_referral_code TEXT NOT NULL,
  exness_referral_link TEXT NOT NULL,
  
  -- Commission configuration
  commission_share_percentage NUMERIC NOT NULL DEFAULT 50,
  cap_amount_usd NUMERIC NOT NULL DEFAULT 0,
  
  -- Shared reports
  shared_reports JSONB DEFAULT '["reward_history", "client_report"]'::jsonb,
  
  -- Metadata
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_user_agent UNIQUE(user_id)
);

-- Indexes
CREATE INDEX idx_referral_agents_user_id ON public.referral_agents(user_id);
CREATE INDEX idx_referral_agents_email ON public.referral_agents(email);
CREATE INDEX idx_referral_agents_status ON public.referral_agents(status);

-- Enable RLS
ALTER TABLE public.referral_agents ENABLE ROW LEVEL SECURITY;

-- Users can view their own agent data
CREATE POLICY "Users can view their own agent data"
  ON public.referral_agents
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own agent record
CREATE POLICY "Users can create their own agent record"
  ON public.referral_agents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all agent data
CREATE POLICY "Admins can view all agent data"
  ON public.referral_agents
  FOR SELECT
  USING (has_admin_permission('referrals', 'read'));

-- Admins can manage all agents
CREATE POLICY "Admins can manage all agents"
  ON public.referral_agents
  FOR ALL
  USING (has_admin_permission('referrals', 'manage'));

-- Trigger for updated_at
CREATE TRIGGER update_referral_agents_updated_at
  BEFORE UPDATE ON public.referral_agents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();