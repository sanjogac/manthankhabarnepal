'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import NewsCard from '@/components/news-card'
import NewsListItem from '@/components/news-list-item'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LayoutGrid, List } from 'lucide-react'
import { initializeDatabase } from '@/lib/init-helper'

interface Article {
  id: string
  title: string
  content: string
  category: string
  author_name: string
  image_url: string | null
  tags: string[]
  published: boolean
  created_at: string
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchArticles()
    checkUser()
  }, [])

  const initDB = async () => {
    try {
      setLoading(true)
      await initializeDatabase()
      // Wait for DB to be ready
      await new Promise(resolve => setTimeout(resolve, 1500))
      // Retry fetching articles
      await fetchArticles()
    } catch (err) {
      console.error('Failed to initialize database:', err)
    } finally {
      setLoading(false)
    }
  }

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const fetchArticles = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) {
        // Check if it's a table not found error
        if (error.message.includes('relation "public.articles" does not exist')) {
          setError(
            'Database not initialized. Please visit /setup to initialize the database.'
          )
          return
        }
        throw error
      }

      setArticles(data || [])

      // Extract unique categories
      const uniqueCategories = [...new Set((data || []).map(a => a.category))]
      setCategories(uniqueCategories)
    } catch (err) {
      console.error('Error fetching articles:', err)
      setError('Failed to load articles')
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = selectedCategory
    ? articles.filter(article => article.category === selectedCategory)
    : articles

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer transition-opacity duration-300 hover:opacity-80">
            <img
              src="/manthan-logo.jpg"
              alt="Manthan Khabar Logo"
              className="h-14 w-14 object-contain transform group-hover:scale-105 transition-transform duration-300"
            />
            <div>
              <h1 className="text-3xl font-bold text-foreground">मन्थन खबर नेपाल</h1>
              <p className="text-xs font-medium uppercase tracking-widest text-primary">Manthan Khabar Nepal</p>
            </div>
          </div>
          <div className="flex gap-3">
            {user ? (
              <>
                {user.user_metadata?.is_staff && (
                  <Link href="/dashboard">
                    <Button variant="outline" className="font-medium transition-all duration-300 hover:shadow-md">Dashboard</Button>
                  </Link>
                )}
                <Link href="/auth/logout">
                  <Button variant="ghost" className="font-medium transition-all duration-300 hover:text-primary">Logout</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" className="font-medium transition-all duration-300 hover:shadow-md">Login</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="font-medium transition-all duration-300 hover:shadow-lg">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        {/* View Controls */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-1">Latest News</h2>
            <p className="text-sm font-medium text-muted-foreground">Breaking news and updates from Nepal</p>
          </div>
          <div className="flex gap-2 bg-muted/40 p-1 rounded-lg border border-border/40">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="transition-all duration-300"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="transition-all duration-300"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Categories Filter */}
        {categories.length > 0 && (
          <div className="mb-10 flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="font-medium transition-all duration-300 hover:shadow-md"
            >
              All News
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="font-medium transition-all duration-300 hover:shadow-md"
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="animate-soft-pulse">
                <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary" />
              </div>
              <p className="text-muted-foreground font-medium">Loading articles...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-lg mb-6 animate-slide-up">
            <p className="font-semibold mb-3">{error}</p>
            {error.includes('not initialized') && (
              <Button 
                onClick={initDB}
                className="mt-3" 
                size="sm"
              >
                Initialize Database Now
              </Button>
            )}
          </div>
        )}

        {/* Articles Grid View */}
        {!loading && filteredArticles.length > 0 && viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, idx) => (
              <div key={article.id} style={{ animationDelay: `${idx * 0.1}s` }} className="animate-slide-up">
                <NewsCard article={article} />
              </div>
            ))}
          </div>
        )}

        {/* Articles List View */}
        {!loading && filteredArticles.length > 0 && viewMode === 'list' && (
          <div className="space-y-3">
            {filteredArticles.map((article, idx) => (
              <div key={article.id} style={{ animationDelay: `${idx * 0.08}s` }} className="animate-slide-up">
                <NewsListItem article={article} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredArticles.length === 0 && (
          <div className="text-center py-20 animate-scale-in">
            <div className="mb-4 text-5xl">📰</div>
            <p className="text-lg font-medium text-foreground mb-2">
              {selectedCategory
                ? `No articles found in ${selectedCategory}`
                : 'No articles available yet'}
            </p>
            <p className="text-sm text-muted-foreground">
              {selectedCategory ? 'Try selecting a different category' : 'Check back soon for fresh news'}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
