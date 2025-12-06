'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState, useMemo, useEffect } from 'react'
import { User, Film as FilmIcon, Star, MessageCircle, Heart, Clock, XCircle } from 'lucide-react'
import { api, resolveImageUrl } from '@/lib/api'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Film {
  id: string
  directorId: string | null
  directorName: string
  title: string
  genre: string
  status: string
  isApproved: boolean
  image: string
  rating: number
  votes: number
  reviews: number
  likes: number
  dreamSummary: string
}

export default function DirectorProfilePage() {
  const routeParams = useParams<{ id: string }>()
  const directorId = routeParams?.id ? decodeURIComponent(routeParams.id) : ''
  const [films, setFilms] = useState<Film[]>([])
  const [directorName, setDirectorName] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<{ id?: string; username?: string } | null>(null)

  useEffect(() => {
    if (!directorId) return
    let mounted = true
    setLoading(true)
    api.getFilmsByDirector(directorId)
      .then((res) => {
        if (!mounted) return
        const mapped: Film[] = (res as any[]).map((f) => ({
          id: String(f.filmId),
          directorId: f.directorId
            ? String(f.directorId)
            : (f.director?.id || f.director?.userId ? String(f.director.id ?? f.director.userId) : null),
          directorName: f.director?.username
            ? f.director.username
            : (f.directorName ? f.directorName : ''),
          title: f.title,
          genre: f.genre || '전체',
          status: typeof f.status === 'string' ? f.status : '',
          isApproved: String(f.status || '').toUpperCase() === 'SUBMITTED',
          image: resolveImageUrl(f.imageUrl) || '/placeholder.svg',
          rating: typeof f.averageRating === 'number' ? f.averageRating : 0,
          votes: typeof f.voteCount === 'number' ? f.voteCount : 0,
          reviews: f.reviewCount ?? 0,
          likes: typeof f.voteCount === 'number' ? f.voteCount : 0,
          dreamSummary: f.summary || '소개가 없습니다.'
        }))
        setFilms(mapped)
        const targetDirector = mapped.find(film => film.directorId === directorId)
        setDirectorName(targetDirector?.directorName ?? '')
      })
      .catch(() => {
        if (!mounted) return
        setFilms([])
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [directorId])

  // 현재 로그인한 사용자 정보
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

  const directorFilms = useMemo(() => {
    return films.filter(film =>
      film.directorId === directorId && film.isApproved
    )
  }, [films, directorId])

  const pendingFilms = useMemo(() => {
    return films.filter(film => {
      if (film.directorId !== directorId) return false
      const status = String(film.status || '').toUpperCase()
      return !film.isApproved && status !== 'REJECTED'
    })
  }, [films, directorId])

  const rejectedFilms = useMemo(() => {
    return films.filter(film => {
      if (film.directorId !== directorId) return false
      const status = String(film.status || '').toUpperCase()
      return status === 'REJECTED'
    })
  }, [films, directorId])

  const displayDirectorName = directorName || (directorFilms[0]?.directorName ?? '')
  const isDirectorNameLoading = loading && !displayDirectorName
  const isOwnProfile = useMemo(() => {
    if (!currentUser?.id) return false
    return currentUser.id === directorId
  }, [currentUser, directorId])

  const ratedFilms = directorFilms.filter(film => film.reviews > 0)
  const stats = {
    totalFilms: directorFilms.length,
    totalReviews: directorFilms.reduce((sum, film) => sum + film.reviews, 0),
    averageRating: ratedFilms.length > 0
      ? (ratedFilms.reduce((sum, film) => sum + film.rating, 0) / ratedFilms.length).toFixed(1)
      : 0
  }

  const renderFilmGrid = (
    list: Film[],
    badge: { text: string; className: string }
  ) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {list.map((film) => (
        <Link key={film.id} href={`/films/${film.id}`}>
          <Card className="pt-0 pb-2 group overflow-hidden hover:border-primary transition cursor-pointer bg-card border-border h-full hover:shadow-lg hover:shadow-primary/50 hover:ring-2 hover:ring-primary/20">
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
                <Badge className={badge.className}>
                  {badge.text}
                </Badge>
              </div>
            </div>

            {/* Film Info */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-foreground group-hover:text-primary transition break-words whitespace-normal leading-tight text-balance">
                  {film.title}
                </h3>
                <p className="text-sm text-muted-foreground">{film.genre}</p>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2">{film.dreamSummary}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 justify-between">
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
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )

  if (!directorId) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">감독 정보를 불러올 수 없습니다.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-15 pb-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Director Header */}
          <div className="mb-12">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-12 h-12 text-primary" />
              </div>
              <div>
                {displayDirectorName ? (
                  <h1 className="font-clipartkorea text-3xl md:text-[43px] font-extrabold text-foreground mb-2">
                    {displayDirectorName}
                  </h1>
                ) : isDirectorNameLoading ? (
                  <div className="h-10 w-48 bg-muted animate-pulse rounded-md mb-2" aria-label="감독 정보 로딩 중" />
                ) : null}
                <p className="text-lg text-muted-foreground">
                  감독 프로필
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">총 작품 수</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalFilms}</p>
                </div>
                <FilmIcon className="w-8 h-8 text-primary" />
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">평균 평점</p>
                  <p className="text-3xl font-bold text-foreground">{stats.averageRating}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">총 리뷰 수</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalReviews}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-blue-400" />
              </div>
            </Card>
          </div>

          {/* Films Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">승인된 작품 ({stats.totalFilms})</h2>

            {loading ? (
              <Card className="p-12 bg-card border-border text-center">
                <FilmIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground animate-pulse" />
                <p className="text-lg text-muted-foreground">로딩 중...</p>
              </Card>
            ) : directorFilms.length === 0 ? (
              <Card className="p-12 bg-card border-border text-center">
                <FilmIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">
                  아직 승인된 작품이 없습니다.
                </p>
              </Card>
            ) : (
              renderFilmGrid(directorFilms, { text: '승인 완료', className: 'bg-green-500/20 text-green-400' })
            )}
          </div>

          {isOwnProfile && (
            <div className="space-y-10 mt-10">
              {/* Pending Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">심사 대기 작품 ({pendingFilms.length})</h2>
                {loading ? (
                  <Card className="p-12 bg-card border-border text-center">
                    <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground animate-pulse" />
                    <p className="text-lg text-muted-foreground">로딩 중...</p>
                  </Card>
                ) : pendingFilms.length === 0 ? (
                  <Card className="p-12 bg-card border-border text-center">
                    <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg text-muted-foreground">
                      심사 대기 중인 작품이 없습니다.
                    </p>
                  </Card>
                ) : (
                  renderFilmGrid(pendingFilms, { text: '심사 대기', className: 'bg-yellow-500/20 text-yellow-400' })
                )}
              </div>

              {/* Rejected Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">반려된 작품 ({rejectedFilms.length})</h2>
                {loading ? (
                  <Card className="p-12 bg-card border-border text-center">
                    <XCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground animate-pulse" />
                    <p className="text-lg text-muted-foreground">로딩 중...</p>
                  </Card>
                ) : rejectedFilms.length === 0 ? (
                  <Card className="p-12 bg-card border-border text-center">
                    <XCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg text-muted-foreground">
                      반려된 작품이 없습니다.
                    </p>
                  </Card>
                ) : (
                  renderFilmGrid(rejectedFilms, { text: '반려됨', className: 'bg-red-500/20 text-red-400' })
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

