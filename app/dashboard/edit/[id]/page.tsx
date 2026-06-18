'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

const CATEGORIES = ['Politics', 'Business', 'Sports', 'Entertainment', 'Technology', 'Health', 'World', 'Opinion']

interface Article {
  id: string
  title: string
  content: string
  category: string
  author_id: string
  author_name: string
  image_url: string | null
  tags: string[]
  published: boolean
}

export default function EditArticle({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<Article | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Politics')
  const [imageUrl, setImageUrl] = useState('')
  const [tags, setTags] = useState('')
  const [published, setPublished] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    checkAuthAndFetch()
  }, [params.id])

  const checkAuthAndFetch = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user || !user.user_metadata?.is_staff) {
        router.push('/auth/login')
        return
      }

      setUser(user)
      fetchArticle(user.id)
    } catch (err) {
      console.error('Auth error:', err)
      router.push('/auth/login')
    }
  }

  const fetchArticle = async (userId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('articles')
        .select('*')
        .eq('id', params.id)
        .eq('author_id', userId)
        .single()

      if (fetchError) throw fetchError
      if (!data) throw new Error('Article not found or you do not have permission to edit it')

      setArticle(data)
      setTitle(data.title)
      setContent(data.content)
      setCategory(data.category)
      setImageUrl(data.image_url || '')
      setTags(data.tags.join(', '))
      setPublished(data.published)
    } catch (err) {
      console.error('Error fetching article:', err)
      setError(err instanceof Error ? err.message : 'Failed to load article')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required')
      return
    }

    try {
      setSaving(true)
      setError(null)

      const tagsArray = tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)

      const { error: updateError } = await supabase
        .from('articles')
        .update({
          title,
          content,
          category,
          image_url: imageUrl || null,
          tags: tagsArray,
          published,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.id)
        .eq('author_id', user.id)

      if (updateError) throw updateError

      router.push(`/articles/${params.id}`)
    } catch (err) {
      console.error('Error updating article:', err)
      setError(err instanceof Error ? err.message : 'Failed to update article')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading article...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit Article</h1>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Article Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  type="text"
                  placeholder="Article title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  disabled={saving}
                  required
                />
              </div>

              {/* Category and Image URL */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    disabled={saving}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    disabled={saving}
                  />
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <Textarea
                  placeholder="Write your article content here..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  disabled={saving}
                  required
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <Input
                  type="text"
                  placeholder="tag1, tag2, tag3"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  disabled={saving}
                  helperText="Comma-separated tags"
                />
              </div>

              {/* Publish Status */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={e => setPublished(e.target.checked)}
                    disabled={saving}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">
                    Publish
                  </span>
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  {published
                    ? 'This article is visible to the public'
                    : 'This article is hidden from public view'}
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Link href="/dashboard">
                  <Button variant="outline" disabled={saving}>
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
