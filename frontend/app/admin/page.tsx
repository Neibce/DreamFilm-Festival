'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react'

interface Submission {
  id: string
  title: string
  director: string
  email: string
  dreamConcept: string
  genre: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  averageScore?: number
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
    submittedAt: '2 hours ago',
    averageScore: 4.8
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
  {
    id: '3',
    title: 'Lost Horizons',
    director: 'Mike Johnson',
    email: 'mike@email.com',
    dreamConcept: 'An explorer finds a portal to another dimension',
    genre: 'Adventure',
    status: 'rejected',
    submittedAt: '5 hours ago'
  }
]

export default function AdminPage() {
  const [submissions, setSubmissions] = useState(MOCK_SUBMISSIONS)
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('pending')

  const selectedSubmission = submissions.find(s => s.id === selectedSubmissionId)

  const filteredSubmissions = submissions.filter(s => s.status === activeTab)

  const handleApprove = (id: string) => {
    setSubmissions(submissions.map(s =>
      s.id === id ? { ...s, status: 'approved' as const } : s
    ))
    setSelectedSubmissionId(null)
  }

  const handleReject = (id: string) => {
    setSubmissions(submissions.map(s =>
      s.id === id ? { ...s, status: 'rejected' as const } : s
    ))
    setSelectedSubmissionId(null)
  }

  const stats = {
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
    total: submissions.length
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Admin Dashboard
            </h1>
            <p className="text-lg text-muted-foreground text-balance">
              Manage film submissions, approvals, and festival operations.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Submissions</p>
                  <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-muted" />
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pending</p>
                  <p className="text-3xl font-bold text-foreground">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Approved</p>
                  <p className="text-3xl font-bold text-foreground">{stats.approved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Rejected</p>
                  <p className="text-3xl font-bold text-foreground">{stats.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Submissions List */}
            <div className="lg:col-span-1">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-3 bg-card border border-border">
                  <TabsTrigger value="pending" className="data-[state=active]:bg-primary">
                    Pending ({stats.pending})
                  </TabsTrigger>
                  <TabsTrigger value="approved" className="data-[state=active]:bg-primary">
                    Approved ({stats.approved})
                  </TabsTrigger>
                  <TabsTrigger value="rejected" className="data-[state=active]:bg-primary">
                    Rejected ({stats.rejected})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-4 space-y-3">
                  {filteredSubmissions.map(submission => (
                    <button
                      key={submission.id}
                      onClick={() => setSelectedSubmissionId(submission.id)}
                      className={`w-full text-left p-4 rounded-lg transition border ${
                        selectedSubmissionId === submission.id
                          ? 'bg-primary/20 border-primary'
                          : 'bg-card border-border hover:border-primary'
                      }`}
                    >
                      <h3 className="font-semibold text-foreground line-clamp-1">{submission.title}</h3>
                      <p className="text-sm text-muted-foreground">{submission.director}</p>
                      <p className="text-xs text-muted-foreground mt-1">{submission.submittedAt}</p>
                    </button>
                  ))}
                </TabsContent>

                <TabsContent value="approved" className="mt-4 space-y-3">
                  {filteredSubmissions.map(submission => (
                    <button
                      key={submission.id}
                      onClick={() => setSelectedSubmissionId(submission.id)}
                      className={`w-full text-left p-4 rounded-lg transition border ${
                        selectedSubmissionId === submission.id
                          ? 'bg-primary/20 border-primary'
                          : 'bg-card border-border hover:border-primary'
                      }`}
                    >
                      <h3 className="font-semibold text-foreground line-clamp-1">{submission.title}</h3>
                      <p className="text-sm text-muted-foreground">{submission.director}</p>
                      {submission.averageScore && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-green-400">
                          <span>Score: {submission.averageScore}/5</span>
                        </div>
                      )}
                    </button>
                  ))}
                </TabsContent>

                <TabsContent value="rejected" className="mt-4 space-y-3">
                  {filteredSubmissions.map(submission => (
                    <button
                      key={submission.id}
                      onClick={() => setSelectedSubmissionId(submission.id)}
                      className={`w-full text-left p-4 rounded-lg transition border ${
                        selectedSubmissionId === submission.id
                          ? 'bg-primary/20 border-primary'
                          : 'bg-card border-border hover:border-primary'
                      }`}
                    >
                      <h3 className="font-semibold text-foreground line-clamp-1">{submission.title}</h3>
                      <p className="text-sm text-muted-foreground">{submission.director}</p>
                    </button>
                  ))}
                </TabsContent>
              </Tabs>
            </div>

            {/* Submission Details */}
            {selectedSubmission && (
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-8 bg-card border-border space-y-6">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">{selectedSubmission.title}</h2>
                        <p className="text-muted-foreground">{selectedSubmission.director}</p>
                      </div>
                      <Badge className={`${
                        selectedSubmission.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        selectedSubmission.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
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

                  {selectedSubmission.averageScore && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <p className="text-green-400 font-semibold">
                        Average Judge Score: {selectedSubmission.averageScore}/5
                      </p>
                    </div>
                  )}

                  {selectedSubmission.status === 'pending' && (
                    <div className="flex gap-4 pt-4">
                      <Button
                        onClick={() => handleReject(selectedSubmission.id)}
                        className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleApprove(selectedSubmission.id)}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Approve
                      </Button>
                    </div>
                  )}

                  {selectedSubmission.status !== 'pending' && (
                    <div className={`rounded-lg p-4 border ${
                      selectedSubmission.status === 'approved'
                        ? 'bg-green-500/10 border-green-500/20'
                        : 'bg-red-500/10 border-red-500/20'
                    }`}>
                      <p className={`text-sm font-semibold ${
                        selectedSubmission.status === 'approved' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {selectedSubmission.status === 'approved' 
                          ? '✓ This submission has been approved' 
                          : '✗ This submission has been rejected'}
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
