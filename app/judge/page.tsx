'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { Star, CheckCircle, XCircle, Clock } from 'lucide-react'

interface JudgingFilm {
  id: string
  title: string
  director: string
  genre: string
  image: string
  dreamConcept: string
  status: 'pending' | 'scored' | 'rejected'
  scores?: {
    creativity: number
    execution: number
    emotional_impact: number
    storytelling: number
  }
}

const MOCK_JUDGING_FILMS: JudgingFilm[] = [
  {
    id: '1',
    title: 'The Midnight Garden',
    director: 'Sarah Chen',
    genre: 'Fantasy Drama',
    image: '/fantasy-film-poster.jpg',
    dreamConcept: 'A surreal garden that exists between dreams and reality',
    status: 'pending'
  },
  {
    id: '2',
    title: 'Echoes in the Cloud',
    director: 'James Rivera',
    genre: 'Sci-Fi Romance',
    image: '/sci-fi-movie-poster.png',
    dreamConcept: 'Two souls communicating through digital dreams',
    status: 'scored',
    scores: { creativity: 5, execution: 4, emotional_impact: 5, storytelling: 4 }
  },
  {
    id: '3',
    title: 'Lost Horizons',
    director: 'Mike Johnson',
    genre: 'Adventure',
    image: '/adventure-film-poster.jpg',
    dreamConcept: 'An explorer finds a portal to another dimension',
    status: 'rejected'
  }
]

interface ScoreLine {
  criterion: string
  icon: string
  score: number
  setScore: (score: number) => void
}

export default function JudgePage() {
  const [films, setFilms] = useState(MOCK_JUDGING_FILMS)
  const [selectedFilmId, setSelectedFilmId] = useState(MOCK_JUDGING_FILMS[0]?.id)
  const [currentScores, setCurrentScores] = useState<Record<string, number>>({
    creativity: 0,
    execution: 0,
    emotional_impact: 0,
    storytelling: 0
  })

  const selectedFilm = films.find(f => f.id === selectedFilmId)

  const handleScoreChange = (criterion: string, score: number) => {
    setCurrentScores(prev => ({ ...prev, [criterion]: score }))
  }

  const handleSubmitScores = () => {
    setFilms(films.map(f => 
      f.id === selectedFilmId 
        ? { ...f, status: 'scored' as const, scores: currentScores }
        : f
    ))
    setCurrentScores({ creativity: 0, execution: 0, emotional_impact: 0, storytelling: 0 })
    const nextPending = films.find(f => f.status === 'pending' && f.id !== selectedFilmId)
    if (nextPending) setSelectedFilmId(nextPending.id)
  }

  const handleReject = () => {
    setFilms(films.map(f => 
      f.id === selectedFilmId 
        ? { ...f, status: 'rejected' as const }
        : f
    ))
    const nextPending = films.find(f => f.status === 'pending' && f.id !== selectedFilmId)
    if (nextPending) setSelectedFilmId(nextPending.id)
  }

  const scoreArray = [
    { criterion: 'Creativity', icon: '✨', score: currentScores.creativity, setSc: (s: number) => handleScoreChange('creativity', s) },
    { criterion: 'Execution', icon: '🎬', score: currentScores.execution, setSc: (s: number) => handleScoreChange('execution', s) },
    { criterion: 'Emotional Impact', icon: '💫', score: currentScores.emotional_impact, setSc: (s: number) => handleScoreChange('emotional_impact', s) },
    { criterion: 'Storytelling', icon: '📖', score: currentScores.storytelling, setSc: (s: number) => handleScoreChange('storytelling', s) }
  ]

  const averageScore = selectedFilm?.scores 
    ? (selectedFilm.scores.creativity + selectedFilm.scores.execution + selectedFilm.scores.emotional_impact + selectedFilm.scores.storytelling) / 4 
    : 0

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Judging Dashboard
            </h1>
            <p className="text-lg text-muted-foreground text-balance">
              Review and score submitted films. Your feedback helps crown the best AI-generated masterpieces.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
                  <p className="text-3xl font-bold text-foreground">{films.filter(f => f.status === 'pending').length}</p>
                </div>
                <Clock className="w-8 h-8 text-muted" />
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Scored</p>
                  <p className="text-3xl font-bold text-foreground">{films.filter(f => f.status === 'scored').length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Rejected</p>
                  <p className="text-3xl font-bold text-foreground">{films.filter(f => f.status === 'rejected').length}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Film List */}
            <div className="lg:col-span-1">
              <h2 className="text-lg font-semibold text-foreground mb-4">Films to Review</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {films.map(film => (
                  <button
                    key={film.id}
                    onClick={() => setSelectedFilmId(film.id)}
                    className={`w-full text-left p-4 rounded-lg transition border ${
                      selectedFilmId === film.id
                        ? 'bg-primary/20 border-primary'
                        : 'bg-card border-border hover:border-primary'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground line-clamp-1">{film.title}</h3>
                      {film.status === 'pending' && <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Pending</Badge>}
                      {film.status === 'scored' && <Badge className="bg-green-500/20 text-green-400 text-xs">Scored</Badge>}
                      {film.status === 'rejected' && <Badge className="bg-red-500/20 text-red-400 text-xs">Rejected</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{film.director}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Film Detail & Scoring */}
            {selectedFilm && (
              <div className="lg:col-span-2 space-y-6">
                {/* Film Card */}
                <Card className="overflow-hidden bg-card border-border">
                  <div className="h-96 overflow-hidden">
                    <img
                      src={selectedFilm.image || "/placeholder.svg"}
                      alt={selectedFilm.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{selectedFilm.title}</h2>
                      <p className="text-muted-foreground">{selectedFilm.director}</p>
                    </div>

                    <div className="flex gap-4">
                      <Badge className="bg-primary/20 text-primary">{selectedFilm.genre}</Badge>
                      {selectedFilm.status === 'scored' && (
                        <Badge className="bg-green-500/20 text-green-400">
                          Score: {averageScore.toFixed(1)}/5
                        </Badge>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2 uppercase font-semibold">Dream Concept</p>
                      <p className="text-foreground">{selectedFilm.dreamConcept}</p>
                    </div>
                  </div>
                </Card>

                {/* Scoring Section */}
                {selectedFilm.status === 'pending' ? (
                  <Card className="p-6 bg-card border-border space-y-6">
                    <h3 className="text-lg font-bold text-foreground">Score This Film</h3>

                    <div className="space-y-6">
                      {scoreArray.map((item) => (
                        <div key={item.criterion}>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-foreground font-semibold">{item.criterion}</label>
                            <span className="text-primary font-bold text-lg">{item.score}/5</span>
                          </div>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(score => (
                              <button
                                key={score}
                                onClick={() => item.setSc(score)}
                                className={`flex-1 py-3 rounded-lg transition border ${
                                  item.score >= score
                                    ? 'bg-primary border-primary text-primary-foreground'
                                    : 'bg-background border-border text-muted-foreground hover:border-primary'
                                }`}
                              >
                                <Star className={`w-4 h-4 mx-auto ${item.score >= score ? 'fill-current' : ''}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        onClick={handleReject}
                        variant="outline"
                        className="flex-1 border-red-500 text-red-400 hover:bg-red-500/10"
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={handleSubmitScores}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Submit Scores
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-6 bg-card border-border space-y-6">
                    <h3 className="text-lg font-bold text-foreground">Your Scores</h3>

                    {selectedFilm.scores && (
                      <div className="space-y-4">
                        {Object.entries(selectedFilm.scores).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between pb-4 border-b border-border">
                            <span className="text-foreground font-semibold capitalize">
                              {key.replace('_', ' ')}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < value ? 'fill-yellow-400 text-yellow-400' : 'text-muted'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-foreground font-bold">{value}/5</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <p className="text-sm text-green-400">
                        ✓ You have successfully scored this film.
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
