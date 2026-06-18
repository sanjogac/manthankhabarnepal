-- Create articles table for Nepali news platform
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  image_url TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- RLS Policies:
-- 1. Anyone can view published articles
CREATE POLICY "Allow public to view published articles" ON public.articles
  FOR SELECT
  USING (published = TRUE);

-- 2. Staff can view all articles (published and unpublished)
CREATE POLICY "Allow staff to view all articles" ON public.articles
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'is_staff' = 'true'
    )
  );

-- 3. Only staff can insert articles
CREATE POLICY "Allow staff to insert articles" ON public.articles
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'is_staff' = 'true'
    )
    AND auth.uid() = author_id
  );

-- 4. Only staff can update their own articles
CREATE POLICY "Allow staff to update own articles" ON public.articles
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'is_staff' = 'true'
    )
    AND auth.uid() = author_id
  );

-- 5. Only staff can delete their own articles
CREATE POLICY "Allow staff to delete own articles" ON public.articles
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'is_staff' = 'true'
    )
    AND auth.uid() = author_id
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON public.articles(author_id);
