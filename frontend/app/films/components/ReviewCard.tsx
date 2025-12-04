import { Card } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { Review } from '../types'

interface ReviewCardProps {
  review: Review
  helpful: Record<string, boolean>
  onToggleHelpful: (reviewId: string) => void
}

export function ReviewCard({ review, helpful, onToggleHelpful }: ReviewCardProps) {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-foreground">{review.author}</h3>
          <p className="text-sm text-muted-foreground">{review.date}</p>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted'
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-foreground leading-relaxed mb-4">{review.text}</p>
      <div className="flex gap-4">
        <button
          onClick={() => onToggleHelpful(review.id)}
          className={`text-sm px-3 py-1 rounded transition ${
            helpful[review.id]
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-border'
          }`}
        >
          👍 ({review.helpful + (helpful[review.id] ? 1 : 0)})
        </button>
      </div>
    </Card>
  )
}

