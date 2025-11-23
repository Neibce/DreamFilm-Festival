'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { useState } from 'react'
import { Heart, Star, MessageCircle, Download, Share2, Award, Users, Clock, Film } from 'lucide-react'
import Link from 'next/link'

interface Review {
  id: string
  author: string
  rating: number
  text: string
  date: string
  helpful: number
}

interface Film {
  id: string
  title: string
  director: string
  genre: string
  status: 'approved' | 'pending' | 'rejected'
  image: string
  rating: number
  votes: number
  reviews: number
  dreamConcept: string
  releaseDate?: string
  runtime?: string
  description?: string
  screenplay?: string
  cinematography?: string
  awards?: string
}

const MOCK_FILM: Film = {
  id: '1',
  title: 'The Midnight Garden',
  director: 'Sarah Chen',
  genre: 'Fantasy Drama',
  status: 'approved',
  image: '/fantasy-film-poster.jpg',
  rating: 4.8,
  votes: 1240,
  reviews: 89,
  dreamConcept: 'A surreal garden that exists between dreams and reality',
  releaseDate: '2024-06-15',
  runtime: '118 minutes',
  description: 'In the depths of a troubled mind lies a garden that blooms only at midnight. Follow Maya, a young artist struggling with reality, as she discovers a portal to a world where her paintings come to life. What begins as an escape becomes a journey of self-discovery and healing.',
  screenplay: 'Sarah Chen',
  cinematography: 'James Wilson',
  awards: 'Festival Award for Outstanding Vision'
}

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Alex Thompson',
    rating: 5,
    text: 'Absolutely breathtaking! The way the dream sequences transition into reality is seamless. A masterpiece of modern filmmaking.',
    date: '2024-06-20',
    helpful: 234
  },
  {
    id: '2',
    author: 'Emma Wilson',
    rating: 5,
    text: 'The cinematography is stunning. Every frame feels like a painting. I was completely immersed in this world.',
    date: '2024-06-18',
    helpful: 189
  },
  {
    id: '3',
    author: 'Marcus Johnson',
    rating: 4,
    text: 'Great storytelling with minor pacing issues in the second act. Overall a very emotional and impactful experience.',
    date: '2024-06-16',
    helpful: 127
  },
]

const RELATED_FILMS = [
  {
    id: '2',
    title: 'Echoes in the Cloud',
    director: 'James Rivera',
    image: '/sci-fi-movie-poster.png',
    rating: 4.6,
  },
  {
    id: '3',
    title: 'The Lost Kingdom',
    director: 'Emma Thompson',
    image: '/adventure-fantasy-film.jpg',
    rating: 4.7,
  },
  {
    id: '4',
    title: 'Neon Requiem',
    director: 'Alex Kim',
    image: '/cyberpunk-movie-poster.png',
    rating: 4.5,
  },
]

export default function FilmDetailPage({ params }: { params: { id: string } }) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [helpful, setHelpful] = useState<Record<string, boolean>>({})

  const toggleHelpful = (reviewId: string) => {
    setHelpful(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }))
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Film Image */}
      <section className="relative h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${MOCK_FILM.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col justify-end p-6 md:p-8 lg:p-12">
          <div className="max-w-4xl">
            <Badge className="mb-3 bg-green-500/20 text-green-400 w-fit">Approved</Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-2 text-balance">
              {MOCK_FILM.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-4">Directed by {MOCK_FILM.director}</p>
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
              <div className="grid grid-cols-4 gap-4">
                <Card className="p-4 bg-card border-border text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold text-foreground">{MOCK_FILM.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{MOCK_FILM.votes} votes</p>
                </Card>
                <Card className="p-4 bg-card border-border text-center">
                  <MessageCircle className="w-5 h-5 mx-auto mb-2 text-accent" />
                  <p className="text-2xl font-bold text-foreground">{MOCK_FILM.reviews}</p>
                  <p className="text-xs text-muted-foreground">Reviews</p>
                </Card>
                <Card className="p-4 bg-card border-border text-center">
                  <Clock className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <p className="text-lg font-bold text-foreground">{MOCK_FILM.runtime}</p>
                </Card>
                <Card className="p-4 bg-card border-border text-center">
                  <Award className="w-5 h-5 mx-auto mb-2 text-purple-400" />
                  <p className="text-xs font-bold text-foreground">Award</p>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => setIsFavorited(!isFavorited)}
                  variant={isFavorited ? "default" : "outline"}
                  className={`gap-2 ${isFavorited ? 'bg-red-500 hover:bg-red-600' : 'border-border'}`}
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-white' : ''}`} />
                  {isFavorited ? 'Favorited' : 'Favorite'}
                </Button>
                <Button variant="outline" className="gap-2 border-border">
                  <Share2 className="w-5 h-5" />
                  Share
                </Button>
              </div>

              {/* Dream Concept */}
              <Card className="p-6 bg-card border-border">
                <h2 className="text-2xl font-bold text-foreground mb-3">Dream Concept</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {MOCK_FILM.dreamConcept}
                </p>
              </Card>

              {/* Full Description */}
              <Card className="p-6 bg-card border-border">
                <h2 className="text-2xl font-bold text-foreground mb-3">Synopsis</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {MOCK_FILM.description}
                </p>
              </Card>

              {/* Crew & Production */}
              <Card className="p-6 bg-card border-border">
                <h2 className="text-2xl font-bold text-foreground mb-4">Production</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Director</p>
                    <p className="text-lg text-foreground font-medium">{MOCK_FILM.director}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Screenplay</p>
                    <p className="text-lg text-foreground font-medium">{MOCK_FILM.screenplay}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Cinematography</p>
                    <p className="text-lg text-foreground font-medium">{MOCK_FILM.cinematography}</p>
                  </div>
                </div>
              </Card>

              {/* Reviews Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Reviews ({MOCK_FILM.reviews})</h2>

                {MOCK_REVIEWS.map((review) => (
                  <Card key={review.id} className="p-6 bg-card border-border">
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
                        onClick={() => toggleHelpful(review.id)}
                        className={`text-sm px-3 py-1 rounded transition ${
                          helpful[review.id]
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-border'
                        }`}
                      >
                        👍 Helpful ({review.helpful + (helpful[review.id] ? 1 : 0)})
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Film Info Card */}
              <Card className="p-6 bg-card border-border sticky top-24">
                <h3 className="font-bold text-foreground mb-4">Film Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Genre</p>
                    <Badge variant="outline" className="border-border">{MOCK_FILM.genre}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Runtime</p>
                    <p className="text-foreground">{MOCK_FILM.runtime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Release Date</p>
                    <p className="text-foreground">{MOCK_FILM.releaseDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Festival Award</p>
                    <p className="text-foreground text-sm">{MOCK_FILM.awards}</p>
                  </div>
                </div>
              </Card>

              {/* Director Info Card */}
              <Card className="p-6 bg-card border-border">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-3 flex items-center justify-center">
                    <Film className="w-8 h-8 text-foreground" />
                  </div>
                  <h4 className="font-bold text-foreground mb-1">{MOCK_FILM.director}</h4>
                  <p className="text-sm text-muted-foreground mb-4">Visionary Director</p>
                  <Button variant="outline" className="w-full border-border">
                    View Profile
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Related Films Section */}
          <section className="mt-16 pt-12 border-t border-border">
            <h2 className="text-3xl font-bold text-foreground mb-6">Related Films</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {RELATED_FILMS.map((film) => (
                <Link key={film.id} href={`/films/${film.id}`}>
                  <Card className="group overflow-hidden hover:border-primary transition cursor-pointer bg-card border-border h-full">
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <img
                        src={film.image || "/placeholder.svg"}
                        alt={film.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-foreground group-hover:text-primary transition line-clamp-2">
                        {film.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{film.director}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex">
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
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  )
}
