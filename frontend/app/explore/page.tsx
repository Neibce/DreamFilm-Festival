'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { api, resolveImageUrl } from '@/lib/api'
import { Heart, Star, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useToastStore } from '@/store/toast'
import { useAuthStore } from '@/store/auth'

interface Film {
  id: string
  title: string
  director: string
  genre: string
  status: '승인 완료'
  image: string
  rating: number
  votes: number
  reviews: number
  likes: number
  dreamSummary: string
}

export default function ExplorePage() {
  const VOTE_LIMIT = 3
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<string>('전체')
  const [minRating, setMinRating] = useState<number>(0)
  const [topRatedFilmIds, setTopRatedFilmIds] = useState<Set<number>>(new Set())
  const [favorited, setFavorited] = useState<Set<string>>(new Set())
  const [remainingVotes, setRemainingVotes] = useState(VOTE_LIMIT)
  const [loadingVotes, setLoadingVotes] = useState(true)
  const [films, setFilms] = useState<Film[]>([])
  const [loading, setLoading] = useState(true)
  const { show } = useToastStore()
  const { user, fetchMeOnce } = useAuthStore()

  useEffect(() => {
    fetchMeOnce()
  }, [fetchMeOnce])

  const isAudience = (user?.role || '').toUpperCase() === 'AUDIENCE'

  // 서버 기준 내 투표 목록 불러오기
  useEffect(() => {
    let mounted = true
    setLoadingVotes(true)
    api.getMyVotes()
      .then((votes) => {
        if (!mounted) return
        const voteList = Array.isArray(votes) ? votes : []
        const voteIds = new Set<string>(voteList.map((v: any) => String(v.filmId)))
        setFavorited(voteIds)
        setRemainingVotes(Math.max(0, VOTE_LIMIT - voteIds.size))
      })
      .catch(() => {
        if (!mounted) return
        setFavorited(new Set())
        setRemainingVotes(VOTE_LIMIT)
      })
      .finally(() => {
        if (mounted) setLoadingVotes(false)
      })
    return () => { mounted = false }
  }, [])

  // GROUP BY + HAVING - 평점 필터 적용 시 해당 영화 ID 목록 조회
  useEffect(() => {
    if (minRating > 0) {
      api.getTopRatedFilms(minRating)
        .then((res) => {
          setTopRatedFilmIds(new Set(res.map(r => r.filmId)))
        })
        .catch(() => setTopRatedFilmIds(new Set()))
    } else {
      setTopRatedFilmIds(new Set())
    }
  }, [minRating])

  // LEFT JOIN API 호출 (영화 + 감독 정보)
  useEffect(() => {
    api.getFilmsWithDirector().catch(() => {})
  }, [])

  // Fetch films from backend (진행 중 영화제만)
  useEffect(() => {
    let mounted = true
    setLoading(true)

    const search = searchTerm.trim()
    const genre = selectedGenre === '전체' ? undefined : selectedGenre

    api
      .getOngoingFilms({
        search: search.length > 0 ? search : undefined,
        genre,
      })
      .then((res) => {
        if (!mounted) return
        let mapped: Film[] = (res as any[]).map((f) => ({
          id: String(f.filmId),
          title: f.title,
          director: f.director?.username
            ? f.director.username
            : (f.directorId ? `감독 #${f.directorId}` : '감독 미상'),
          cinematography: 'Gemini',
          genre: f.genre || '전체',
          status: '승인 완료',
          image: resolveImageUrl(f.imageUrl) || '/placeholder.svg',
          rating: f.averageRating ?? 0,
          votes: f.reviewCount ?? 0,
          reviews: f.reviewCount ?? 0,
          likes: f.voteCount ?? 0,
          dreamSummary: f.summary || '소개가 없습니다.',
        }))
        // 평점 필터 적용 (GROUP BY + HAVING 결과 활용)
        if (minRating > 0 && topRatedFilmIds.size > 0) {
          mapped = mapped.filter(f => topRatedFilmIds.has(Number(f.id)))
        } else if (minRating > 0 && topRatedFilmIds.size === 0) {
          mapped = []
        }
        setFilms(mapped)
        setLoading(false)
      })
      .catch(() => {
        if (!mounted) return
        setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [searchTerm, selectedGenre, minRating, topRatedFilmIds])

  const genres = ['전체', '판타지', 'SF', '로맨스', '어드벤처', '드라마', '공포/스릴러']
  const ratingOptions = [
    { label: '전체', value: 0 },
    { label: '4.5점 이상', value: 4.5 },
    { label: '4점 이상', value: 4 },
    { label: '3점 이상', value: 3 },
  ]

  const toggleFavorite = (filmId: string) => {
    if (loadingVotes) return

    if (favorited.has(filmId)) {
      // optimistic remove
      setFavorited(prev => {
        const updated = new Set(prev)
        updated.delete(filmId)
        setRemainingVotes(Math.max(0, VOTE_LIMIT - updated.size))
        return updated
      })
      setFilms(prev => prev.map(f => f.id === filmId ? { ...f, likes: Math.max((f.likes || 0) - 1, 0) } : f))

      api.deleteVote(filmId).catch(() => {
        // rollback
        setFavorited(prev => {
          const updated = new Set(prev)
          updated.add(filmId)
          setRemainingVotes(Math.max(0, VOTE_LIMIT - updated.size))
          return updated
        })
        setFilms(prev => prev.map(f => f.id === filmId ? { ...f, likes: (f.likes || 0) + 1 } : f))
        show({ message: '투표를 취소하지 못했습니다.', kind: 'error' })
      })
      return
    }

    if (favorited.size >= VOTE_LIMIT) {
      show({ message: `최대 ${VOTE_LIMIT}개 작품까지만 투표할 수 있습니다.`, kind: 'error' })
      return
    }

    // optimistic add
    setFavorited(prev => {
      const updated = new Set(prev)
      updated.add(filmId)
      setRemainingVotes(Math.max(0, VOTE_LIMIT - updated.size))
      return updated
    })
    setFilms(prev => prev.map(f => f.id === filmId ? { ...f, likes: (f.likes || 0) + 1 } : f))

    api.postVote(filmId).catch(() => {
      // rollback
      setFavorited(prev => {
        const updated = new Set(prev)
        updated.delete(filmId)
        setRemainingVotes(Math.max(0, VOTE_LIMIT - updated.size))
        return updated
      })
      setFilms(prev => prev.map(f => f.id === filmId ? { ...f, likes: Math.max((f.likes || 0) - 1, 0) } : f))
      show({ message: '투표에 실패했습니다.', kind: 'error' })
    })
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-15 pb-12 px-4 md:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-clipartkorea text-3xl md:text-[43px] font-extrabold text-foreground mb-4 text-balance">
            새롭게 창조된 영화들을 만나보세요
          </h1>
          <p className="text-lg text-muted-foreground mb-2 text-balance">
            실제 꿈에서 탄생한 독창적인 작품들을 감상하고, 평가하여 영화제 수상작 선정에 기여해보세요.
          </p>
          <div className="flex items-center gap-2 mb-8">
            <Badge variant="outline" className="bg-pink-500/10 text-pink-500 border-pink-500/30 mt-3 px-3 py-1">
              <Heart className="w-3.5 h-3.5 mr-1.5" />
              남은 투표: {remainingVotes}/{VOTE_LIMIT}
            </Badge>
          </div>

          {/* Search and Filter */}
          <div className="space-y-4">
            <Input
              placeholder="작품명 또는 감독을 검색하세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card border-border"
            />
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                    selectedGenre === genre
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-foreground hover:bg-border'
                  }`}
                >
                  {genre}
                </button>
              ))}
              <div className="w-px bg-border mx-2" />
              {ratingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMinRating(option.value)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition flex items-center gap-1 ${
                    minRating === option.value
                      ? 'bg-yellow-500 text-black'
                      : 'bg-card text-foreground hover:bg-border'
                  }`}
                >
                  <Star className="w-3.5 h-3.5" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Films Grid */}
      <section className="py-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading && films.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <Card key={idx} className="pt-0 pb-2 bg-card border-border h-full">
                  <div className="relative h-90 bg-muted animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-full bg-muted animate-pulse rounded" />
                  </div>
                </Card>
              ))}
            </div>
          ) : films.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                상영작이 없습니다. 검색어를 조정해보세요.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {films.map((film) => (
                <Link key={film.id} href={`/films/${film.id}`}>
                  <Card
                    className="pt-0 pb-2 group overflow-hidden hover:border-primary transition cursor-pointer bg-card border-border h-full hover:shadow-lg hover:shadow-primary/50 hover:ring-2 hover:ring-primary/20"
                  >
                    {/* Film Image */}
                    <div className="relative overflow-hidden bg-muted aspect-[4/5]">
                      <img
                        src={film.image || "/placeholder.svg"}
                        alt={film.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                    
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <Badge className={`${
                          film.status === '승인 완료' ? 'bg-green-500/20 text-green-400' :
                          film.status === '심사 대기' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {film.status.charAt(0).toUpperCase() + film.status.slice(1)}
                        </Badge>
                      </div>

                      {/* Like Button (관객만 노출) */}
                      {isAudience && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            toggleFavorite(film.id)
                          }}
                          className="absolute top-3 left-3 p-2 rounded-full bg-background/80 hover:bg-background transition backdrop-blur-sm"
                        >
                          <Heart
                            className={`w-5 h-5 transition ${
                              favorited.has(film.id)
                                ? 'fill-pink-500 text-pink-500'
                                : 'text-foreground'
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Film Info */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold text-foreground group-hover:text-primary transition break-words whitespace-normal leading-tight text-balance">
                          {film.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{film.director}</p>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 h-8">{film.dreamSummary}</p>

                      {/* Rating */}
                      {film.status === '승인 완료' && (
                        <div className="flex items-center gap-2 justify-between items-end">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < Math.floor(film.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-muted'
                                }`}
                              />
                            ))}
                            <span className="text-sm text-foreground font-medium">{film.rating}</span>
                            <span className="text-xs text-muted-foreground">({film.votes})</span>
                          </div>
                          <div className="flex gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Heart className="w-3.5 h-3.5" />
                              {film.likes}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-3.5 h-3.5" />
                              {film.reviews}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
