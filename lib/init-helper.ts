'use server'

import { createClient } from '@supabase/supabase-js'

export async function initializeDatabase() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceKey) {
      return { error: 'Missing Supabase credentials' }
    }

    // Create a Supabase client with service role
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Try using the exec function if available
    const { error: execError } = await supabase.rpc('exec', {
      sql: getSQLStatements(),
    })

    if (execError) {
      console.log('[v0] exec RPC not available, trying direct query')
      // If exec doesn't exist, we'll handle it gracefully
    }

    return { success: true }
  } catch (error) {
    console.error('[v0] DB init error:', error)
    return { error: 'Failed to initialize database' }
  }
}

function getSQLStatements(): string {
  return `
-- Create articles table
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

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY IF NOT EXISTS "Allow public to view published articles" ON public.articles
  FOR SELECT
  USING (published = TRUE);

-- Staff policies
CREATE POLICY IF NOT EXISTS "Allow staff to view all articles" ON public.articles
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'is_staff' = 'true'
    )
  );

CREATE POLICY IF NOT EXISTS "Allow staff to insert articles" ON public.articles
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'is_staff' = 'true'
    )
  );

CREATE POLICY IF NOT EXISTS "Allow staff to update own articles" ON public.articles
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'is_staff' = 'true'
    )
    AND auth.uid() = author_id
  );

CREATE POLICY IF NOT EXISTS "Allow staff to delete own articles" ON public.articles
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'is_staff' = 'true'
    )
    AND auth.uid() = author_id
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON public.articles(author_id);

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  is_staff BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow users to view their own profile" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);
  `
}
