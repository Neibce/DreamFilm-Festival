import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Edit, Star } from 'lucide-react'

interface WriteReviewModalProps {
  filmTitle: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  rating: number
  hoveredRating: number
  reviewText: string
  onRatingChange: (rating: number) => void
  onHoveredRatingChange: (rating: number) => void
  onReviewTextChange: (text: string) => void
  onSubmit: () => void
  onCancel: () => void
}

export function WriteReviewModal({
  filmTitle,
  isOpen,
  onOpenChange,
  rating,
  hoveredRating,
  reviewText,
  onRatingChange,
  onHoveredRatingChange,
  onReviewTextChange,
  onSubmit,
  onCancel
}: WriteReviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="text-xs">
          <Edit className="w-3.5 h-3.5 mr-1" />
          리뷰 작성
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            리뷰 작성
          </DialogTitle>
          <DialogDescription>
            {filmTitle}에 대한 평점과 리뷰를 남겨주세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 평점 선택 */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              평점 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 items-center">
              {[1, 2, 3, 4, 5].map((ratingValue) => (
                <button
                  key={ratingValue}
                  type="button"
                  onClick={() => onRatingChange(ratingValue)}
                  onMouseEnter={() => onHoveredRatingChange(ratingValue)}
                  onMouseLeave={() => onHoveredRatingChange(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      ratingValue <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-lg font-semibold text-foreground">
                  {rating}.0
                </span>
              )}
            </div>
            {rating === 0 && (
              <p className="text-xs text-muted-foreground">
                별을 클릭하여 평점을 선택해주세요
              </p>
            )}
          </div>

          {/* 리뷰 텍스트 (선택사항) */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              리뷰 (선택사항)
            </label>
            <Textarea
              placeholder="이 작품에 대한 생각을 자유롭게 작성해주세요..."
              value={reviewText}
              onChange={(e) => onReviewTextChange(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground">
              {reviewText.length} / 1000자
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            취소
          </Button>
          <Button
            variant="default"
            onClick={onSubmit}
            disabled={rating === 0}
          >
            등록하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

