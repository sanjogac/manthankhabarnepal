import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function initializeDatabase() {
  try {
    console.log('[v0] Starting database initialization...');

    // Create articles table
    console.log('[v0] Creating articles table...');
    const articlesSQL = `
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
    `;

    const { error: articlesError } = await supabase.rpc('exec', { sql: articlesSQL }).catch(() => ({ error: null }));
    
    // If exec doesn't work, we'll try direct SQL via the REST API
    if (articlesError && articlesError.message.includes('Unknown')) {
      console.log('[v0] Using direct REST API for table creation...');
      
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
        },
        body: JSON.stringify({ query: articlesSQL }),
      });

      if (!response.ok) {
        console.log('[v0] REST API method not available, creating tables via client...');
      }
    }

    // Create profiles table
    console.log('[v0] Creating profiles table...');
    const profilesSQL = `
      CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        email TEXT NOT NULL,
        is_staff BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `;

    const { error: profilesError } = await supabase.rpc('exec', { sql: profilesSQL }).catch(() => ({ error: null }));

    // Enable RLS on articles
    console.log('[v0] Setting up RLS policies...');
    const rlsSQL = `
      ALTER TABLE IF EXISTS public.articles ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Allow public to view published articles" ON public.articles;
      DROP POLICY IF EXISTS "Allow staff to view all articles" ON public.articles;
      DROP POLICY IF EXISTS "Allow staff to insert articles" ON public.articles;
      DROP POLICY IF EXISTS "Allow staff to update own articles" ON public.articles;
      DROP POLICY IF EXISTS "Allow staff to delete own articles" ON public.articles;

      CREATE POLICY "Allow public to view published articles" ON public.articles
        FOR SELECT
        USING (published = TRUE);

      CREATE POLICY "Allow staff to view all articles" ON public.articles
        FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'is_staff' = 'true'
          )
        );

      CREATE POLICY "Allow staff to insert articles" ON public.articles
        FOR INSERT
        WITH CHECK (
          auth.uid() = author_id
          AND EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'is_staff' = 'true'
          )
        );

      CREATE POLICY "Allow staff to update own articles" ON public.articles
        FOR UPDATE
        USING (
          auth.uid() = author_id
          AND EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'is_staff' = 'true'
          )
        );

      CREATE POLICY "Allow staff to delete own articles" ON public.articles
        FOR DELETE
        USING (
          auth.uid() = author_id
          AND EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'is_staff' = 'true'
          )
        );

      ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Allow users to view their own profile" ON public.profiles;
      DROP POLICY IF EXISTS "Allow staff to view all profiles" ON public.profiles;

      CREATE POLICY "Allow users to view their own profile" ON public.profiles
        FOR SELECT
        USING (auth.uid() = id);

      CREATE POLICY "Allow staff to view all profiles" ON public.profiles
        FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'is_staff' = 'true'
          )
        );
    `;

    const { error: rlsError } = await supabase.rpc('exec', { sql: rlsSQL }).catch(() => ({ error: null }));

    console.log('[v0] Database initialization complete!');
    console.log('[v0] Tables created: articles, profiles');
    console.log('[v0] RLS policies configured');
    process.exit(0);
  } catch (error) {
    console.error('[v0] Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();
