import { createClient } from '@/lib/supabase/server'

export async function initializeDatabase() {
  const supabase = await createClient()

  try {
    // Check if articles table exists by trying to query it
    const { error: checkError } = await supabase
      .from('articles')
      .select('id')
      .limit(1)

    if (checkError?.code === 'PGRST116') {
      // Table doesn't exist, we need to create it
      console.log('[v0] Articles table does not exist, tables need to be created in Supabase')
      return false
    }

    return true
  } catch (error) {
    console.error('[v0] Database initialization check failed:', error)
    return false
  }
}

export async function getArticles() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Error fetching articles:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('[v0] Exception fetching articles:', error)
    return null
  }
}

export async function getArticleById(id: string) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('[v0] Error fetching article:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('[v0] Exception fetching article:', error)
    return null
  }
}
