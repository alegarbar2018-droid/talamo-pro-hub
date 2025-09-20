-- Create affiliation tracking tables
CREATE TABLE public.affiliations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  partner_id TEXT NOT NULL,
  is_affiliated BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create affiliation reports table for CSV fallback
CREATE TABLE public.affiliation_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  uid TEXT,
  partner_id TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.affiliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliation_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for affiliations
CREATE POLICY "Users can view their own affiliation" 
ON public.affiliations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own affiliation" 
ON public.affiliations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own affiliation" 
ON public.affiliations 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Admin only policies for affiliation reports
CREATE POLICY "Admin can manage affiliation reports" 
ON public.affiliation_reports 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_affiliations_updated_at
  BEFORE UPDATE ON public.affiliations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_affiliations_user_id ON public.affiliations(user_id);
CREATE INDEX idx_affiliation_reports_email ON public.affiliation_reports(email);
CREATE INDEX idx_affiliation_reports_uid ON public.affiliation_reports(uid);
CREATE INDEX idx_affiliation_reports_created_at ON public.affiliation_reports(created_at DESC);