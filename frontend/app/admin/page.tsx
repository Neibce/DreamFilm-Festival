'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useState } from 'react';
import { Film, BarChart2, Award, Clapperboard, Users, Settings } from 'lucide-react'
import AdminContent from './AdminContent'

export default function AdminPage() {
  const [selectedMenu, setSelectedMenu] = useState<string>('출품 관리')

  const NAV_ITEMS = [
    { label: '출품 관리', icon: Film },
    { label: '심사 진행률', icon: BarChart2 },
    { label: '수상작 선정', icon: Award },
    { label: '영화제 관리', icon: Clapperboard },
    { label: '사용자 관리', icon: Users }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <section className="pt-15 pb-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-10">
              영화제 관리 페이지
            </h1>
          </div>

          <div className="flex flex-row items-center justify-center gap-3">
            {NAV_ITEMS.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setSelectedMenu(label)}
                className={`flex gap-3 w-full text-center p-4 rounded-lg transition border ${
                  selectedMenu === label
                    ? 'bg-primary/20 border-primary'
                    : 'bg-card border-border hover:border-primary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
          <div className="mt-10 h-auto">
              <AdminContent selectedMenu={selectedMenu}/>
            </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
