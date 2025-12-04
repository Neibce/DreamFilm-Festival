'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import Link from 'next/link'
import { LogIn, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isFormValid = 
    formData.email.includes('@') &&
    formData.password.length >= 8

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid) {
      console.log('로그인 시도:', formData)
      alert('로그인되었습니다!')
    }
  }

  return (
    <main className="min-h-screen bg-background lg:px-8 min-h-screen flex flex-row items-center justify-start">
      <Header />
      <section className="px-4 md:px-6 lg:px-8 flex flex-row">
        <div className="flex flex-row mx-20 items-center">
          <div className="mr-10 w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-[40px]">DF</span>
          </div>
          <span className='text-[120px] font-bold'>
            DFF 2025
          </span>
        </div>

        <div className="hidden md:block w-px h-80 bg-border"></div>

        <div className="max-w-sm mx-auto flex flex-col items-center">
          <div className="w-full ml-[40vh]">
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

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">로그인 상태 유지</span>
                  </label>
                  <Link href="#" className="text-sm text-primary hover:underline">
                    비밀번호 찾기
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={!isFormValid}
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
    </main>
  )
}

