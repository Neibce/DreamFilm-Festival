'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { Wand2, CheckCircle, Loader2 } from 'lucide-react'
import { api, resolveImageUrl } from '@/lib/api'
import { useToastStore } from '@/store/toast'
import { useRoleGuard } from '@/hooks/useRoleGuard'

export default function SubmitPage() {
  const [step, setStep] = useState<'dream' | 'waiting' | 'check' | 'success'>('dream')
  const [submitting, setSubmitting] = useState(false)
  const [polling, setPolling] = useState(false)
  const [createdFilmId, setCreatedFilmId] = useState<string | null>(null)
  const [filmDetail, setFilmDetail] = useState<any | null>(null)
  const [initializing, setInitializing] = useState(true)
  const [formData, setFormData] = useState({
    dreamDescription: '',
    mood: '',
    themes: '',
    title: '',
    genre: '',
    targetAudience: '',
    director: '',
    email: '',
  })
  const { show } = useToastStore()
  const { authorized, checking } = useRoleGuard('DIRECTOR')

  // 권한 확인 전까지는 조용히 대기
  if (checking) return null
  if (!authorized) return null

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // 페이지 진입 시 기존 진행 중 작품 복원
  useEffect(() => {
    if (!authorized) return
    if (createdFilmId) {
      setInitializing(false)
      return
    }
    let mounted = true
    api.getMyFilms()
      .then((list: any) => {
        if (!mounted || !Array.isArray(list)) return
        const waitingUser = list.find((f: any) => f.status === 'WAITING_USER_APPROVAL')
        if (waitingUser) {
          setCreatedFilmId(String(waitingUser.filmId))
          setFilmDetail(waitingUser)
          setStep('check')
          return
        }
        const waitingAi = list.find((f: any) => f.status === 'WAITING_AI_GENERATION')
        if (waitingAi) {
          setCreatedFilmId(String(waitingAi.filmId))
          setFilmDetail(waitingAi)
          setStep('waiting')
        }
      })
      .catch(() => {})
      .finally(() => { if (mounted) setInitializing(false) })
    return () => { mounted = false }
  }, [authorized, createdFilmId])

  // AI 완료 상태 도달까지 폴링
  useEffect(() => {
    if (!authorized || step !== 'waiting' || !createdFilmId) return
    let mounted = true
    let timer: NodeJS.Timeout | null = null
    const start = Date.now()
    setPolling(true)

    const poll = async () => {
      if (!mounted) return
      try {
        const detail: any = await api.getFilmDetail(createdFilmId)
        if (!mounted) return
      if (detail?.status === 'WAITING_USER_APPROVAL') {
        setFilmDetail(detail)
          setStep('check')
          setPolling(false)
          return
        }
      } catch (e: any) {
        if (!mounted) return
        show({ message: e?.message || '상태를 불러오지 못했습니다.', kind: 'error' })
      }

      if (Date.now() - start > 120000) { // 2분 타임아웃
        show({ message: 'AI 생성이 지연되고 있습니다. 잠시 후 다시 시도해주세요.', kind: 'error' })
        setStep('dream')
        setPolling(false)
        setCreatedFilmId(null)
        return
      }

      timer = setTimeout(poll, 3000)
    }

    poll()
    return () => {
      mounted = false
      if (timer) clearTimeout(timer)
      setPolling(false)
    }
  }, [authorized, step, createdFilmId, show])

  // check 단계 진입 시 상세 없으면 한번 더 조회
  useEffect(() => {
    if (!authorized || step !== 'check' || !createdFilmId || filmDetail) return
    api.getFilmDetail(createdFilmId)
      .then((detail: any) => {
        setFilmDetail(detail)
      })
      .catch((e: any) => {
        show({ message: e?.message || '상세를 불러오지 못했습니다.', kind: 'error' })
      })
  }, [authorized, step, createdFilmId, filmDetail, show])

  const isStep1Valid = formData.title && formData.dreamDescription.length > 50 && formData.mood && formData.genre && formData.themes

  const handleGenerate = async () => {
    if (initializing || submitting || !isStep1Valid) return
    setSubmitting(true)
    setStep('waiting')
    try {
      const res: any = await api.submitFilm({
        title: formData.title,
        dreamText: formData.dreamDescription,
        genre: formData.genre,
        mood: formData.mood,
        themes: formData.themes,
        targetAudience: formData.targetAudience || undefined,
      })
      if (res?.filmId) {
        setCreatedFilmId(String(res.filmId))
      } else {
        show({ message: '생성 요청에 실패했습니다. 다시 시도해주세요.', kind: 'error' })
        setStep('dream')
        return
      }
      show({ message: '시나리오 생성 요청을 보냈습니다.', kind: 'success' })
    } catch (err: any) {
      show({ message: err?.message || '출품에 실패했습니다.', kind: 'error' })
      setStep('dream')
      setCreatedFilmId(null)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = async () => {
    if (initializing || !createdFilmId) return
    try {
      await api.approveFilmUser(createdFilmId)
      show({ message: '출품을 확정했습니다.', kind: 'success' })
      setStep('success')
    } catch (e: any) {
      show({ message: e?.message || '출품 확정에 실패했습니다.', kind: 'error' })
    }
  }

  const handleRetry = async () => {
    if (initializing || !createdFilmId) return
    try {
      await api.denyFilmUser(createdFilmId)
      show({ message: '출품을 거절하고 처음부터 다시 진행합니다.', kind: 'success' })
      setStep('dream')
      setCreatedFilmId(null)
      setFilmDetail(null)
    } catch (e: any) {
      show({ message: e?.message || '다시하기에 실패했습니다.', kind: 'error' })
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-15 pb-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-clipartkorea text-3xl md:text-[43px] font-extrabold text-foreground mb-4 text-balance">
            당신의 꿈을 영화로 만들어보세요
            </h1>
            <p className="text-lg text-muted-foreground text-balance">
            당신의 꿈을 이야기로 펼쳐 보세요. AI를 통해 당신의 꿈은 현실이 되고, <br/>그 작품은 모두가 감상하고 평가하는 무대에 오릅니다.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex justify-between mb-8">
              {['Dream', 'Generating', 'Check', 'Success'].map((s, i) => (
                <div key={s} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                    step === ['dream', 'waiting', 'check', 'success'][i]
                      ? 'bg-primary text-primary-foreground'
                      : ['dream', 'waiting', 'check', 'success'].indexOf(step) > i
                      ? 'bg-primary/50 text-white/60'
                      : 'bg-card text-muted-foreground border border-border'
                  }`}>
                    {i + 1}
                  </div>
                  <span className="text-sm mt-2 text-muted-foreground">{s}</span>
                </div>
              ))}
            </div>
            <div className="h-1 bg-card rounded-full overflow-hidden">
              <div className={`h-full bg-primary transition-all ${
                step === 'dream' ? 'w-1/4' :
                step === 'waiting' ? 'w-2/4' :
                step === 'check' ? 'w-3/4' :
                'w-full'
              }`} />
            </div>
          </div>

          {initializing && (
            <Card className="p-6 bg-card border border-border mb-6 space-y-4">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
              </div>
              <div className="h-24 w-full bg-muted rounded animate-pulse" />
              <div className="h-10 w-32 bg-muted rounded animate-pulse" />
            </Card>
          )}

          {!initializing && (
          <>
          {/* Step 1: Dream Description */}
          {step === 'dream' && (
            <Card className="p-8 bg-card border-border space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">당신의 꿈을 기록해 보세요</h2>
                <p className="text-muted-foreground">꿈에 담긴 색채, 감정, 인물, 장면들을 가능한 자세히 작성해 주세요.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-foreground font-semibold mb-2 block">
                    영화 제목
                  </Label>
                  <Input
                    id="title"
                    placeholder='ex) 하늘의 나라'
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <Label htmlFor="dreamDescription" className="text-foreground font-semibold mb-2 block"> 오늘 꾼 꿈은... </Label>
                  <Textarea 
                    id="dreamDescription" placeholder="ex) 나는 하늘 위의 도시에서 친구와 함께 날고 있었다..."
                    value={formData.dreamDescription} onChange={(e) => handleInputChange('dreamDescription', e.target.value)}
                    className="min-h-48 bg-background border-border text-foreground placeholder:text-muted-foreground resize-none" />
                  <p className="text-xs text-muted-foreground mt-2"> {formData.dreamDescription.length}/500자 (최소 50자 이상) </p>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="row-span-1">
                    <Label htmlFor="mood" className="text-foreground font-semibold mb-2 block">
                      꿈의 분위기는...
                    </Label>
                    <Select value={formData.mood} onValueChange={(value) => handleInputChange('mood', value)}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="분위기 선택" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="mysterious">신비로운</SelectItem>
                        <SelectItem value="joyful">흥미로운</SelectItem>
                        <SelectItem value="surreal">비현실적인</SelectItem>
                        <SelectItem value="adventurous">모험적인</SelectItem>
                        <SelectItem value="horror-like">무서운</SelectItem>
                        <SelectItem value="romantic">로맨틱한</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="row-span-1">
                    <Label htmlFor="genre" className="text-foreground font-semibold mb-2 block">
                      장르
                    </Label>
                    <Select value={formData.genre} onValueChange={(value) => handleInputChange('genre', value)}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="장르 선택하기..." />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="fantasy">판타지</SelectItem>
                        <SelectItem value="scifi">SF</SelectItem>
                        <SelectItem value="drama">드라마</SelectItem>
                        <SelectItem value="adventure">어드벤처</SelectItem>
                        <SelectItem value="thriller">공포/스릴러</SelectItem>
                        <SelectItem value="romance">로맨스</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="themes" className="text-foreground font-semibold mb-2 block">
                      테마는...
                    </Label>
                    <Input
                      id="themes"
                      placeholder="ex) 기억, 시간 여행, 미스터리..."
                      value={formData.themes}
                      onChange={(e) => handleInputChange('themes', e.target.value)}
                      className="bg-background border-border"
                    />
                  </div>
                </div>
              </div>
              <div>
                {!isStep1Valid && (
                  <p className="text-xs text-muted-foreground text-center">
                    모든 항목을 입력해야 다음 단계로 넘어갈 수 있어요.
                  </p>
                )}
                <Button
                  onClick={handleGenerate}
                  disabled={!isStep1Valid || submitting || initializing}
                  className="w-full mt-2 bg-primary font-light hover:bg-primary/90 text-primary-foreground"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  {submitting ? '시나리오 생성 중...' : '영화 시나리오 생성하기'}
                </Button>
              </div>
            </Card>
          )}

          {/* Step 2: Waiting for AI */}
          {step === 'waiting' && (
            <Card className="p-8 bg-card border-border space-y-6 text-center">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Loader2 className="w-7 h-7 text-primary animate-spin" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">AI 시나리오 생성 중...</h2>
                <p className="text-muted-foreground">
                  꿈 내용과 제목, 분위기, 테마를 바탕으로 시나리오와 포스터 콘셉트를 만들고 있어요.
                </p>
              </div>
              <div className="bg-background border border-border rounded-lg p-4 text-left text-sm text-muted-foreground space-y-2">
                <p>• 입력한 정보는 제출되었으며, 상태가 바뀌면 자동으로 다음 단계로 이동합니다.</p>
                <p>• 30초 - 1분 가량 소요됩니다</p>
              </div>
            </Card>
          )}

          {/* Step 3: Check */}
          {step === 'check' && (
            <Card className="p-8 bg-card border-border space-y-6">
              <div className="flex items-start gap-6">
                <div className="w-40 aspect-[4/5] rounded-lg overflow-hidden bg-muted border border-border flex-shrink-0">
                  {filmDetail?.imageUrl ? (
                    <img
                      src={resolveImageUrl(filmDetail.imageUrl) || '/placeholder.svg'}
                      alt="poster"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                      포스터 생성 중
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">{filmDetail?.title || formData.title}</h2>
                  <p className="text-muted-foreground text-sm">
                    장르: {filmDetail?.genre || formData.genre || '-'}
                  </p>
                </div>
              </div>

              <div className="space-y-6 bg-background rounded-lg p-6 border border-border">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase">꿈 내용</h3>
                  <p className="text-foreground whitespace-pre-wrap">{filmDetail?.dreamText || formData.dreamDescription}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase">시나리오 요약</h3>
                  <p className="text-foreground whitespace-pre-wrap">
                    {filmDetail?.summary || 'AI 요약을 불러오는 중입니다.'}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase">시나리오</h3>
                  <div className="text-foreground whitespace-pre-wrap leading-relaxed space-y-4">
                    {(filmDetail?.aiScript || '').length > 0
                      ? (filmDetail.aiScript as string).split('\n\n').map((para: string, idx: number) => (
                          <p key={idx}>{para}</p>
                        ))
                      : <p className="text-muted-foreground">AI 시나리오를 생성 중입니다.</p>
                    }
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  className="flex-1 border-border hover:bg-card cursor-pointer"
                  disabled={initializing || submitting}
                >
                  다시하기
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                  disabled={initializing || submitting}
                >
                  출품하기
                </Button>
              </div>
            </Card>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <Card className="px-8 py-10 bg-card border-border text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">꿈 출품 완료!</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  당신의 꿈을 출품해주셔서 감사합니다.<br/>생성된 꿈 영화는 24시간 내에 관리자가 검토할 예정입니다.<br/>좋은 결과가 있기를 바랍니다!
                </p>
              </div>

              <Button
                onClick={() => window.location.href = '/explore'}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                출품작 보러가기
              </Button>
            </Card>
          )}

          </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
