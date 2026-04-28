# Manthan Khabar - Setup Guide

Welcome to the Nepali News Platform!

## Quick Start

### 1. Database Setup

Visit `http://localhost:3000/setup` to initialize your database tables. Click the "Initialize Database" button.

Alternatively, manually run the SQL commands in your Supabase dashboard:

```sql
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

-- Public can view published articles
CREATE POLICY "Allow public to view published articles" ON public.articles
  FOR SELECT
  USING (published = TRUE);

-- Staff can view all articles
CREATE POLICY "Allow staff to view all articles" ON public.articles
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'is_staff' = 'true'
    )
  );

-- Staff can insert articles
CREATE POLICY "Allow staff to insert articles" ON public.articles
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'is_staff' = 'true'
    )
  );

-- Staff can update own articles
CREATE POLICY "Allow staff to update own articles" ON public.articles
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'is_staff' = 'true'
    )
    AND auth.uid() = author_id
  );

-- Staff can delete own articles
CREATE POLICY "Allow staff to delete own articles" ON public.articles
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'is_staff' = 'true'
    )
    AND auth.uid() = author_id
  );

-- Create indexes for better performance
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

CREATE POLICY "Allow users to view their own profile" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);
```

### 2. Create Staff Accounts

1. Create a user account in Supabase Auth
2. In Supabase dashboard, go to **Authentication > Users**
3. Click on the user to edit
4. Add this to **User Metadata**:
   ```json
   {
     "is_staff": true
   }
   ```
5. Save

### 3. Access the Platform

- **Public News Feed**: `http://localhost:3000/`
- **Staff Login**: `http://localhost:3000/auth/login`
- **Staff Dashboard**: `http://localhost:3000/dashboard` (after login)

## Features

- **Public News Feed**: Grid and list view toggle, category filtering
- **Staff Dashboard**: Upload, edit, and delete articles
- **Authentication**: Email/password login via Supabase
- **Role-Based Access**: Only staff can publish articles
- **Responsive Design**: Works on mobile, tablet, and desktop

## Managing Articles

### Create Article
1. Login as staff at `/auth/login`
2. Go to Dashboard
3. Click "Create New Article"
4. Fill in title, content, category, image, and tags
5. Publish or save as draft

### Edit Article
1. From Dashboard, click edit icon on any article
2. Update the content
3. Save changes

### Delete Article
1. From Dashboard, click delete icon
2. Confirm deletion

## Troubleshooting

**"Failed to load articles" error:**
- Visit `/setup` and initialize the database
- Check that tables exist in Supabase
- Verify RLS policies are enabled

**Can't login as staff:**
- Ensure user metadata has `"is_staff": true`
- Check email is confirmed in Supabase
- Clear browser cache and try again

**Articles not saving:**
- Verify you're logged in as staff
- Check RLS policies allow inserts
- Check browser console for detailed errors

## Support

For issues, check your Supabase dashboard logs and browser console for detailed error messages.
