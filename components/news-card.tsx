import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

interface NewsCardProps {
  article: {
    id: string
    title: string
    content: string
    category: string
    author_name: string
    image_url: string | null
    tags: string[]
    created_at: string
  }
}

export default function NewsCard({ article }: NewsCardProps) {
  const date = new Date(article.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const excerpt = article.content.substring(0, 150) + '...'

  return (
    <Link href={`/articles/${article.id}`}>
      <Card className="group animate-slide-up hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full overflow-hidden border-border/40 hover:border-primary/20">
        {article.image_url && (
          <div className="relative w-full h-48 overflow-hidden bg-muted">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline" className="font-medium text-xs uppercase tracking-wide">
              {article.category}
            </Badge>
            <span className="text-xs font-medium text-muted-foreground">{date}</span>
          </div>
          <h3 className="font-bold text-base mb-2 line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-300">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow leading-relaxed">
            {excerpt}
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-border/40">
            <span className="text-xs font-medium text-muted-foreground">{article.author_name}</span>
            {article.tags.length > 0 && (
              <div className="flex gap-1.5">
                {article.tags.slice(0, 2).map(tag => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="text-xs font-medium px-2 py-0.5 bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
