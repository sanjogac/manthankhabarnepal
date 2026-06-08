import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { NewsCard } from "@/components/news-card"
import { Footer } from "@/components/footer"
import { NewsList } from "@/components/news-list"

interface SearchParams {
  category?: string
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()
  
  let query = supabase
    .from("news_articles")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })

  if (params.category) {
    query = query.eq("category", params.category)
  }

  const { data: articles, error } = await query.limit(20)

  const featuredArticle = articles?.[0]
  const remainingArticles = articles?.slice(1) || []

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroSection />
      
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        {params.category && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground capitalize">
              {params.category === 'politics' ? 'राजनीति' : 
               params.category === 'business' ? 'व्यापार' :
               params.category === 'sports' ? 'खेलकुद' :
               params.category === 'entertainment' ? 'मनोरञ्जन' :
               params.category === 'technology' ? 'प्रविधि' : params.category} समाचार
            </h2>
            <p className="text-muted-foreground">
              {params.category === 'politics' ? 'राजनीति' : 
               params.category === 'business' ? 'व्यापार' :
               params.category === 'sports' ? 'खेलकुद' :
               params.category === 'entertainment' ? 'मनोरञ्जन' :
               params.category === 'technology' ? 'प्रविधि' : params.category} मा नवीनतम समाचार र अपडेटहरू
            </p>
          </div>
        )}

        {/* Featured Article */}
        {featuredArticle && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-secondary rounded-full" />
              मुख्य समाचार
            </h2>
            <NewsCard {...featuredArticle} featured />
          </section>
        )}

        {/* Latest News */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full" />
            ताजा समाचार
          </h2>
          
          {remainingArticles.length > 0 ? (
            <NewsList articles={remainingArticles} />
          ) : !featuredArticle ? (
            <div className="text-center py-16 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground text-lg">अहिले कुनै समाचार छैन।</p>
              <p className="text-muted-foreground text-sm mt-2">
                नवीनतम अपडेटहरूको लागि चाँडै फेरि हेर्नुहोस्!
              </p>
            </div>
          ) : null}
        </section>
      </main>

      <Footer />
    </div>
  )
}
