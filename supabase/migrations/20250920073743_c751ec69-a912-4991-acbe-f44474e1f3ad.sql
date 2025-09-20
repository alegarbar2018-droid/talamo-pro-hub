-- Create admin roles enum
CREATE TYPE admin_role AS ENUM ('ADMIN', 'ANALYST', 'CONTENT', 'SUPPORT', 'USER');

-- Create admin_users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  role admin_role NOT NULL DEFAULT 'USER',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create permissions table
CREATE TABLE public.permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role admin_role NOT NULL,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course_items table (LMS)
CREATE TABLE public.course_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'articulate',
  kind TEXT NOT NULL, -- rise|storyline|scorm|xapi|link
  external_url TEXT,
  storage_key TEXT,
  duration_min INTEGER,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft', -- draft|published|archived
  mapping JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course_events table (tracking)
CREATE TABLE public.course_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.course_items(id) ON DELETE CASCADE,
  verb TEXT NOT NULL, -- started|completed|passed|failed|progress
  value FLOAT,
  meta JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create signals table
CREATE TABLE public.signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  instrument TEXT NOT NULL,
  timeframe TEXT NOT NULL,
  rr FLOAT NOT NULL,
  logic TEXT NOT NULL,
  invalidation TEXT NOT NULL,
  media_urls TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft', -- draft|review|published|archived
  author_id UUID NOT NULL,
  reviewer_id UUID,
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  audit_trail JSONB
);

-- Create strategies table
CREATE TABLE public.strategies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  risk_tier TEXT NOT NULL, -- conservative|moderate|aggressive
  pf FLOAT NOT NULL,
  max_dd FLOAT NOT NULL,
  green_months_pct INTEGER NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- draft|review|verified|beta|archived
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create eas table
CREATE TABLE public.eas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  params JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft', -- draft|review|verified|beta|archived
  download_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create competitions table
CREATE TABLE public.competitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  rules TEXT NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- draft|open|closed|archived
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create posts table (community)
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  author_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'published', -- published|hidden|archived
  moderation JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create referrals table
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  code TEXT NOT NULL UNIQUE,
  clicks INTEGER NOT NULL DEFAULT 0,
  signups INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  actor_id UUID,
  action TEXT NOT NULL,
  resource TEXT,
  meta JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tools table
CREATE TABLE public.tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active|inactive|maintenance
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create integrations table
CREATE TABLE public.integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- crm|n8n|webhook
  config JSONB NOT NULL DEFAULT '{}',
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- Create function to get current admin role
CREATE OR REPLACE FUNCTION public.get_current_admin_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.admin_users WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public;

-- Create function to check admin permission
CREATE OR REPLACE FUNCTION public.has_admin_permission(_resource TEXT, _action TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.permissions p
    JOIN public.admin_users au ON au.role = p.role
    WHERE au.user_id = auth.uid()
    AND p.resource = _resource
    AND p.action = _action
  ) OR get_current_admin_role() = 'ADMIN';
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public;

-- RLS Policies for admin_users
CREATE POLICY "Admins can manage admin users" ON public.admin_users
  FOR ALL USING (get_current_admin_role() = 'ADMIN');

CREATE POLICY "Users can view their own admin record" ON public.admin_users
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for permissions
CREATE POLICY "Admins can manage permissions" ON public.permissions
  FOR ALL USING (get_current_admin_role() = 'ADMIN');

CREATE POLICY "Users can view permissions" ON public.permissions
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- RLS Policies for course_items
CREATE POLICY "Admin and content can manage courses" ON public.course_items
  FOR ALL USING (has_admin_permission('lms', 'manage'));

CREATE POLICY "All authenticated can view published courses" ON public.course_items
  FOR SELECT USING (auth.uid() IS NOT NULL AND (status = 'published' OR has_admin_permission('lms', 'read')));

-- RLS Policies for course_events
CREATE POLICY "Users can create their own events" ON public.course_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own events" ON public.course_events
  FOR SELECT USING (auth.uid() = user_id OR has_admin_permission('lms', 'read'));

-- RLS Policies for signals
CREATE POLICY "Admin and analyst can manage signals" ON public.signals
  FOR ALL USING (has_admin_permission('signals', 'manage'));

CREATE POLICY "All authenticated can view published signals" ON public.signals
  FOR SELECT USING (auth.uid() IS NOT NULL AND (status = 'published' OR has_admin_permission('signals', 'read')));

-- RLS Policies for strategies
CREATE POLICY "Admin and analyst can manage strategies" ON public.strategies
  FOR ALL USING (has_admin_permission('copy', 'manage'));

CREATE POLICY "All authenticated can view verified strategies" ON public.strategies
  FOR SELECT USING (auth.uid() IS NOT NULL AND (status = 'verified' OR has_admin_permission('copy', 'read')));

-- RLS Policies for eas
CREATE POLICY "Admin and content can manage eas" ON public.eas
  FOR ALL USING (has_admin_permission('eas', 'manage'));

CREATE POLICY "All authenticated can view verified eas" ON public.eas
  FOR SELECT USING (auth.uid() IS NOT NULL AND (status = 'verified' OR has_admin_permission('eas', 'read')));

-- RLS Policies for competitions
CREATE POLICY "Admin and content can manage competitions" ON public.competitions
  FOR ALL USING (has_admin_permission('competitions', 'manage'));

CREATE POLICY "All authenticated can view open competitions" ON public.competitions
  FOR SELECT USING (auth.uid() IS NOT NULL AND (status = 'open' OR has_admin_permission('competitions', 'read')));

-- RLS Policies for posts
CREATE POLICY "Admin and analyst can manage posts" ON public.posts
  FOR ALL USING (has_admin_permission('community', 'manage'));

CREATE POLICY "All authenticated can view published posts" ON public.posts
  FOR SELECT USING (auth.uid() IS NOT NULL AND (status = 'published' OR has_admin_permission('community', 'read')));

-- RLS Policies for referrals
CREATE POLICY "Users can manage their own referrals" ON public.referrals
  FOR ALL USING (auth.uid() = user_id OR has_admin_permission('referrals', 'manage'));

-- RLS Policies for audit_logs
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (has_admin_permission('audit', 'read'));

-- RLS Policies for tools
CREATE POLICY "Admin and content can manage tools" ON public.tools
  FOR ALL USING (has_admin_permission('tools', 'manage'));

CREATE POLICY "All authenticated can view active tools" ON public.tools
  FOR SELECT USING (auth.uid() IS NOT NULL AND (status = 'active' OR has_admin_permission('tools', 'read')));

-- RLS Policies for integrations
CREATE POLICY "Only admins can manage integrations" ON public.integrations
  FOR ALL USING (get_current_admin_role() = 'ADMIN');

-- Create update triggers
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_items_updated_at
  BEFORE UPDATE ON public.course_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_signals_updated_at
  BEFORE UPDATE ON public.signals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_strategies_updated_at
  BEFORE UPDATE ON public.strategies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_eas_updated_at
  BEFORE UPDATE ON public.eas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_competitions_updated_at
  BEFORE UPDATE ON public.competitions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_referrals_updated_at
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tools_updated_at
  BEFORE UPDATE ON public.tools
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON public.integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default permissions
INSERT INTO public.permissions (role, resource, action) VALUES
-- ADMIN permissions (all)
('ADMIN', 'users', 'manage'),
('ADMIN', 'affiliation', 'manage'),
('ADMIN', 'lms', 'manage'),
('ADMIN', 'academy', 'manage'),
('ADMIN', 'signals', 'manage'),
('ADMIN', 'copy', 'manage'),
('ADMIN', 'eas', 'manage'),
('ADMIN', 'tools', 'manage'),
('ADMIN', 'competitions', 'manage'),
('ADMIN', 'community', 'manage'),
('ADMIN', 'referrals', 'manage'),
('ADMIN', 'integrations', 'manage'),
('ADMIN', 'audit', 'read'),

-- ANALYST permissions
('ANALYST', 'signals', 'manage'),
('ANALYST', 'copy', 'manage'),
('ANALYST', 'community', 'moderate'),
('ANALYST', 'audit', 'read'),

-- CONTENT permissions
('CONTENT', 'academy', 'manage'),
('CONTENT', 'eas', 'manage'),
('CONTENT', 'competitions', 'manage'),
('CONTENT', 'lms', 'manage'),
('CONTENT', 'tools', 'manage'),

-- SUPPORT permissions
('SUPPORT', 'affiliation', 'manage'),
('SUPPORT', 'users', 'read'),
('SUPPORT', 'users', 'edit_limited');

-- Create indexes for performance
CREATE INDEX idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX idx_admin_users_role ON public.admin_users(role);
CREATE INDEX idx_permissions_role_resource ON public.permissions(role, resource);
CREATE INDEX idx_course_events_user_id ON public.course_events(user_id);
CREATE INDEX idx_course_events_course_id ON public.course_events(course_id);
CREATE INDEX idx_signals_status ON public.signals(status);
CREATE INDEX idx_signals_author_id ON public.signals(author_id);
CREATE INDEX idx_strategies_status ON public.strategies(status);
CREATE INDEX idx_eas_status ON public.eas(status);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_author_id ON public.posts(author_id);
CREATE INDEX idx_referrals_user_id ON public.referrals(user_id);
CREATE INDEX idx_referrals_code ON public.referrals(code);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX idx_audit_logs_actor_id ON public.audit_logs(actor_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);