'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useToastStore } from '@/store/toast'
import Image from "next/image";
import { useAuthStore } from '@/store/auth'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { user, fetchMeOnce, clear, fetched } = useAuthStore()
  const { show } = useToastStore()

  useEffect(() => {
    fetchMeOnce()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = () => {
    api.logout()
      .then(() => {
        clear()
        setIsOpen(false)
        show({ message: '로그아웃되었습니다.', kind: 'success' })
        router.refresh()
      })
      .catch((err: Error) => {
        show({ message: err.message || '로그아웃에 실패했습니다.', kind: 'error' })
      })
  }

  const normalizedRole = (user?.role || '').toUpperCase()
  const directorProfileHref = user?.id ? `/director/${user.id}` : '/director'

  const navItems = useMemo(() => {
    if (normalizedRole === 'ADMIN') {
      return [
        { href: '/explore', label: '상영작 목록' },
        { href: '/awards', label: '수상작' },
        { href: '/admin', label: '영화제 관리' },
      ]
    }
    if (normalizedRole === 'DIRECTOR') {
      return [
        { href: '/explore', label: '상영작 목록' },
        { href: '/submit', label: '출품작 제출' },
        { href: '/awards', label: '수상작' },
        { href: directorProfileHref, label: '내 프로필' },
      ]
    }
    if (normalizedRole === 'JUDGE') {
      return [
        { href: '/explore', label: '상영작 목록' },
        { href: '/judge', label: '상영작 평가' },
        { href: '/awards', label: '수상작' },
      ]
    }
    // 기본: 관객
    return [
      { href: '/explore', label: '상영작 목록' },
      { href: '/submit', label: '출품작 제출' },
      { href: '/awards', label: '수상작' },
    ]
  }, [normalizedRole, directorProfileHref])

  return (
      <header className="sticky top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Image src="/logo.png" alt="logo" width={55} height={55} className="object-contain"/>
              <div className="flex flex-col leading-none ml-1">
                <span className="font-bold text-[14px] text-foreground hidden sm:inline">2025 제3회</span>
                <span className="font-bold text-xl text-foreground hidden sm:inline">Dream Film Festival</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              {navItems.map((item) => {
                if (item.href === '/submit' && fetched && !user) {
                  return (
                    <button
                      key={item.href}
                      onClick={() => {
                        show({ message: '출품 작품을 제출하려면 로그인이 필요합니다.', kind: 'error' })
                      }}
                      className="text-muted-foreground hover:text-foreground transition cursor-pointer"
                    >
                      {item.label}
                    </button>
                  )
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition"
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>

            {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!fetched ? null : user ? (
              <div className="flex items-center gap-3">
                <span className="px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5.5 20a7.5 7.5 0 0 1 13 0" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {user.username} | {user.role}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-primary transition cursor-pointer"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <>
                <Link 
                  href="/signup"
                  className="px-6 py-2 text-foreground hover:text-primary transition"
                >
                  회원가입
                </Link>
                <Link 
                  href="/login"
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
                >
                  로그인
                </Link>
              </>
            )}
          </div>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center"
            >
              <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
                <div className={`h-0.5 w-6 bg-foreground transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                <div className={`h-0.5 w-6 bg-foreground transition-all ${isOpen ? 'opacity-0' : ''}`}></div>
                <div className={`h-0.5 w-6 bg-foreground transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
              </div>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
              <div className="md:hidden pb-4 space-y-3">
                {navItems.map((item) => {
                  if (item.href === '/submit' && fetched && !user) {
                    return (
                      <button
                        key={item.href}
                        onClick={() => {
                          show({ message: '출품 작품을 제출하려면 로그인이 필요합니다.', kind: 'error' })
                          setIsOpen(false)
                        }}
                        className="block text-muted-foreground hover:text-foreground transition py-2 w-full text-left cursor-pointer"
                      >
                        {item.label}
                      </button>
                    )
                  }
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block text-muted-foreground hover:text-foreground transition py-2"
                    >
                      {item.label}
                    </Link>
                  )
                })}
            <div className="flex gap-3 pt-2">
              {!fetched ? null : user ? (
                <div className="flex items-center gap-2 w-full">
                  <span className="flex-1 px-6 py-2 text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5.5 20a7.5 7.5 0 0 1 13 0" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {user.username} | {user.role}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm text-muted-foreground hover:text-primary transition border border-border rounded-lg cursor-pointer"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="flex-1 px-6 py-2 text-foreground hover:text-primary transition text-center border border-border rounded-lg"
                  >
                    회원가입
                  </Link>
                  <Link
                    href="/login"
                    className="flex-1 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-center"
                  >
                    로그인
                  </Link>
                </>
              )}
            </div>
              </div>
          )}
        </nav>
      </header>
  )
}
