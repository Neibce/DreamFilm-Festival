'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect, useMemo, useState } from 'react'
import { Star, CheckCircle, CircleEllipsis, Clock, Edit } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

type FilmScore = {
  creativity: number
  execution: number
  emotional_impact: number
  storytelling: number
}

interface JudgingFilm {
  id: string
  title: string
  director: string
  genre: string
  image: string
  dreamDescription: string
  status: '심사 대기' | '심사 완료'
  scores?: FilmScore
  review?: string
}

const MOCK_JUDGING_FILMS: JudgingFilm[] = [
  {
    id: '1',
    title: '하늘을 나는 도시',
    director: '김윤영',
    genre: '판타지',
    image: '/fantasy-film-poster.jpg',
    dreamDescription: 
      `처음에는 아무도 눈치 채지 못했다. 새벽녘, 도시의 가장 깊은 곳에서 마치 거대한 심장이 뛰는 듯한 진동이 울리기 시작했다. 건물의 벽이 미세하게 흔들리고, 가로등 불빛이 떨렸다.
      사람들은 지진이라 생각해 바닥을 살폈지만, 흔들리는 것은 땅이 아니라 도시 전체였다. 
      잠시 뒤, 소리가 완전히 멈추자 믿기 어려운 일이 일어났다.
      도시가 땅에서 떨어지기 시작했다.

      바퀴도, 추진 장치도 보이지 않았다. 마치 보이지 않는 손이 도시를 통째로 들어 올리는 것처럼, 아파트 단지, 고층 빌딩, 공원, 도로, 자동차—모든 것이 그대로 들려 올랐다.
      창밖으로 내려다본 땅은 점점 멀어졌고, 사람들의 비명과 환호가 뒤섞였다. 누군가는 울부짖었고, 누군가는 감탄하며 스마트폰을 꺼내 들었다. 하지만 와이파이는 이미 끊긴 지 오래였다.

      도시가 구름에 닿는 순간, 놀라운 변화가 시작됐다.
      구름은 마치 단단한 바닥처럼 도시 아래로 밀려들어와 하얀 해변처럼 펼쳐졌다. 건물 사이로 흘러들어온 구름은 안개처럼 번지며 발끝을 간지럽혔고, 구름 위로 걸으면 발자국이 천천히 사라졌다. 마치 새 세계가 열리는 듯했다.

      이상하게도 하늘은 더 가까워졌는데, 바람은 거의 불지 않았다. 도시가 공중에 떠 있는데도 흔들리지 않았고, 소음도 줄어들었다. 엔진 소리도, 자동차 경적도, 지하철의 굉음도 사라졌다.
      대신, 희미한 공명 같은 소리가 도시 전체에 울려 퍼졌다. 마치 도시 자체가 살아 숨 쉬는 생명체처럼.

      사람들은 공포와 호기심 사이에서 방황했다.
      어떤 이들은 구름이 바다처럼 펼쳐진 가장자리에서 끝없는 아래쪽 하늘을 내려다보며 공허함에 빠졌다. 또 어떤 이들은 높은 건물 옥상에 올라가 별과 달이 평소보다 가깝게 보이는 기이한 광경에 매료되었다.`,
    status: '심사 대기'
  },
  {
    id: '2',
    title: '기억을 파는 상점',
    director: '양준영',
    genre: 'SF',
    image: '/sci-fi-movie-poster.png',
    dreamDescription: 'Two souls communicating through digital dreams',
    status: '심사 완료',
    scores: { creativity: 5, execution: 4, emotional_impact: 5, storytelling: 4 },
    review: '독창적인 아이디어와 감동적인 연출이 돋보이는 작품입니다.'
  },
  {
    id: '3',
    title: '시간이 멈춘 카페',
    director: '임지우',
    genre: '어드벤처',
    image: '/adventure-film-poster.jpg',
    dreamDescription: 'An explorer finds a portal to another dimension',
    status: '심사 대기'
  }
]

interface ScoreLine {
  criterion: string
  icon: string
  score: number
  setScore: (score: number) => void
}

const SCORE_LABELS: Record<keyof FilmScore, string> = {
  creativity: '창의성',
  execution: '연출',
  emotional_impact: '감정 전달력',
  storytelling: '스토리텔링'
}

export default function JudgePage() {
  const [films, setFilms] = useState(MOCK_JUDGING_FILMS)
  const [selectedFilmId, setSelectedFilmId] = useState<string | undefined>(MOCK_JUDGING_FILMS[0]?.id)
  const [statusFilter, setStatusFilter] = useState<'all' | '심사 대기' | '심사 완료'>('all')
  const [isFestivalFinalized, setIsFestivalFinalized] = useState(false)
  const [currentScores, setCurrentScores] = useState<FilmScore>({
    creativity: 0,
    execution: 0,
    emotional_impact: 0,
    storytelling: 0
  })
  const [currentReview, setCurrentReview] = useState('')
  const [isEditingCompleted, setIsEditingCompleted] = useState(false)

  useEffect(() => {
    const finalized = localStorage.getItem('festivalFinalized') === 'true'
    setIsFestivalFinalized(finalized)
  }, [])

  const filteredFilms = useMemo(() => {
    return statusFilter === 'all'
      ? films
      : films.filter(f => f.status === statusFilter)
  }, [films, statusFilter])

  const selectedFilm = films.find(f => f.id === selectedFilmId)
  const totalFilms = films.length
  const pendingCount = films.filter(f => f.status === '심사 대기').length
  const completedCount = films.filter(f => f.status === '심사 완료').length
  const canSubmitScores =
    selectedFilm &&
    Object.values(currentScores).every(score => score > 0)

  useEffect(() => {
    if (filteredFilms.length === 0) {
      setSelectedFilmId(undefined)
      return
    }
    const existsInFilter = filteredFilms.some(f => f.id === selectedFilmId)
    if (!existsInFilter) {
      setSelectedFilmId(filteredFilms[0].id)
    }
  }, [filteredFilms, selectedFilmId])

  useEffect(() => {
    if (selectedFilm) {
      if (selectedFilm.status === '심사 완료' && selectedFilm.scores) {
        setCurrentScores(selectedFilm.scores)
        setCurrentReview(selectedFilm.review || '')
        setIsEditingCompleted(false)
      } else {
        setCurrentScores({ creativity: 0, execution: 0, emotional_impact: 0, storytelling: 0 })
        setCurrentReview('')
        setIsEditingCompleted(false)
      }
    }
  }, [selectedFilm])

  const handleScoreChange = (criterion: keyof FilmScore, score: number) => {
    setCurrentScores(prev => ({
      ...prev,
      [criterion]: prev[criterion] === score ? 0 : score
    }))
  }

  const handleSubmitScores = () => {
    if (!selectedFilm || !canSubmitScores || isFestivalFinalized) return
    setFilms(films.map(f => 
      f.id === selectedFilmId 
        ? { ...f, status: '심사 완료', scores: currentScores, review: currentReview }
        : f
    ))
    setCurrentScores({ creativity: 0, execution: 0, emotional_impact: 0, storytelling: 0 })
    setCurrentReview('')
    setIsEditingCompleted(false)
    const nextPending = films.find(f => f.status === '심사 대기' && f.id !== selectedFilmId)
    if (nextPending) setSelectedFilmId(nextPending.id)
  }

  const handleEditCompleted = () => {
    setIsEditingCompleted(true)
  }

  const scoreArray = [
    { criterion: SCORE_LABELS.creativity, icon: '✨', score: currentScores.creativity, setSc: (s: number) => handleScoreChange('creativity', s) },
    { criterion: SCORE_LABELS.execution, icon: '🎬', score: currentScores.execution, setSc: (s: number) => handleScoreChange('execution', s) },
    { criterion: SCORE_LABELS.emotional_impact, icon: '💫', score: currentScores.emotional_impact, setSc: (s: number) => handleScoreChange('emotional_impact', s) },
    { criterion: SCORE_LABELS.storytelling, icon: '📖', score: currentScores.storytelling, setSc: (s: number) => handleScoreChange('storytelling', s) }
  ]

  const averageScore = selectedFilm?.scores 
    ? (selectedFilm.scores.creativity + selectedFilm.scores.execution + selectedFilm.scores.emotional_impact + selectedFilm.scores.storytelling) / 4 
    : 0

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-15 pb-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 text-balance">
              심사 대시보드
            </h1>
            <p className="text-lg text-muted-foreground text-balance">
              영화제 종료 전까지 출품된 영화들을 심사해 주세요. 귀하의 심사를 통해 영화제 수상작을 선정합니다.
            </p>
            {isFestivalFinalized && (
              <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <p className="text-yellow-500 font-semibold text-center">
                  🏆 영화제가 종료되었습니다. 수상작이 확정되어 더 이상 심사가 불가능합니다.
                </p>
              </div>
            )}
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                영화제 기간: 2025년 12월 1일 - 12월 31일
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card
              role="button"
              tabIndex={0}
              onClick={() => setStatusFilter('all')}
              className={`p-6 bg-card border transition ${
                statusFilter === 'all'
                  ? 'border-primary shadow-[0_0_0_2px] shadow-primary/30'
                  : 'border-border hover:border-primary/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">전체 출품작</p>
                  <p className="text-3xl font-bold text-foreground">{totalFilms}</p>
                </div>
                <CircleEllipsis className="w-8 h-8 text-primary" />
              </div>
            </Card>

            <Card
              role="button"
              tabIndex={0}
              onClick={() => setStatusFilter('심사 완료')}
              className={`p-6 bg-card border transition ${
                statusFilter === '심사 완료'
                  ? 'border-primary shadow-[0_0_0_2px] shadow-primary/30'
                  : 'border-border hover:border-primary/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">심사 완료</p>
                  <p className="text-3xl font-bold text-foreground">{completedCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </Card>

            <Card
              role="button"
              tabIndex={0}
              onClick={() => setStatusFilter('심사 대기')}
              className={`p-6 bg-card border transition ${
                statusFilter === '심사 대기'
                  ? 'border-primary shadow-[0_0_0_2px] shadow-primary/30'
                  : 'border-border hover:border-primary/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">심사 대기 중</p>
                  <p className="text-3xl font-bold text-foreground">{pendingCount}</p>
                </div>
                <Clock className="w-8 h-8 text-gray-600/70" />
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Film List */}
            <div className="lg:col-span-1">
              <h2 className="text-lg font-bold text-foreground mb-4">출품작 목록</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredFilms.length === 0 ? (
                  <div className="p-6 border border-dashed border-border rounded-lg text-center text-sm text-muted-foreground">
                    선택한 상태에 해당하는 작품이 없습니다.
                  </div>
                ) : (
                  filteredFilms.map(film => (
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
                        {film.status === '심사 대기' && <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">심사 대기</Badge>}
                        {film.status === '심사 완료' && <Badge className="bg-green-500/20 text-green-400 text-xs">심사 완료</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{film.director}</p>
                    </button>
                  ))
                )}
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
                      {selectedFilm.status === '심사 완료' && (
                        <Badge className="bg-green-500/20 text-green-400">
                          Score: {averageScore.toFixed(1)}/5
                        </Badge>
                      )}
                    </div>

                    <div>
                      <p className="text-foreground">{selectedFilm.dreamDescription}</p>
                    </div>
                  </div>
                </Card>

                {/* Scoring Section */}
                {selectedFilm.status === '심사 대기' && (
                  <Card className="p-6 bg-card border-border space-y-6">
                    <h3 className="text-lg font-bold text-foreground">심사 기준</h3>

                    {isFestivalFinalized ? (
                      <div className="py-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-yellow-500" />
                        </div>
                        <p className="text-lg font-semibold text-foreground mb-2">
                          영화제가 종료되었습니다
                        </p>
                        <p className="text-sm text-muted-foreground">
                          수상작이 확정되어 더 이상 심사를 진행할 수 없습니다.
                        </p>
                      </div>
                    ) : (
                      <>
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

                        <div className="space-y-4">
                          <div>
                            <label className="text-foreground font-semibold mb-2 block">심사 리뷰</label>
                            <Textarea
                              value={currentReview}
                              onChange={(e) => setCurrentReview(e.target.value)}
                              placeholder="영화에 대한 리뷰를 작성해주세요 (선택사항)"
                              className="min-h-[120px] resize-none bg-background border-border text-foreground"
                            />
                          </div>
                        </div>

                        <div className="pt-4 space-y-2">
                          {!canSubmitScores && (
                            <p className="text-xs text-muted-foreground text-center">
                              모든 항목에 별점을 입력해야 심사를 확정할 수 있어요.
                            </p>
                          )}
                          <Button
                            onClick={handleSubmitScores}
                            disabled={!canSubmitScores}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-40 disabled:pointer-events-none"
                          >
                            심사 제출하기
                          </Button>
                        </div>
                      </>
                    )}
                  </Card>
                )}

                {selectedFilm.status === '심사 완료' && (
                  <Card className="p-6 bg-card border-border space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-foreground">심사 점수</h3>
                      {!isFestivalFinalized && !isEditingCompleted && (
                        <Button
                          onClick={handleEditCompleted}
                          variant="outline"
                          size="sm"
                          className="border-primary text-primary hover:bg-primary/10"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          수정하기
                        </Button>
                      )}
                    </div>

                    {isFestivalFinalized ? (
                      <>
                        {selectedFilm.scores && (
                          <div className="space-y-4">
                            {Object.entries(selectedFilm.scores).map(([key, value]) => {
                              const label = SCORE_LABELS[key as keyof FilmScore] ?? key
                              return (
                                <div key={key} className="flex items-center justify-between pb-4 border-b border-border">
                                  <span className="text-foreground font-semibold">
                                    {label}
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
                              )
                            })}
                          </div>
                        )}

                        {selectedFilm.review && (
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">심사 리뷰</h4>
                            <p className="text-sm text-muted-foreground bg-background/50 p-4 rounded-lg border border-border">
                              {selectedFilm.review}
                            </p>
                          </div>
                        )}

                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                          <p className="text-sm text-yellow-500">
                            🏆 영화제가 종료되어 심사를 수정할 수 없습니다.
                          </p>
                        </div>
                      </>
                    ) : isEditingCompleted ? (
                      <>
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

                        <div className="space-y-4">
                          <div>
                            <label className="text-foreground font-semibold mb-2 block">심사 리뷰</label>
                            <Textarea
                              value={currentReview}
                              onChange={(e) => setCurrentReview(e.target.value)}
                              placeholder="영화에 대한 리뷰를 작성해주세요 (선택사항)"
                              className="min-h-[120px] resize-none bg-background border-border text-foreground"
                            />
                          </div>
                        </div>

                        <div className="pt-4 space-y-2">
                          {!canSubmitScores && (
                            <p className="text-xs text-muted-foreground text-center">
                              모든 항목에 별점을 입력해야 심사를 확정할 수 있어요.
                            </p>
                          )}
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                setIsEditingCompleted(false)
                                if (selectedFilm.scores) setCurrentScores(selectedFilm.scores)
                                setCurrentReview(selectedFilm.review || '')
                              }}
                              variant="outline"
                              className="flex-1"
                            >
                              취소
                            </Button>
                            <Button
                              onClick={handleSubmitScores}
                              disabled={!canSubmitScores}
                              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-40 disabled:pointer-events-none"
                            >
                              수정 완료
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {selectedFilm.scores && (
                          <div className="space-y-4">
                            {Object.entries(selectedFilm.scores).map(([key, value]) => {
                              const label = SCORE_LABELS[key as keyof FilmScore] ?? key
                              return (
                                <div key={key} className="flex items-center justify-between pb-4 border-b border-border">
                                  <span className="text-foreground font-semibold">
                                    {label}
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
                              )
                            })}
                          </div>
                        )}

                        {selectedFilm.review && (
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">심사 리뷰</h4>
                            <p className="text-sm text-muted-foreground bg-background/50 p-4 rounded-lg border border-border">
                              {selectedFilm.review}
                            </p>
                          </div>
                        )}

                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                          <p className="text-sm text-green-400">
                            ✓ 심사가 완료되었습니다. 영화제 종료 전까지 수정할 수 있습니다.
                          </p>
                        </div>
                      </>
                    )}
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
