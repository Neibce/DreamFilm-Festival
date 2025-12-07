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
import { api, resolveImageUrl } from '@/lib/api'
import { useToastStore } from '@/store/toast'
import { useRoleGuard } from '@/hooks/useRoleGuard'

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
  const [films, setFilms] = useState<JudgingFilm[]>([])
  const [selectedFilmId, setSelectedFilmId] = useState<string | undefined>(undefined)
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
  const [festivalPeriod, setFestivalPeriod] = useState<{ startDate: string; endDate: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { show } = useToastStore()
  const { authorized, checking } = useRoleGuard('JUDGE')
  const isAccessPending = checking || !authorized

  useEffect(() => {
    if (!authorized) return
    const finalized = localStorage.getItem('festivalFinalized') === 'true'
    setIsFestivalFinalized(finalized)
    
    // localStorage에서 영화제 기간 읽기
    const savedPeriod = localStorage.getItem('currentFestivalPeriod')
    if (savedPeriod) {
      try {
        const period = JSON.parse(savedPeriod)
        setFestivalPeriod(period)
      } catch (e) {
        console.error('Failed to parse festival period:', e)
      }
    }
  }, [authorized])

  // 영화제 기간을 API에서 가져와 상태/로컬스토리지에 반영
  useEffect(() => {
    if (!authorized) return
    let mounted = true
    api.getFestivals()
      .then((res: any) => {
        const festivals = Array.isArray(res) ? res : []
        if (!mounted) return
        const today = new Date()
        const ongoing = festivals.find((f) => {
          if (!f?.endDate) return false
          const end = new Date(f.endDate)
          return end >= today
        })
        if (ongoing?.startDate && ongoing?.endDate) {
          const period = { startDate: ongoing.startDate, endDate: ongoing.endDate }
          setFestivalPeriod(period)
          localStorage.setItem('currentFestivalPeriod', JSON.stringify(period))
        }
      })
      .catch((err: Error) => {
        if (!mounted) return
        show({ message: err.message || '영화제 정보를 불러오지 못했습니다.', kind: 'error' })
      })
    return () => { mounted = false }
  }, [authorized, show])

  useEffect(() => {
    if (!authorized) return
    let mounted = true
    setLoading(true)
    api.getFilms()
      .then((res) => {
        if (!mounted) return
        const mapped: JudgingFilm[] = (res as any[]).map((f) => ({
          id: String(f.filmId),
          title: f.title,
          director: f.director?.username
            ? f.director.username
            : (f.directorName ? f.directorName : (f.directorId ? `감독 #${f.directorId}` : '감독 미상')),
          genre: f.genre || '전체',
          image: resolveImageUrl(f.imageUrl) || '/placeholder.svg',
          dreamDescription: '',
          status: '심사 대기',
          scores: undefined,
          review: ''
        }))
        setFilms(mapped)
        if (mapped.length > 0) {
          setSelectedFilmId(mapped[0].id)
        }
      })
      .catch((err: Error) => {
        if (!mounted) return
        show({ message: err.message || '상영작을 불러오지 못했습니다.', kind: 'error' })
        setFilms([])
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [authorized, show])

  // Fetch detail for selected film to load full dream text
  useEffect(() => {
    if (!authorized || !selectedFilmId) return
    let mounted = true
    setDetailLoading(true)
    Promise.all([
      api.getFilmDetail(selectedFilmId),
      api.getMyJudgeScore(selectedFilmId).catch(() => null)
    ])
      .then((f: any) => {
        if (!mounted) return
        const filmDetail = Array.isArray(f) ? f[0] : f
        const myScore = Array.isArray(f) ? f[1] : null

        setFilms(prev => prev.map(film => film.id === selectedFilmId ? {
          ...film,
          dreamDescription: filmDetail?.dreamText || '소개가 없습니다.',
          scores: myScore ? {
            creativity: myScore.creativity ?? 0,
            execution: myScore.execution ?? 0,
            emotional_impact: myScore.emotionalImpact ?? 0,
            storytelling: myScore.storytelling ?? 0
          } as any : film.scores,
          review: myScore?.comment ?? film.review,
          status: myScore ? '심사 완료' : film.status
        } : film))

        if (myScore) {
          setCurrentScores({
            creativity: myScore.creativity ?? 0,
            execution: myScore.execution ?? 0,
            emotional_impact: myScore.emotionalImpact ?? 0,
            storytelling: myScore.storytelling ?? 0,
          } as any)
          setCurrentReview(myScore.comment ?? '')
        } else {
          setCurrentScores({ creativity: 0, execution: 0, emotional_impact: 0, storytelling: 0 })
          setCurrentReview('')
        }
      })
      .catch((err: Error) => {
        if (!mounted) return
        show({ message: err.message || '영화 상세를 불러오지 못했습니다.', kind: 'error' })
      })
      .finally(() => {
        if (mounted) setDetailLoading(false)
      })
    return () => { mounted = false }
  }, [authorized, selectedFilmId, show])

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
    if (!authorized || !selectedFilm || !canSubmitScores || isFestivalFinalized || submitting) return
    setSubmitting(true)
    api.submitJudgeScore(selectedFilm.id, {
      creativity: currentScores.creativity,
      execution: currentScores.execution,
      emotionalImpact: currentScores.emotional_impact,
      storytelling: currentScores.storytelling,
      comment: currentReview,
    })
      .then(() => {
        setFilms(films.map(f => 
          f.id === selectedFilmId 
            ? { ...f, status: '심사 완료', scores: currentScores, review: currentReview }
            : f
        ))
        setIsEditingCompleted(false)
        show({ message: '심사 결과가 저장되었습니다.', kind: 'success' })
      })
      .catch((err: Error) => {
        show({ message: err.message || '심사 저장에 실패했습니다.', kind: 'error' })
      })
      .finally(() => setSubmitting(false))
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
  const isListLoading = loading && films.length === 0

  // 권한 확인 전까지는 렌더를 건너뛰되, 훅 호출 순서는 유지
  if (isAccessPending) return null

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
            {festivalPeriod && (() => {
              const startDate = new Date(festivalPeriod.startDate)
              const endDate = new Date(festivalPeriod.endDate)
              const formatDate = (date: Date) => {
                return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
              }
              return (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">
                    영화제 기간: {formatDate(startDate)} - {formatDate(endDate)}
                  </span>
                </div>
              )
            })()}
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
              <div className="space-y-3 max-h-[560px] min-h-[420px] overflow-y-auto pr-1 p-3 scrollbar-elegant rounded-2xl border border-border/60 bg-card/60">
                {isListLoading ? (
                  <>
                    {[1,2,3].map(i => (
                      <Card key={i} className="p-4 bg-card border-border animate-pulse space-y-2">
                        <div className="h-4 w-2/3 bg-muted rounded" />
                        <div className="h-3 w-1/3 bg-muted rounded" />
                      </Card>
                    ))}
                  </>
                ) : filteredFilms.length === 0 ? (
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
                <Card className="overflow-hidden bg-card border-border pt-0">
                  <div className="relative overflow-hidden bg-muted aspect-[4/5]">
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
                    <p className="text-foreground whitespace-pre-line">
                      {detailLoading && !selectedFilm.dreamDescription
                        ? '내용을 불러오는 중입니다...'
                        : (selectedFilm.dreamDescription || '내용이 없습니다.')}
                    </p>
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
