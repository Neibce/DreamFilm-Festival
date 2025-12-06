import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Review, SortType } from '../types'
import { ReviewCard } from './ReviewCard'

interface AllReviewsModalProps {
  filmTitle: string
  reviews: Review[]
  sortType: SortType
  onSortChange: (sortType: SortType) => void
}

export function AllReviewsModal({
  filmTitle,
  reviews,
  sortType,
  onSortChange
}: AllReviewsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-border text-xs"
          disabled={reviews.length === 0}
        >
          전체 보기 ({reviews.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            전체 리뷰 ({reviews.length})
          </DialogTitle>
          <DialogDescription>
            {filmTitle}의 모든 리뷰를 확인하세요
          </DialogDescription>
        </DialogHeader>
        
        {/* 모달 내 정렬 버튼 */}
        <div className="flex gap-2 pt-2 border-t">
          <Button
            variant={sortType === 'recent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSortChange('recent')}
            className="text-xs"
          >
            최신순
          </Button>
          <Button
            variant={sortType === 'rating' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSortChange('rating')}
            className="text-xs"
          >
            평점순
          </Button>
        </div>

        <div className="space-y-4 mt-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

