'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

interface Article {
  id: string
  title: string
  content: string
  category: string
  author_name: string
  author_id: string
  image_url: string | null
  tags: string[]
  published: boolean
  created_at: string
  updated_at: string
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isAuthor, setIsAuthor] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchArticle()
    checkUser()
  }, [params.id])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const fetchArticle = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      if (!data) throw new Error('Article not found')

      setArticle(data)

      // Check if current user is the author
      const { data: { user } } = await supabase.auth.getUser()
      if (user && user.id === data.author_id) {
        setIsAuthor(true)
      }
    } catch (err) {
      console.error('Error fetching article:', err)
      setError('Failed to load article')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading article...</p>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error || 'Article not found'}</p>
        <Link href="/">
          <Button>Back to News</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          {isAuthor && user?.user_metadata?.is_staff && (
            <Link href={`/dashboard/edit/${article.id}`}>
              <Button size="sm">Edit Article</Button>
            </Link>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge>{article.category}</Badge>
            <span className="text-sm text-muted-foreground">{formatDate(article.created_at)}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-foreground">{article.title}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>By {article.author_name}</span>
            {article.updated_at !== article.created_at && (
              <span className="text-xs">• Updated {formatDate(article.updated_at)}</span>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {article.image_url && (
          <div className="relative w-full h-96 overflow-hidden rounded-lg mb-8 bg-gray-200">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-invert max-w-none mb-8">
          <div className="whitespace-pre-wrap text-foreground leading-relaxed">
            {article.content}
          </div>
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="border-t pt-6 mb-8">
            <h3 className="font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Related Articles Section */}
        <div className="border-t pt-8">
          <Link href="/">
            <Button variant="outline">Back to All Articles</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
