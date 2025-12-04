'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState, useMemo, use } from 'react'
import { User, Film as FilmIcon, Star, MessageCircle } from 'lucide-react'
import { MOCK_FILMS } from '@/app/explore/page'
import Link from 'next/link'

interface Film {
  id: string
  title: string
  director: string
  genre: string
  status: string
  image: string
  rating: number
  votes: number
  reviews: number
  dreamSummary: string
}

export default function DirectorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const directorName = decodeURIComponent(id)
  
  const directorFilms = useMemo(() => {
    return MOCK_FILMS.filter(film => 
      film.director === directorName && film.status === '승인 완료'
    )
  }, [directorName])

  const stats = {
    totalFilms: directorFilms.length,
    totalReviews: directorFilms.reduce((sum, film) => sum + film.reviews, 0),
    averageRating: directorFilms.length > 0 
      ? (directorFilms.reduce((sum, film) => sum + film.rating, 0) / directorFilms.length).toFixed(1)
      : 0
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-15 pb-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Director Header */}
          <div className="mb-12">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <User className="w-12 h-12 text-foreground" />
              </div>
              <div>
                <h1 className="font-clipartkorea text-3xl md:text-[43px] font-extrabold text-foreground mb-2">
                  {directorName}
                </h1>
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

            {directorFilms.length === 0 ? (
              <Card className="p-12 bg-card border-border text-center">
                <FilmIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">
                  아직 승인된 작품이 없습니다.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {directorFilms.map((film) => (
                  <Link key={film.id} href={`/films/${film.id}`}>
                    <Card className="pt-0 pb-2 group overflow-hidden hover:border-primary transition cursor-pointer bg-card border-border h-full hover:shadow-lg hover:shadow-primary/50 hover:ring-2 hover:ring-primary/20">
                      {/* Film Image */}
                      <div className="relative h-80 overflow-hidden bg-muted">
                        <img
                          src={film.image || "/placeholder.svg"}
                          alt={film.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                      
                        {/* Status Badge */}
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-green-500/20 text-green-400">
                            승인 완료
                          </Badge>
                        </div>
                      </div>

                      {/* Film Info */}
                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-bold text-foreground group-hover:text-primary transition line-clamp-2">
                            {film.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{film.genre}</p>
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2">{film.dreamSummary}</p>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
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
                          </div>
                          <span className="text-sm text-foreground font-medium">{film.rating}</span>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-3 text-xs text-muted-foreground pt-2 border-t border-border">
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-3.5 h-3.5" />
                            {film.reviews}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

