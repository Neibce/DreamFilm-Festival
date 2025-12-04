'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useState, use, useMemo } from 'react'
import { User } from 'lucide-react'
import Link from 'next/link'
import { MOCK_FILMS } from '@/app/explore/page'
import { MOCK_FILM, MOCK_REVIEWS } from '../mockData'
import { Film, Review, SortType } from '../types'
import { ReviewCard } from '../components/ReviewCard'
import { WriteReviewModal } from '../components/WriteReviewModal'
import { AllReviewsModal } from '../components/AllReviewsModal'
import { FilmStats } from '../components/FilmStats'
import { RelatedFilms } from '../components/RelatedFilms'

export default function FilmDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [helpful, setHelpful] = useState<Record<string, boolean>>({})
  const [sortType, setSortType] = useState<SortType>('helpful')

  const [filmData, setFilmData] = useState(MOCK_FILM)
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS)

  const [isWriteDialogOpen, setIsWriteDialogOpen] = useState(false)
  const [newRating, setNewRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [newReviewText, setNewReviewText] = useState('')

  const relatedFilms = useMemo(() => {
    return MOCK_FILMS
      .filter(film => 
        film.genre === filmData.genre &&
        film.id !== filmData.id &&
        film.status === '승인 완료'
      )
      .sort((a, b) => parseInt(b.id) - parseInt(a.id))
      .slice(0, 3)
  }, [filmData])

  const sortedReviews = useMemo(() => {
    const reviewsCopy = [...reviews]
    switch (sortType) {
      case 'helpful':
        return reviewsCopy.sort((a, b) => b.helpful - a.helpful)
      case 'recent':
        return reviewsCopy.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      case 'rating':
        return reviewsCopy.sort((a, b) => b.rating - a.rating)
      default:
        return reviewsCopy
    }
  }, [reviews, sortType])

  const toggleHelpful = (reviewId: string) => {
    setHelpful(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }))
  }

  const handleSubmitReview = () => {
    if (newRating === 0) {
      alert('평점을 선택해주세요!')
      return
    }

    const hasReviewText = newReviewText.trim().length > 0

    const totalRating = filmData.rating * filmData.votes + newRating
    const newVotes = filmData.votes + 1
    const newAverageRating = parseFloat((totalRating / newVotes).toFixed(1))

    if (hasReviewText) {
      const newReview: Review = {
        id: String(Date.now()),
        author: '현재 사용자',
        rating: newRating,
        text: newReviewText,
        date: new Date().toISOString().split('T')[0],
        helpful: 0
      }

      setReviews(prev => [newReview, ...prev])
      
      setFilmData(prev => ({
        ...prev,
        rating: newAverageRating,
        votes: newVotes,
        reviews: prev.reviews + 1
      }))

      alert('평점과 리뷰가 등록되었습니다!')
    } else {
      setFilmData(prev => ({
        ...prev,
        rating: newAverageRating,
        votes: newVotes
      }))

      alert('평점이 등록되었습니다!')
    }

    console.log('제출된 데이터:', {
      rating: newRating,
      text: hasReviewText ? newReviewText : null,
      filmId: id,
      type: hasReviewText ? '평점+리뷰' : '평점만'
    })

    setNewRating(0)
    setNewReviewText('')
    setHoveredRating(0)
    setIsWriteDialogOpen(false)
  }

  const handleCancelReview = () => {
    setIsWriteDialogOpen(false)
    setNewRating(0)
    setNewReviewText('')
    setHoveredRating(0)
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Film Image */}
      <section className="relative h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${filmData.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col justify-end p-6 md:p-8 lg:p-12">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-2 text-balance">
              {filmData.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Stats */}
              <FilmStats film={filmData} />

              {/* Dream Theme */}
              <Card className="p-6 bg-card border-border">
                <h2 className="text-2xl font-bold text-foreground mb-3">꿈 주제</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {filmData.dreamTheme}
                </p>
              </Card>

              {/* Full Description */}
              <Card className="p-6 bg-card border-border">
                <h2 className="text-2xl font-bold text-foreground mb-3">시나리오</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {filmData.description}
                </p>
              </Card>

              {/* Reviews Section */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <h2 className="text-2xl font-bold text-foreground">리뷰 ({filmData.reviews})</h2>
                  <div className="flex gap-2 flex-wrap">
                    <WriteReviewModal
                      filmTitle={filmData.title}
                      isOpen={isWriteDialogOpen}
                      onOpenChange={setIsWriteDialogOpen}
                      rating={newRating}
                      hoveredRating={hoveredRating}
                      reviewText={newReviewText}
                      onRatingChange={setNewRating}
                      onHoveredRatingChange={setHoveredRating}
                      onReviewTextChange={setNewReviewText}
                      onSubmit={handleSubmitReview}
                      onCancel={handleCancelReview}
                    />
                    <AllReviewsModal
                      filmTitle={filmData.title}
                      reviews={sortedReviews}
                      sortType={sortType}
                      helpful={helpful}
                      onSortChange={setSortType}
                      onToggleHelpful={toggleHelpful}
                    />
                  </div>
                </div>

                {sortedReviews.slice(0, 3).map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    helpful={helpful}
                    onToggleHelpful={toggleHelpful}
                  />
                ))}
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              <Card className="p-6 bg-card border-border">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-3 flex items-center justify-center">
                    <User className="w-8 h-8 text-foreground" />
                  </div>
                  <h4 className="font-bold text-foreground mb-4">{filmData.director}</h4>
                  <Link href={`/director/${encodeURIComponent(filmData.director)}`}>
                    <Button variant="outline" className="w-full border-border">
                      프로필 보기
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
          <RelatedFilms films={relatedFilms} />
        </div>
      </section>
      <Footer />
    </main>
  )
}
