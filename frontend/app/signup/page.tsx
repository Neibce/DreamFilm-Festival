'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import Link from 'next/link'
import { UserPlus, Mail, Lock, User } from 'lucide-react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useToastStore } from '@/store/toast'

type ToastKind = 'success' | 'error'

function Toast({ message, kind, onClose }: { message: string; kind: ToastKind; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`rounded-lg px-4 py-3 shadow-lg border text-sm ${
          kind === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}
      >
        {message}
      </div>
    </div>
  )
}

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const { show } = useToastStore()
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isFormValid = 
    formData.name.length > 0 &&
    formData.email.includes('@') &&
    formData.password.length >= 8 &&
    formData.password === formData.confirmPassword

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid || loading) return
    setLoading(true)
    api.signUp({
      username: formData.name,
      email: formData.email,
      password: formData.password,
      role: 'AUDIENCE'
    })
      .then(() => {
        show({ message: '회원가입이 완료되었습니다!', kind: 'success' })
        router.push('/login')
      })
      .catch((err: Error) => {
        show({ message: err.message || '회원가입에 실패했습니다.', kind: 'error' })
      })
      .finally(() => setLoading(false))
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <section className="w-full px-4 flex justify-center items-center">
        <div className="w-full max-w-md flex flex-col mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="font-clipartkorea text-3xl md:text-[43px] font-extrabold text-foreground mb-4 text-balance">
              회원가입
            </h1>
            <p className="text-lg text-muted-foreground text-balance">
              Dream Film Festival에 오신 것을 환영합니다
            </p>
          </div>

          {/* Signup Form */}
          <Card className="p-8 bg-card border-border space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-foreground font-semibold mb-2 block">
                  이름
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="이름을 입력하세요"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-background border-border pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-foreground font-semibold mb-2 block">
                  이메일
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-background border-border pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-foreground font-semibold mb-2 block">
                  비밀번호
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="비밀번호를 입력하세요 (최소 8자)"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="bg-background border-border pl-10"
                    required
                    minLength={8}
                  />
                </div>
                {formData.password.length > 0 && formData.password.length < 8 && (
                  <p className="text-xs text-red-400 mt-1">비밀번호는 최소 8자 이상이어야 합니다</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-foreground font-semibold mb-2 block">
                  비밀번호 확인
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="bg-background border-border pl-10"
                    required
                  />
                </div>
                {formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-400 mt-1">비밀번호가 일치하지 않습니다</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={!isFormValid || loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                회원가입
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                이미 계정이 있으신가요?{' '}
                <Link href="/login" className="text-primary hover:underline font-semibold">
                  로그인
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* ToastContainer is rendered globally in layout */}
    </main>
  )
}

