'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { useToastStore } from '@/store/toast'

export function CTA() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { user, fetched } = useAuthStore()
  const { show } = useToastStore()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-accent/5 p-12 text-center overflow-hidden group">
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* Gradient overlay animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10"></div>
          
          {/* Floating particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-float"></div>
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-accent/30 rounded-full animate-float" style={{ animationDelay: '0.5s', animationDuration: '3s' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-2.5 h-2.5 bg-primary/20 rounded-full animate-float" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
          
          <div className={`relative z-10 transition-all duration-1000 ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-4xl font-bold mb-4 animate-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-shimmer">
              당신의 꿈을 실현시킬 준비가 되었나요?
            </h2>
            <p className={`text-xl text-muted-foreground mb-8 text-balance transition-all duration-1000 delay-200 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
            }`}>
              수천 명의 Dreamer들과 함께, 지금 바로 꿈이 영화가 되는 여정을 시작하세요!
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-300 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
            }`}>
              {fetched && !user ? (
                <button
                  onClick={() => {
                    show({ message: '출품 작품을 제출하려면 로그인이 필요합니다.', kind: 'error' })
                  }}
                  className="group/btn relative px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-primary/80 hover:shadow-[0_0_30px_rgba(var(--primary),0.5)]"
                >
                  <span className="relative z-10">지금 출품하러 가기</span>
                </button>
              ) : (
                <Link href="/submit">
                  <button className="group/btn relative px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-primary/80 hover:shadow-[0_0_30px_rgba(var(--primary),0.5)]">
                    <span className="relative z-10">지금 출품하러 가기</span>
                  </button>
                </Link>
              )}
              <Link href="/explore">
                <button className="group/btn2 relative px-8 py-3 border border-primary/50 text-primary rounded-lg font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:border-primary hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                  <span className="relative z-10">작품 감상하기</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-15px) translateX(5px);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </section>
  )
}
