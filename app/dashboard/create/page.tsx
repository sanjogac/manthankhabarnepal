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

export default function CreateArticle() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Politics')
  const [imageUrl, setImageUrl] = useState('')
  const [tags, setTags] = useState('')
  const [published, setPublished] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.user_metadata?.is_staff) {
      router.push('/auth/login')
      return
    }

    setUser(user)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const tagsArray = tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)

      const { data, error: insertError } = await supabase
        .from('articles')
        .insert({
          title,
          content,
          category,
          author_id: user.id,
          author_name: user.email || 'Unknown',
          image_url: imageUrl || null,
          tags: tagsArray,
          published,
        })
        .select()

      if (insertError) throw insertError

      if (data && data[0]) {
        router.push(`/articles/${data[0].id}`)
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      console.error('Error creating article:', err)
      setError(err instanceof Error ? err.message : 'Failed to create article')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create New Article</h1>
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
                  disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                    disabled={loading}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">
                    Publish immediately
                  </span>
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  {published
                    ? 'This article will be visible to the public'
                    : 'This article will be saved as a draft'}
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Article'}
                </Button>
                <Link href="/dashboard">
                  <Button variant="outline" disabled={loading}>
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
