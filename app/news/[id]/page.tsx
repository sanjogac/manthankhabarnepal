import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { NewsDetailContent } from "@/components/news-detail-content"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: article } = await supabase
    .from("news_articles")
    .select("title, excerpt")
    .eq("id", id)
    .single()

  if (!article) {
    return {
      title: "Article Not Found | Manthan Khabar",
    }
  }

  return {
    title: `${article.title} | Manthan Khabar`,
    description: article.excerpt || article.title,
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: article, error } = await supabase
    .from("news_articles")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .single()

  if (!article || error) {
    notFound()
  }

  // Fetch related articles
  const { data: relatedArticles } = await supabase
    .from("news_articles")
    .select("*")
    .eq("published", true)
    .eq("category", article.category)
    .neq("id", id)
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <NewsDetailContent article={article} relatedArticles={relatedArticles || []} />
      <Footer />
    </div>
  )
}
