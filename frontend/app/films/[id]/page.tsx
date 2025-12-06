'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState, useMemo, useEffect } from 'react'
import { User, Heart, MessageSquarePlus } from 'lucide-react'
import Link from 'next/link'
import { api, resolveImageUrl } from '@/lib/api'
import { Film, Review, SortType } from '../types'
import { ReviewCard } from '../components/ReviewCard'
import { WriteReviewModal } from '../components/WriteReviewModal'
import { AllReviewsModal } from '../components/AllReviewsModal'
import { FilmStats } from '../components/FilmStats'
import { useParams } from 'next/navigation'
import { useToastStore } from '@/store/toast'
import { RelatedFilms } from '../components/RelatedFilms'

type RelatedFilmItem = {
  id: string
  title: string
  director: string
  image: string
  rating: number
  likes: number
  reviews: number
}

export default function FilmDetailPage({ params }: { params: { id: string } }) {
  const routeParams = useParams<{ id: string }>()
  const id = routeParams?.id
  const [sortType, setSortType] = useState<SortType>('recent')
  const VOTE_LIMIT = 3
  const [isLiked, setIsLiked] = useState(false)
  const [votedFilms, setVotedFilms] = useState<Set<string>>(new Set())
  const [remainingVotes, setRemainingVotes] = useState(VOTE_LIMIT)
  const [loadingVotes, setLoadingVotes] = useState(true)

  const [filmData, setFilmData] = useState<Film | null>(null)
  const [currentUser, setCurrentUser] = useState<{ id?: string; username?: string } | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [relatedFilms, setRelatedFilms] = useState<RelatedFilmItem[]>([])

  const [isWriteDialogOpen, setIsWriteDialogOpen] = useState(false)
  const [newRating, setNewRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [newReviewText, setNewReviewText] = useState('')
  const { show } = useToastStore()

  // 서버 기준 내 투표 목록/남은 수 로드
  useEffect(() => {
    if (!id) return
    let mounted = true
    setLoadingVotes(true)

    api.getMyVotes()
      .then((votes) => {
        if (!mounted) return
        const voteList = Array.isArray(votes) ? votes : []
        const votedIds = new Set<string>(voteList.map((v: any) => String(v.filmId)))
        setVotedFilms(votedIds)
        setIsLiked(votedIds.has(id))
        setRemainingVotes(Math.max(0, VOTE_LIMIT - votedIds.size))
      })
      .catch((err: Error) => {
        if (!mounted) return
        setVotedFilms(new Set())
        setIsLiked(false)
        setRemainingVotes(VOTE_LIMIT)
        if (err.message && !err.message.includes('401')) {
          show({ message: err.message || '투표 정보를 불러오지 못했습니다.', kind: 'error' })
        }
      })
      .finally(() => {
        if (mounted) setLoadingVotes(false)
      })

    return () => { mounted = false }
  }, [id, show])

  // Fetch film detail
  useEffect(() => {
    if (!id) return
    let mounted = true
    setLoading(true)

    api.getFilmDetail(id)
      .then((f: any) => {
        if (!mounted) return
        const mappedDirectorId = f.directorId ?? f.director?.id ?? f.director?.userId
        setFilmData({
          id: String(f.filmId),
          title: f.title,
          director: f.director?.username
            ? f.director.username
            : (f.directorName ? f.directorName : (f.directorId ? `감독 #${f.directorId}` : '감독 미상')),
          directorId: mappedDirectorId ? String(mappedDirectorId) : undefined,
          genre: f.genre || '전체',
          status: 'approved',
          image: resolveImageUrl(f.imageUrl) || '/placeholder.svg',
          rating: f.averageRating || 0,
          votes: f.voteCount || 0,
          reviews: f.reviewCount || 0,
          likes: f.voteCount || 0,
          dreamTheme: f.summary || '',
          releaseDate: '',
          runtime: '',
          description: f.dreamText || '',
          cinematography: 'Gemini',
          awards: ''
        })
        setLoading(false)
      })
      .catch(() => {
        if (!mounted) return
        setFilmData(null)
        setLoading(false)
      })

    api.getReviewsByFilm(id, { sort: sortType === 'rating' ? 'rating' : 'recent' })
      .then((rs) => {
        if (!mounted) return
        const mapped: Review[] = (rs as any[]).map(r => ({
          id: String(r.reviewId),
          userId: r.userId ? String(r.userId) : undefined,
          author: r.username
            ? r.username
            : `사용자 #${r.userId ?? '익명'}`,
          rating: r.rating ?? 0,
          text: r.comment ?? '',
          date: r.createdAt?.slice(0, 10) ?? '',
          helpful: 0
        }))
        setReviews(mapped)
      })
      .catch(() => {
        if (!mounted) return
        setReviews([])
      })

    return () => { mounted = false }
  }, [id, sortType])

  // 현재 사용자 정보 로드
  useEffect(() => {
    let mounted = true
    api.getMe()
      .then((me: any) => {
        if (!mounted) return
        if (me && (me.id || me.userId || me.username)) {
          setCurrentUser({
            id: me.id ? String(me.id) : (me.userId ? String(me.userId) : undefined),
            username: me.username
          })
        } else {
          setCurrentUser(null)
        }
      })
      .catch(() => {
        if (!mounted) return
        setCurrentUser(null)
      })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (!filmData?.genre || !filmData?.id) {
      setRelatedFilms([])
      return
    }
    let mounted = true
    const targetGenre = (filmData.genre || '').trim().toLowerCase()

    api.getFilms()
      .then((res) => {
        if (!mounted) return
        const mapped = (res as any[])
          .filter((f) => String(f.filmId) !== filmData.id)
          .filter((f) => (f.genre || '').trim().toLowerCase() === targetGenre)
          .sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime()
            const dateB = new Date(b.createdAt || 0).getTime()
            return dateB - dateA
          })
          .slice(0, 5)
          .map((f) => ({
            id: String(f.filmId),
            title: f.title,
            director: f.director?.username
              ? f.director.username
              : (f.directorName ? f.directorName : (f.directorId ? `감독 #${f.directorId}` : '감독 미상')),
            image: resolveImageUrl(f.imageUrl) || '/placeholder.svg',
            rating: typeof f.averageRating === 'number'
              ? Math.round(f.averageRating * 10) / 10
              : 0,
            likes: f.voteCount ?? 0,
            reviews: f.reviewCount ?? 0,
          }))
        setRelatedFilms(mapped)
      })
      .catch(() => {
        if (!mounted) return
        setRelatedFilms([])
      })

    return () => { mounted = false }
  }, [filmData])

  const sortedReviews = reviews

  const myReview = useMemo(() => {
    if (!currentUser) return null
    return reviews.find((r) =>
      (currentUser.id && r.userId === String(currentUser.id)) ||
      (currentUser.username && r.author === currentUser.username)
    ) || null
  }, [reviews, currentUser])

  const toggleLike = () => {
    if (!filmData || loadingVotes) return
    const filmId = filmData.id

    // 이미 투표했다면 취소 처리
    if (isLiked) {
      // optimistic 제거
      setIsLiked(false)
      setVotedFilms(prev => {
        const updated = new Set(prev)
        updated.delete(filmId)
        setRemainingVotes(Math.max(0, VOTE_LIMIT - updated.size))
        return updated
      })
      setFilmData(prev => prev ? { ...prev, likes: Math.max((prev.likes || 0) - 1, 0) } : prev)

      api.deleteVote(filmId).catch((err: Error) => {
        // rollback
        setIsLiked(true)
        setVotedFilms(prev => {
          const updated = new Set(prev)
          updated.add(filmId)
          setRemainingVotes(Math.max(0, VOTE_LIMIT - updated.size))
          return updated
        })
        setFilmData(prev => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : prev)
        show({ message: err.message || '투표를 취소하지 못했습니다.', kind: 'error' })
      })
      return
    }

    // 신규 투표
    if (votedFilms.size >= VOTE_LIMIT) {
      show({ message: `최대 ${VOTE_LIMIT}개 작품까지만 투표할 수 있습니다.`, kind: 'error' })
      return
    }

    // optimistic 추가
    setIsLiked(true)
    setVotedFilms(prev => {
      const updated = new Set(prev)
      updated.add(filmId)
      setRemainingVotes(Math.max(0, VOTE_LIMIT - updated.size))
      return updated
    })
    setFilmData(prev => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : prev)

    api.postVote(filmId).catch((err: Error) => {
      // rollback
      setIsLiked(false)
      setVotedFilms(prev => {
        const updated = new Set(prev)
        updated.delete(filmId)
        setRemainingVotes(Math.max(0, VOTE_LIMIT - updated.size))
        return updated
      })
      setFilmData(prev => prev ? { ...prev, likes: Math.max((prev.likes || 0) - 1, 0) } : prev)
      show({ message: err.message || '투표에 실패했습니다.', kind: 'error' })
    })
  }

  const handleSubmitReview = () => {
    if (newRating === 0) {
      show({ message: '평점을 선택해주세요!', kind: 'error' })
      return
    }

    if (!filmData) {
      show({ message: '영화 정보를 불러오지 못했습니다.', kind: 'error' })
      return
    }

    const hasReviewText = newReviewText.trim().length > 0
    if (submittingReview) return
    setSubmittingReview(true)

    api.postReview({ filmId: filmData.id, rating: newRating, comment: hasReviewText ? newReviewText : '' })
      .then((res: any) => {
        const createdAt = res?.createdAt ?? (myReview ? myReview.date : new Date().toISOString())
        const reviewId = myReview?.id ?? res?.reviewId ?? Date.now()
        const author = currentUser?.username
          ?? res?.username
          ?? `사용자 #${res?.userId ?? '익명'}`
        const userId = currentUser?.id ?? (res?.userId ? String(res.userId) : undefined)

        const newReview: Review = {
          id: String(reviewId),
          userId,
          author,
          rating: newRating,
          text: hasReviewText ? newReviewText : '',
          date: String(createdAt).slice(0, 10),
          helpful: myReview?.helpful ?? 0
        }

        setReviews(prev => {
          if (myReview) {
            return prev.map(r => r.id === myReview.id ? newReview : r)
          }
          return [newReview, ...prev]
        })

        setFilmData(prev => {
          if (!prev) return prev
          const currentVotes = prev.votes || 0
          const currentTotal = prev.rating * currentVotes
          const previousRating = myReview?.rating ?? 0
          const votesAfter = myReview ? currentVotes : currentVotes + 1
          const totalAfter = myReview
            ? currentTotal - previousRating + newRating
            : currentTotal + newRating
          const newAverageRating = votesAfter > 0 ? parseFloat((totalAfter / votesAfter).toFixed(1)) : 0

          const prevHadText = (myReview?.text?.trim()?.length ?? 0) > 0
          const reviewDelta = myReview
            ? (hasReviewText ? 1 : 0) - (prevHadText ? 1 : 0)
            : (hasReviewText ? 1 : 0)

          return {
            ...prev,
            rating: newAverageRating,
            votes: votesAfter,
            reviews: Math.max(0, (prev.reviews || 0) + reviewDelta)
          }
        })

        show({ message: myReview ? '리뷰가 수정되었습니다.' : '리뷰가 등록되었습니다.', kind: 'success' })
        setNewRating(0)
        setNewReviewText('')
        setHoveredRating(0)
        setIsWriteDialogOpen(false)
      })
      .catch((err: Error) => {
        show({ message: err.message || '리뷰 등록에 실패했습니다.', kind: 'error' })
      })
      .finally(() => {
        setSubmittingReview(false)
      })
  }

  const handleCancelReview = () => {
    setIsWriteDialogOpen(false)
    setNewRating(0)
    setNewReviewText('')
    setHoveredRating(0)
  }

  const prepareReviewModal = () => {
    if (myReview) {
      setNewRating(myReview.rating)
      setNewReviewText(myReview.text)
    } else {
      setNewRating(0)
      setNewReviewText('')
    }
    setHoveredRating(0)
    setIsWriteDialogOpen(true)
  }

  if (!filmData && loading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <section className="relative h-96 overflow-hidden">
          <div className="absolute inset-0 bg-muted animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </section>
        <section className="py-12 px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="p-6 bg-card border-border">
                <div className="h-6 w-32 bg-muted animate-pulse rounded mb-4" />
                <div className="space-y-3">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                </div>
              </Card>
              <Card className="p-6 bg-card border-border">
                <div className="h-6 w-24 bg-muted animate-pulse rounded mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded w-4/5" />
                </div>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="p-6 bg-card border-border">
                <div className="w-16 h-16 rounded-full bg-muted animate-pulse mx-auto mb-3" />
                <div className="h-4 w-24 bg-muted animate-pulse mx-auto mb-2" />
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
              </Card>
              <Card className="p-6 bg-card border-border">
                <div className="h-4 w-20 bg-muted animate-pulse mb-3" />
                <div className="h-12 w-full bg-muted animate-pulse rounded" />
              </Card>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  if (!filmData) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <section className="min-h-[60vh] flex items-center justify-center px-4">
          <p className="text-muted-foreground">
            {loading ? '영화 정보를 불러오는 중입니다...' : '영화 정보를 불러올 수 없습니다.'}
          </p>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Film Image */}
      <section className="relative h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${filmData?.image || '/placeholder.svg'})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col justify-end p-6 md:p-8 lg:p-12">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-2 text-balance break-words leading-tight">
              {filmData?.title || '영화 정보를 불러올 수 없습니다'}
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
                <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                  {filmData.dreamTheme}
                </p>
              </Card>

              {/* Full Description */}
              <Card className="p-6 bg-card border-border">
                <h2 className="text-2xl font-bold text-foreground mb-3">시나리오</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
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
                      onPrepareOpen={prepareReviewModal}
                      mode={myReview ? 'edit' : 'create'}
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
                      onSortChange={setSortType}
                    />
                  </div>
                </div>

                {sortedReviews.length === 0 ? (
                  <Card className="p-6 bg-card border-dashed border-border text-center gap-1">
                    <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                      <MessageSquarePlus className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">아직 등록된 리뷰가 없어요</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      첫 리뷰어가 되어 의견을 남겨주세요.
                    </p>
                    <div className="flex justify-center">
                      <Button onClick={() => setIsWriteDialogOpen(true)} className="px-5">
                        첫 리뷰 남기기
                      </Button>
                    </div>
                  </Card>
                ) : (
                  sortedReviews.slice(0, 3).map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              <Card className="p-6 bg-card border-border">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-bold text-foreground mb-4">{filmData.director}</h4>
                  <Link href={`/director/${filmData.directorId ?? encodeURIComponent(filmData.director)}`}>
                    <Button variant="outline" className="w-full border-border">
                      프로필 보기
                    </Button>
                  </Link>
                </div>
              </Card>
              {/* Like Button Card */}
              <Card className="p-6 bg-card border-border">
                <div className="mb-3 text-center">
                  <Badge variant="outline" className="bg-pink-500/10 text-pink-500 border-pink-500/30 text-xs">
                    남은 투표: {remainingVotes}/{VOTE_LIMIT}
                  </Badge>
                </div>
                <Button
                  onClick={toggleLike}
                  className={`w-full h-14 text-lg font-semibold transition ${
                    isLiked
                      ? 'bg-pink-500 hover:bg-pink-600 text-white'
                      : 'bg-card hover:bg-muted border-2 border-border hover:border-pink-500 text-foreground'
                  }`}
                >
                  <Heart
                    className={`w-6 h-6 mr-2 transition ${
                      isLiked ? 'fill-white text-white' : 'text-foreground'
                    }`}
                  />
                  {isLiked ? '투표 완료!' : '투표하기'}
                </Button>
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
