'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Heart, Star, MessageCircle, Filter } from 'lucide-react'
import Link from 'next/link'

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
  dreamSummary: string
}

export const MOCK_FILMS: Film[] = [
  {
    id: '1',
    title: 'The Midnight Garden',
    director: 'Sarah Chen',
    genre: '판타지',
    status: '승인 완료',
    image: '/fantasy-film-poster.jpg',
    rating: 4.8,
    votes: 1240,
    reviews: 89,
    dreamSummary: 'A surreal garden that exists between dreams and reality'
  },
  {
    id: '2',
    title: 'Echoes in the Cloud',
    director: 'James Rivera',
    genre: 'SF',
    status: '승인 완료',
    image: '/sci-fi-movie-poster.png',
    rating: 4.6,
    votes: 956,
    reviews: 72,
    dreamSummary: 'Two souls communicating through digital dreams'
  },
  {
    id: '3',
    title: 'The Lost Kingdom',
    director: 'Emma Thompson',
    genre: 'Adventure Fantasy',
    status: '승인 완료',
    image: '/adventure-fantasy-film.jpg',
    rating: 4.7,
    votes: 1120,
    reviews: 95,
    dreamSummary: 'An ancient civilization revealed through ancestral memories'
  },
  {
    id: '4',
    title: 'Neon Requiem',
    director: 'Alex Kim',
    genre: '공포/스릴러',
    status: '승인 완료',
    image: '/cyberpunk-movie-poster.png',
    rating: 4.5,
    votes: 834,
    reviews: 61,
    dreamSummary: 'A noir detective story in a digital dreamscape'
  },
  {
    id: '5',
    title: 'Whispers of Tomorrow',
    director: 'Sophie Laurent',
    genre: '드라마',
    status: '승인 완료',
    image: '/drama-film-poster.jpg',
    rating: 0,
    votes: 0,
    reviews: 0,
    dreamSummary: 'A poetic journey through possible futures'
  },
]

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<string>('전체')
  const [favorited, setFavorited] = useState<Set<string>>(new Set())

  const genres = ['전체', '판타지', 'SF', '로맨스', '어드벤처', '드라마', '공포/스릴러']

  const filteredFilms = MOCK_FILMS.filter(film => {
    const matchesSearch = film.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      film.director.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = selectedGenre === '전체' || film.genre === selectedGenre
    return matchesSearch && matchesGenre
  })

  const toggleFavorite = (filmId: string) => {
    const newFavorited = new Set(favorited)
    if (newFavorited.has(filmId)) {
      newFavorited.delete(filmId)
    } else {
      newFavorited.add(filmId)
    }
    setFavorited(newFavorited)
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
          <p className="text-lg text-muted-foreground mb-8 text-balance">
          실제 꿈에서 탄생한 독창적인 작품들을 감상하고, 평가하여 영화제 수상작 선정에 기여해보세요.
          </p>

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
            </div>
          </div>
        </div>
      </section>

      {/* Films Grid */}
      <section className="py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredFilms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No films found. Try adjusting your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFilms.map((film) => (
                <Link key={film.id} href={`/films/${film.id}`}>
                  <Card
                    className="group overflow-hidden hover:border-primary transition cursor-pointer bg-card border-border h-full hover:shadow-lg hover:shadow-primary/50 hover:ring-2 hover:ring-primary/20"
                  >
                    {/* Film Image */}
                    <div className="relative h-64 overflow-hidden bg-muted">
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

                      {/* Like Button */}
                      <button
                        onClick={() => toggleFavorite(film.id)}
                        className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition"
                      >
                        <div className={`p-2 rounded-full ${
                          favorited.has(film.id) ? 'bg-red-500' : 'bg-background/80'
                        } hover:bg-red-500 transition`}>
                          <Heart className={`w-5 h-5 ${favorited.has(film.id) ? 'fill-white' : 'text-foreground'}`} />
                        </div>
                      </button>
                    </div>

                    {/* Film Info */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold text-foreground group-hover:text-primary transition line-clamp-2">
                          {film.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{film.director}</p>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2">{film.dreamSummary}</p>

                      {/* Rating */}
                      {film.status === '승인 완료' && (
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
                          <span className="text-xs text-muted-foreground">({film.votes})</span>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex gap-3 text-xs text-muted-foreground pt-2 border-t border-border">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5" />
                          {favorited.has(film.id) ? '1+' : '0'}
                        </div>
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
      </section>

      <Footer />
    </main>
  )
}
