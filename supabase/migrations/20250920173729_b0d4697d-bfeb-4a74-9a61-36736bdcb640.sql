-- Create access leads table
CREATE TABLE IF NOT EXISTS public.access_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.access_leads ENABLE ROW LEVEL SECURITY;

-- Create policies (admin only access for leads)
CREATE POLICY "Only admins can view leads" 
ON public.access_leads 
FOR SELECT 
USING (false);

-- Update profiles table to include new columns if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS language TEXT,
ADD COLUMN IF NOT EXISTS level TEXT,
ADD COLUMN IF NOT EXISTS goal TEXT,
ADD COLUMN IF NOT EXISTS risk_tolerance TEXT,
ADD COLUMN IF NOT EXISTS interested_assets TEXT[];

-- Create user validations table if not exists
CREATE TABLE IF NOT EXISTS public.user_validations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  is_validated BOOLEAN DEFAULT false,
  validated_at TIMESTAMP WITH TIME ZONE,
  validation_source TEXT,
  partner_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user validations
ALTER TABLE public.user_validations ENABLE ROW LEVEL SECURITY;

-- Create policies for user validations
CREATE POLICY "Users can view own validation" 
ON public.user_validations 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create trigger for access leads if not exists  
DROP TRIGGER IF EXISTS update_access_leads_updated_at ON public.access_leads;
CREATE TRIGGER update_access_leads_updated_at
  BEFORE UPDATE ON public.access_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for user validations if not exists
DROP TRIGGER IF EXISTS update_user_validations_updated_at ON public.user_validations;
CREATE TRIGGER update_user_validations_updated_at
  BEFORE UPDATE ON public.user_validations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();