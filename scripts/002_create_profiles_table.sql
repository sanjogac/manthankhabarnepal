-- Create profiles table to store user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  is_staff BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- 1. Users can view their own profile
CREATE POLICY "Allow users to view their own profile" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- 2. Staff can view all profiles (for admin purposes)
CREATE POLICY "Allow staff to view all profiles" ON public.profiles
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'is_staff' = 'true'
    )
  );

-- 3. Public can view staff profiles (for article author display)
CREATE POLICY "Allow public to view staff profiles" ON public.profiles
  FOR SELECT
  USING (is_staff = TRUE);

-- Create index
CREATE INDEX IF NOT EXISTS idx_profiles_is_staff ON public.profiles(is_staff);
