-- Create lms-assets bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('lms-assets', 'lms-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for lms assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload lms assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update lms assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete lms assets" ON storage.objects;

-- Allow public read access to lms-assets
CREATE POLICY "Public read access for lms assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'lms-assets');

-- Allow admins to upload files
CREATE POLICY "Admins can upload lms assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'lms-assets' 
  AND is_admin(auth.uid())
);

-- Allow admins to update files
CREATE POLICY "Admins can update lms assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'lms-assets' 
  AND is_admin(auth.uid())
);

-- Allow admins to delete files
CREATE POLICY "Admins can delete lms assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'lms-assets' 
  AND is_admin(auth.uid())
);