import { Card } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { Review } from '../types'

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
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
    </Card>
  )
}

