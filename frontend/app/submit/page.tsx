'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { Upload, Wand2, CheckCircle } from 'lucide-react'

export default function SubmitPage() {
  const [step, setStep] = useState<'dream' | 'check' | 'success'>('dream')
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isStep1Valid = formData.title && formData.dreamDescription.length > 50 && formData.mood && formData.genre && formData.themes

  const handleSubmit = () => {
    setStep('success')
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
              {['Dream', 'check', 'Success'].map((s, i) => (
                <div key={s} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                    step === ['dream', 'check', 'success'][i]
                      ? 'bg-primary text-primary-foreground'
                      : ['dream', 'check', 'success'].indexOf(step) > i
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
                step === 'dream' ? 'w-1/3' :
                step === 'check' ? 'w-2/3' :
                'w-full'
              }`} />
            </div>
          </div>

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
                  onClick={() => setStep('check')}
                  disabled={!isStep1Valid}
                  className="w-full mt-2 bg-primary font-light hover:bg-primary/90 text-primary-foreground"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  영화 시나리오 생성하기
                </Button>
              </div>
            </Card>
          )}

          {/* Step 2: Check */}
          {step === 'check' && (
            <Card className="p-8 bg-card border-border space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">출품작 마지막 점검</h2>
                <p className="text-muted-foreground">출품하기 전, 입력하신 정보가 맞는지 다시 한 번 확인해주세요.</p>
              </div>

              <div className="space-y-6 bg-background rounded-lg p-6">
                <div className="border-b border-border pb-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">꿈 내용</h3>
                  <p className="text-foreground line-clamp-3">{formData.dreamDescription}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">영화 제목</h3>
                    <p className="text-foreground">{formData.title}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">장르</h3>
                    <p className="text-foreground">{formData.genre}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">감독</h3>
                    <p className="text-foreground">{formData.director}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">Email</h3>
                    <p className="text-foreground">{formData.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-0">
                <p className="text-sm text-green-500">
                  당신의 제출 내용은 관리자 팀이 24시간 이내에 검토할 예정입니다. 승인 후 확인 이메일이 발송됩니다.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setStep('dream')}
                  variant="outline"
                  className="flex-1 border-border hover:bg-card"
                >
                  뒤로 가기
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
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
                  당신의 꿈을 출품해주셔서 감사합니다.<br/>AI가 당신의 꿈을 영화 시나리오로 변환한 뒤 관리자가 검토합니다.<br/>승인 완료되면 이메일이 발송되오니 확인 부탁드립니다.<br/>좋은 결과가 있기를 바랍니다.
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
        </div>
      </section>

      <Footer />
    </main>
  )
}
