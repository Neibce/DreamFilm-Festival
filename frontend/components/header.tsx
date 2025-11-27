'use client'

import { useState } from 'react'
import Link from 'next/link'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">DF</span>
            </div>
            <div className="flex flex-col leading-none ml-1">
              <span className="font-bold text-[14px] text-foreground hidden sm:inline">2025년 제13회</span>
              <span className="font-bold text-xl text-foreground hidden sm:inline">Dream Film Festival</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <Link href="/explore" className="text-muted-foreground hover:text-foreground transition">
              상영작 목록
            </Link>
            <Link href="/submit" className="text-muted-foreground hover:text-foreground transition">
              출품작 제출
            </Link>
            <Link href="/judge" className="text-muted-foreground hover:text-foreground transition">
              상영작 평가
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button className="px-6 py-2 text-foreground hover:text-primary transition">
              Sign Up
            </button>
            <Link 
              href="/submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
            >
              Sign In
            </Link>
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
            <Link href="/explore" className="block text-muted-foreground hover:text-foreground transition py-2">
              Explore Films
            </Link>
            <Link href="/submit" className="block text-muted-foreground hover:text-foreground transition py-2">
              Submit Dream
            </Link>
            <Link href="/judge" className="block text-muted-foreground hover:text-foreground transition py-2">
              Judge Films
            </Link>
            <Link
              href="/submit"
              className="block w-full px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-center"
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
