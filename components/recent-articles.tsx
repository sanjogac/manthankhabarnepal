"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Calendar, Edit, Eye, EyeOff } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Article {
  id: string
  title: string
  category: string
  published: boolean
  created_at: string
}

interface RecentArticlesProps {
  articles: Article[]
}

export function RecentArticles({ articles }: RecentArticlesProps) {
  if (articles.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No articles yet. Create your first article!</p>
          <Link href="/staff/dashboard/articles/new">
            <Button className="mt-4">Create Article</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50">
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {articles.map((article, index) => {
            const formattedDate = new Date(article.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })

            return (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{article.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge variant="secondary" className="text-xs capitalize">
                      {article.category}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formattedDate}
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      {article.published ? (
                        <>
                          <Eye className="h-3 w-3 text-green-600" />
                          <span className="text-green-600">Published</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Draft</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
                <Link href={`/staff/dashboard/articles/${article.id}/edit`}>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
