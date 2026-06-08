"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Calendar, Edit, Trash2, Eye, EyeOff, MoreVertical, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { createClient } from "@/lib/supabase/client"

interface Article {
  id: string
  title: string
  category: string
  published: boolean
  created_at: string
  author_name?: string
}

interface ArticlesTableProps {
  articles: Article[]
}

export function ArticlesTable({ articles }: ArticlesTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    const supabase = createClient()
    
    await supabase.from("news_articles").delete().eq("id", deleteId)
    
    setDeleting(false)
    setDeleteId(null)
    router.refresh()
  }

  const togglePublish = async (id: string, currentStatus: boolean) => {
    const supabase = createClient()
    await supabase
      .from("news_articles")
      .update({ published: !currentStatus })
      .eq("id", id)
    router.refresh()
  }

  if (articles.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground text-lg">कुनै लेख फेला परेन।</p>
          <p className="text-muted-foreground text-sm mt-1">सुरु गर्न आफ्नो पहिलो लेख सिर्जना गर्नुहोस्।</p>
          <Link href="/staff/dashboard/articles/new">
            <Button className="mt-4">लेख सिर्जना गर्नुहोस्</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">शीर्षक</th>
                <th className="text-left p-4 font-medium text-muted-foreground">विषय</th>
                <th className="text-left p-4 font-medium text-muted-foreground">स्थिति</th>
                <th className="text-left p-4 font-medium text-muted-foreground">मिति</th>
                <th className="text-right p-4 font-medium text-muted-foreground">कार्यहरू</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {articles.map((article, index) => {
                const formattedDate = new Date(article.created_at).toLocaleDateString("ne-NP", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })

                return (
                  <motion.tr
                    key={article.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="max-w-xs">
                        <p className="font-medium text-foreground truncate">{article.title}</p>
                        {article.author_name && (
                          <p className="text-xs text-muted-foreground">By {article.author_name}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" className="capitalize">
                        {article.category}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => togglePublish(article.id, article.published)}
                        className="flex items-center gap-1.5"
                      >
                        {article.published ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                            <Eye className="h-3 w-3 mr-1" />
                            प्रकाशित
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <EyeOff className="h-3 w-3 mr-1" />
                            ड्राफ्ट
                          </Badge>
                        )}
                      </button>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {formattedDate}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {article.published && (
                            <DropdownMenuItem asChild>
                              <Link href={`/news/${article.id}`} target="_blank">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                लाइभ हेर्नुहोस्
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem asChild>
                            <Link href={`/staff/dashboard/articles/${article.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              सम्पादन
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteId(article.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            मेटाउनुहोस्
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>लेख मेटाउनुहोस्</AlertDialogTitle>
            <AlertDialogDescription>
              के तपाईं यो लेख मेटाउन निश्चित हुनुहुन्छ? यो कार्य पूर्ववत गर्न सकिँदैन।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>रद्द गर्नुहोस्</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "मेटाउँदै..." : "मेटाउनुहोस्"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
