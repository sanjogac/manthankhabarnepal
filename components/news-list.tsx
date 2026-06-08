"use client"

import { motion } from "framer-motion"
import { NewsCard } from "./news-card"

interface Article {
  id: string
  title: string
  excerpt: string
  image_url?: string
  category: string
  author_name?: string
  created_at: string
}

interface NewsListProps {
  articles: Article[]
}

export function NewsList({ articles }: NewsListProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {articles.map((article, index) => (
        <motion.div
          key={article.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <NewsCard {...article} />
        </motion.div>
      ))}
    </motion.div>
  )
}
