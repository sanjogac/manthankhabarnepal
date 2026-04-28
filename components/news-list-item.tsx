import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

interface NewsListItemProps {
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

export default function NewsListItem({ article }: NewsListItemProps) {
  const date = new Date(article.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const excerpt = article.content.substring(0, 200) + '...'

  return (
    <Link href={`/articles/${article.id}`}>
      <div className="group animate-slide-up flex gap-4 p-4 border border-border/40 rounded-lg hover:bg-accent/50 hover:border-primary/20 hover:shadow-md transition-all duration-300 cursor-pointer">
        {article.image_url && (
          <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Badge variant="outline" className="font-medium text-xs uppercase tracking-wide">
                {article.category}
              </Badge>
              <span className="text-xs font-medium text-muted-foreground">{date}</span>
            </div>
            <h3 className="font-bold text-base mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
              {article.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {excerpt}
            </p>
          </div>
          <div className="flex items-center justify-between pt-3">
            <span className="text-xs font-medium text-muted-foreground">{article.author_name}</span>
            {article.tags.length > 0 && (
              <div className="flex gap-1.5">
                {article.tags.slice(0, 3).map(tag => (
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
        </div>
      </div>
    </Link>
  )
}
