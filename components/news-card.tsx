"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface NewsCardProps {
  id: string
  title: string
  excerpt: string
  image_url?: string
  category: string
  author_name?: string
  created_at: string
  featured?: boolean
}

export function NewsCard({
  id,
  title,
  excerpt,
  image_url,
  category,
  author_name,
  created_at,
  featured = false,
}: NewsCardProps) {
  const formattedDate = new Date(created_at).toLocaleDateString("ne-NP", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <Link href={`/news/${id}`}>
          <Card className="overflow-hidden group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="relative h-[400px] md:h-[500px]">
              {image_url ? (
                <Image
                  src={image_url}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <Badge className="mb-3 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  {category}
                </Badge>
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 line-clamp-2 text-balance">
                  {title}
                </h2>
                <p className="text-white/80 text-sm md:text-base mb-4 line-clamp-2">
                  {excerpt}
                </p>
                <div className="flex items-center gap-4 text-white/70 text-sm">
                  {author_name && (
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {author_name}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formattedDate}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/news/${id}`}>
        <Card className="overflow-hidden group cursor-pointer h-full border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
          <div className="relative h-48">
            {image_url ? (
              <Image
                src={image_url}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/50" />
            )}
            <div className="absolute top-3 left-3">
              <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-xs">
                {category}
              </Badge>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
              {excerpt}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                {author_name && (
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {author_name}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formattedDate}
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
