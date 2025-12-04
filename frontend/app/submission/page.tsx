'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState, useMemo } from 'react'
import { CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { MOCK_FILMS } from '@/app/explore/page'

interface Submission {
  id: string
  title: string
  director: string
  email: string
  dreamConcept: string
  genre: string
  status: 'pending' | 'approved'
  submittedAt: string
  userRating?: number
  votes?: number
}

const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: '1',
    title: 'The Midnight Garden',
    director: 'Sarah Chen',
    email: 'sarah@email.com',
    dreamConcept: 'A surreal garden that exists between dreams and reality',
    genre: 'Fantasy Drama',
    status: 'approved',
    submittedAt: '2 hours ago'
  },
  {
    id: '2',
    title: 'Echoes in the Cloud',
    director: 'James Rivera',
    email: 'james@email.com',
    dreamConcept: 'Two souls communicating through digital dreams',
    genre: 'Sci-Fi Romance',
    status: 'pending',
    submittedAt: '30 minutes ago'
  },
]

export default function SubmissionPage() {
  const [submissions, setSubmissions] = useState(MOCK_SUBMISSIONS)
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved'>('all')

  // explore 페이지의 user review 점수와 연동 (승인 완료된 작품만)
  const submissionsWithRatings = useMemo(() => {
    return submissions.map(submission => {
      // 승인 완료된 작품만 user rating을 가져옴
      if (submission.status === 'approved') {
        const film = MOCK_FILMS.find(f => f.id === submission.id)
        return {
          ...submission,
          userRating: film?.rating,
          votes: film?.votes
        }
      }
      return {
        ...submission,
        userRating: undefined,
        votes: undefined
      }
    })
  }, [submissions])

  const selectedSubmission = submissionsWithRatings.find(s => s.id === selectedSubmissionId)

  const filteredSubmissions = activeFilter === 'all' 
    ? submissionsWithRatings 
    : submissionsWithRatings.filter(s => s.status === activeFilter)

  const handleDelete = (id: string) => {
    setSubmissions(submissions.filter(s => s.id !== id))
    setSelectedSubmissionId(null)
  }

  const stats = {
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    total: submissions.length
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-15 pb-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-clipartkorea text-3xl md:text-[43px] font-extrabold text-foreground mb-4 text-balance">
              출품 대시보드
            </h1>
            <p className="text-lg text-muted-foreground text-balance">
              작품 제출 및 승인 여부를 확인해보세요.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card 
              className={`p-6 bg-card border-border cursor-pointer transition-all ${
                activeFilter === 'all' ? 'border-primary bg-primary/10' : 'hover:border-primary/50'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">전체 출품작</p>
                  <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </Card>

            <Card 
              className={`p-6 bg-card border-border cursor-pointer transition-all ${
                activeFilter === 'pending' ? 'border-primary bg-primary/10' : 'hover:border-primary/50'
              }`}
              onClick={() => setActiveFilter('pending')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">심사 대기</p>
                  <p className="text-3xl font-bold text-foreground">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </Card>

            <Card 
              className={`p-6 bg-card border-border cursor-pointer transition-all ${
                activeFilter === 'approved' ? 'border-primary bg-primary/10' : 'hover:border-primary/50'
              }`}
              onClick={() => setActiveFilter('approved')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">승인 완료</p>
                  <p className="text-3xl font-bold text-foreground">{stats.approved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </Card>
          </div>

          {/* Submissions List */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {filteredSubmissions.map(submission => (
                <button
                  key={submission.id}
                  onClick={() => setSelectedSubmissionId(
                    selectedSubmissionId === submission.id ? null : submission.id
                  )}
                  className={`text-left p-4 rounded-lg transition border ${
                    selectedSubmissionId === submission.id
                      ? 'bg-primary/20 border-primary'
                      : 'bg-card border-border hover:border-primary'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground line-clamp-1 flex-1">{submission.title}</h3>
                    <Badge className={`ml-2 ${
                      submission.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {submission.status === 'approved' ? '승인 완료' : '심사 대기'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{submission.director}</p>
                  <p className="text-xs text-muted-foreground mt-1">{submission.submittedAt}</p>
                  {submission.status === 'approved' && submission.userRating && submission.userRating > 0 && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-green-400">
                      <span>User Rating: {submission.userRating}/5 ({submission.votes} votes)</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Submission Details */}
            {selectedSubmission && (
              <div className="space-y-6">
                <Card className="p-8 bg-card border-border space-y-6">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">{selectedSubmission.title}</h2>
                        <p className="text-muted-foreground">{selectedSubmission.director}</p>
                      </div>
                      <Badge className={`${
                        selectedSubmission.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {selectedSubmission.status === 'approved' ? '승인 완료' : '심사 대기'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Email</p>
                        <p className="text-foreground font-medium">{selectedSubmission.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Genre</p>
                        <p className="text-foreground font-medium">{selectedSubmission.genre}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground mb-1">Submitted</p>
                        <p className="text-foreground font-medium">{selectedSubmission.submittedAt}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground uppercase font-semibold mb-2">Dream Concept</p>
                    <p className="text-foreground leading-relaxed">{selectedSubmission.dreamConcept}</p>
                  </div>

                  {selectedSubmission.status === 'approved' && selectedSubmission.userRating && selectedSubmission.userRating > 0 && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <p className="text-green-400 font-semibold">
                        User Review Rating: {selectedSubmission.userRating}/5 ({selectedSubmission.votes} votes)
                      </p>
                    </div>
                  )}

                  {selectedSubmission.status === 'pending' && (
                    <div className="flex gap-4 pt-4">
                      <Button
                        onClick={() => handleDelete(selectedSubmission.id)}
                        className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                      >
                        삭제하기
                      </Button>
                    </div>
                  )}

                  {selectedSubmission.status === 'approved' && (
                    <div className="rounded-lg p-4 border bg-green-500/10 border-green-500/20">
                      <p className="text-sm font-semibold text-green-400">
                        ✓ 이 출품작은 승인되었습니다
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
