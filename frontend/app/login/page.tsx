'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { LogIn, Mail, Lock } from 'lucide-react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useToastStore } from '@/store/toast'
import { useAuthStore } from '@/store/auth'

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

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const { show, clear } = useToastStore()
  const { setUser } = useAuthStore()
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isFormValid = 
    formData.email.includes('@') &&
    formData.password.length >= 8

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid || loading) return
    setLoading(true)
    api.login({ email: formData.email, password: formData.password })
      .then((res: any) => {
        setUser({
          id: res.id ? String(res.id) : (res.userId ? String(res.userId) : undefined),
          username: res.username,
          role: res.role
        })
        show({ message: '로그인되었습니다!', kind: 'success' })
        router.push('/')
      })
      .catch((err: Error) => {
        show({ message: err.message || '로그인에 실패했습니다.', kind: 'error' })
      })
      .finally(() => setLoading(false))
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center lg:px-8">
      <section className="w-full max-w-8xl px-4 md:px-6 lg:px-8 flex flex-row items-center justify-center gap-12 lg:gap-16">
        <div className="flex flex-row items-center">
          <Image src="/logo.png" alt="logo" width={180} height={180} className="object-contain mr-4"/>
          <span className='text-[120px] font-bold'>
            DFF 2025
          </span>
        </div>

        <div className="hidden md:block w-px h-[500px] bg-border mx-10"></div>

        <div className="flex flex-col h-[500px] items-center justify-center">
          <div className="w-full max-w-sm">
            {/* Header */}
            <div className="mb-12 text-center">
              <h1 className="font-clipartkorea text-3xl md:text-[43px] font-extrabold text-foreground mb-4 text-balance">
                로그인
              </h1>
              <p className="text-lg text-muted-foreground text-balance">
                Dream Film Festival에 다시 오신 것을 환영합니다
              </p>
            </div>

            {/* Login Form */}
            <Card className="p-8 bg-card border-border space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      placeholder="비밀번호를 입력하세요"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="bg-background border-border pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  로그인
                </Button>
              </form>

              <div className="text-center pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  계정이 없으신가요?{' '}
                  <Link href="/signup" className="text-primary hover:underline font-semibold">
                    회원가입
                  </Link>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ToastContainer is rendered globally in layout */}
    </main>
  )
}

