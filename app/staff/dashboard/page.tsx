import { createClient } from "@/lib/supabase/server"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentArticles } from "@/components/recent-articles"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get stats
  const { count: totalArticles } = await supabase
    .from("news_articles")
    .select("*", { count: "exact", head: true })

  const { count: publishedArticles } = await supabase
    .from("news_articles")
    .select("*", { count: "exact", head: true })
    .eq("published", true)

  const { count: draftArticles } = await supabase
    .from("news_articles")
    .select("*", { count: "exact", head: true })
    .eq("published", false)

  // Get recent articles
  const { data: recentArticles } = await supabase
    .from("news_articles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  const stats = {
    total: totalArticles || 0,
    published: publishedArticles || 0,
    drafts: draftArticles || 0,
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">ड्यासबोर्ड</h1>
        <p className="text-muted-foreground">
          स्वागत छ! यहाँ तपाईंको समाचार पोर्टलको अवलोकन छ।
        </p>
      </div>

      <DashboardStats stats={stats} />

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">हालैका लेखहरू</h2>
        <RecentArticles articles={recentArticles || []} />
      </div>
    </div>
  )
}
