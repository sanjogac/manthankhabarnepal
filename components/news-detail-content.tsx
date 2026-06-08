"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowLeft, Share2, Bookmark } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { NewsCard } from "./news-card"

interface Article {
  id: string
  title: string
  content: string
  excerpt?: string
  image_url?: string
  category: string
  author_name?: string
  created_at: string
}

interface NewsDetailContentProps {
  article: Article
  relatedArticles: Article[]
}

export function NewsDetailContent({ article, relatedArticles }: NewsDetailContentProps) {
  const formattedDate = new Date(article.created_at).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        })
      } catch {
        // User cancelled or error
      }
    }
  }

  return (
    <main className="flex-1">
      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[300px] md:h-[500px] bg-primary"
      >
        {article.image_url ? (
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </motion.div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl shadow-xl p-6 md:p-10"
        >
          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to News
            </Button>
          </Link>

          {/* Category */}
          <Badge className="mb-4 bg-secondary text-secondary-foreground hover:bg-secondary/90">
            {article.category}
          </Badge>

          {/* Title */}
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
            {article.author_name && (
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {article.author_name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </span>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {article.content.split("\n").map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="text-foreground/90 leading-relaxed mb-4"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </motion.article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 mb-12"
          >
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-secondary rounded-full" />
              Related Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <NewsCard key={related.id} {...related} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </main>
  )
}
