import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { EditArticleForm } from "@/components/edit-article-form"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: article, error } = await supabase
    .from("news_articles")
    .select("*")
    .eq("id", id)
    .single()

  if (!article || error) {
    notFound()
  }

  return (
    <div className="p-6 lg:p-8">
      <EditArticleForm article={article} />
    </div>
  )
}
