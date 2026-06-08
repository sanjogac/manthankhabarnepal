import { createClient } from "@/lib/supabase/server"
import { ArticlesTable } from "@/components/articles-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export default async function ArticlesPage() {
  const supabase = await createClient()

  const { data: articles } = await supabase
    .from("news_articles")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">सबै लेखहरू</h1>
          <p className="text-muted-foreground">आफ्ना समाचार लेखहरू व्यवस्थापन गर्नुहोस्</p>
        </div>
        <Link href="/staff/dashboard/articles/new">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            नयाँ लेख
          </Button>
        </Link>
      </div>

      <ArticlesTable articles={articles || []} />
    </div>
  )
}
