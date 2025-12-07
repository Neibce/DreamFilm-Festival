'use client'

import { useState, useMemo, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, CircleEllipsis } from "lucide-react"
import { api, resolveImageUrl } from "@/lib/api"
import { useToastStore } from "@/store/toast"

interface Submission {
    id: string
    title: string
    director: string
    genre: string
    status: "pending" | "approved" | "rejected"
    dreamConcept: string
    aiScript?: string
    poster?: string
}

export default function SubmitAdmin() {
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [selectedFilmId, setSelectedFilmId] = useState<string | undefined>(undefined)
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const { show } = useToastStore()

    useEffect(() => {
        let mounted = true
        setLoading(true)
        api.getFilmsAdmin()
            .then((res) => {
                if (!mounted) return
                const mapped: Submission[] = (res as any[]).map((f) => ({
                    id: String(f.filmId),
                    title: f.title,
                    director: f.director?.username
                        ? f.director.username
                        : (f.directorName ? f.directorName : (f.directorId ? `감독 #${f.directorId}` : '감독 미상')),
                    genre: f.genre || '전체',
                    status: f.status === 'SUBMITTED' ? 'approved'
                        : f.status === 'REJECTED' ? 'rejected'
                        : 'pending',
                    dreamConcept: f.dreamText || f.summary || '내용 없음',
                    aiScript: f.aiScript || '',
                    poster: resolveImageUrl(f.imageUrl) || '/placeholder.svg',
                }))
                setSubmissions(mapped)
                if (mapped.length > 0) {
                    setSelectedFilmId(mapped[0].id)
                }
            })
            .catch((err: Error) => {
                if (!mounted) return
                show({ message: err.message || '출품작을 불러오지 못했습니다.', kind: 'error' })
                setSubmissions([])
            })
            .finally(() => {
                if (mounted) setLoading(false)
            })
        return () => { mounted = false }
    }, [show])

    const filteredSubmissions = useMemo(() => {
        return statusFilter === 'all'
            ? submissions
            : submissions.filter(s => s.status === statusFilter)
    }, [submissions, statusFilter])

    const selectedFilm = submissions.find(s => s.id === selectedFilmId)

    const totalCount = submissions.length
    const pendingCount = submissions.filter(s => s.status === 'pending').length
    const approvedCount = submissions.filter(s => s.status === 'approved').length
    const rejectedCount = submissions.filter(s => s.status === 'rejected').length

    useEffect(() => {
        if (filteredSubmissions.length === 0) {
            setSelectedFilmId(undefined)
            return
        }
        const existsInFilter = filteredSubmissions.some(s => s.id === selectedFilmId)
        if (!existsInFilter) {
            setSelectedFilmId(filteredSubmissions[0].id)
        }
    }, [filteredSubmissions, selectedFilmId])

    const handleStatusChange = (id: string, newStatus: "approved" | "rejected") => {
        if (submitting) return
        setSubmitting(true)
        const apiCall = newStatus === 'approved'
            ? api.approveFilmAdmin(id)
            : api.rejectFilmAdmin(id)

        Promise.resolve(apiCall)
            .then(() => {
                setSubmissions(prev => prev.map(s =>
                    s.id === id ? { ...s, status: newStatus } : s
                ))
                show({ message: newStatus === 'approved' ? '승인되었습니다.' : '반려되었습니다.', kind: 'success' })
            })
            .catch((err: Error) => {
                show({ message: err.message || '처리에 실패했습니다.', kind: 'error' })
            })
            .finally(() => setSubmitting(false))
    }

    return (
        <div className="p-6 border-border h-full">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">출품작 심사</h2>
                <p className="text-muted-foreground">출품된 영화들을 검토하고 승인 또는 반려를 결정하세요. 승인된 작품만 심사 단계로 진행됩니다.</p>
            </div>

            {/* Stats / Filter Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {loading ? (
                    <>
                        {[1,2,3,4].map(i => (
                            <Card key={i} className="p-6 bg-card border animate-pulse space-y-3">
                                <div className="h-4 w-24 bg-muted rounded" />
                                <div className="h-8 w-16 bg-muted rounded" />
                            </Card>
                        ))}
                    </>
                ) : (
                    <>
                        <Card
                            role="button"
                            tabIndex={0}
                            onClick={() => setStatusFilter('all')}
                            className={`p-6 bg-card border transition ${
                                statusFilter === 'all'
                                    ? 'border-primary shadow-[0_0_0_2px] shadow-primary/30'
                                    : 'border-border hover:border-primary/60'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">전체 출품작</p>
                                    <p className="text-3xl font-bold text-foreground">{totalCount}</p>
                                </div>
                                <CircleEllipsis className="w-8 h-8 text-primary" />
                            </div>
                        </Card>
                        <Card
                            role="button"
                            tabIndex={0}
                            onClick={() => setStatusFilter('pending')}
                            className={`p-6 bg-card border transition ${
                                statusFilter === 'pending'
                                    ? 'border-yellow-500 shadow-[0_0_0_2px] shadow-yellow-500/30'
                                    : 'border-border hover:border-yellow-500/60'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">심사 대기</p>
                                    <p className="text-3xl font-bold text-yellow-500">{pendingCount}</p>
                                </div>
                                <Clock className="w-8 h-8 text-yellow-500" />
                            </div>
                        </Card>
                        <Card
                            role="button"
                            tabIndex={0}
                            onClick={() => setStatusFilter('approved')}
                            className={`p-6 bg-card border transition ${
                                statusFilter === 'approved'
                                    ? 'border-green-500 shadow-[0_0_0_2px] shadow-green-500/30'
                                    : 'border-border hover:border-green-500/60'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">승인됨</p>
                                    <p className="text-3xl font-bold text-green-500">{approvedCount}</p>
                                </div>
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                        </Card>
                        <Card
                            role="button"
                            tabIndex={0}
                            onClick={() => setStatusFilter('rejected')}
                            className={`p-6 bg-card border transition ${
                                statusFilter === 'rejected'
                                    ? 'border-red-500 shadow-[0_0_0_2px] shadow-red-500/30'
                                    : 'border-border hover:border-red-500/60'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">반려됨</p>
                                    <p className="text-3xl font-bold text-red-500">{rejectedCount}</p>
                                </div>
                                <XCircle className="w-8 h-8 text-red-500" />
                            </div>
                        </Card>
                    </>
                )}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Film List */}
                <div className="lg:col-span-1">
                    <h2 className="text-lg font-semibold text-foreground mb-4">출품작 목록</h2>
                    <div className="space-y-3 max-h-[620px] min-h-[460px] overflow-y-auto pr-1 p-3 scrollbar-elegant rounded-2xl border border-border/60 bg-card/60">
                        {filteredSubmissions.length === 0 ? (
                            <div className="p-6 border border-dashed border-border rounded-lg text-center text-sm text-muted-foreground">
                                선택한 상태에 해당하는 작품이 없습니다.
                            </div>
                        ) : (
                            filteredSubmissions.map((film) => (
                                <button
                                    key={film.id}
                                    onClick={() => setSelectedFilmId(film.id)}
                                    className={`w-full text-left p-4 rounded-lg transition border ${
                                        selectedFilmId === film.id
                                            ? 'bg-primary/20 border-primary'
                                            : 'bg-card border-border hover:border-primary'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold text-foreground line-clamp-1">{film.title}</h3>
                                        {film.status === 'pending' && (
                                            <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">심사 대기</Badge>
                                        )}
                                        {film.status === 'approved' && (
                                            <Badge className="bg-green-500/20 text-green-400 text-xs">승인됨</Badge>
                                        )}
                                        {film.status === 'rejected' && (
                                            <Badge className="bg-red-500/20 text-red-400 text-xs">반려됨</Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{film.director}</p>
                                    <p className="text-xs text-muted-foreground/70 mt-1">{film.submittedAt}</p>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Film Detail & Approval */}
                {selectedFilm && (
                    <div className="lg:col-span-2 space-y-6">
                        {/* Film Card */}
                        <Card className="overflow-hidden bg-card border-border pt-0">
                            <div className="aspect-[4/5] w-full overflow-hidden bg-muted">
                                <img
                                    src={selectedFilm.poster || "/placeholder.svg"}
                                    alt={selectedFilm.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">{selectedFilm.title}</h2>
                                    <p className="text-muted-foreground">{selectedFilm.director}</p>
                                </div>

                                <div className="flex gap-4">
                                    <Badge className="bg-primary/20 text-primary">{selectedFilm.genre}</Badge>
                                    {selectedFilm.status === 'approved' && (
                                        <Badge className="bg-green-500/20 text-green-400">
                                            승인 완료
                                        </Badge>
                                    )}
                                    {selectedFilm.status === 'rejected' && (
                                        <Badge className="bg-red-500/20 text-red-400">
                                            반려됨
                                        </Badge>
                                    )}
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground mb-2 uppercase font-semibold">Dream Concept</p>
                                    <p className="text-foreground leading-relaxed">{selectedFilm.dreamConcept}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground uppercase font-semibold">AI 시나리오</p>
                                    <div className="text-foreground leading-relaxed whitespace-pre-wrap space-y-3">
                                        {selectedFilm.aiScript && selectedFilm.aiScript.trim().length > 0 ? (
                                            selectedFilm.aiScript.split('\n\n').map((paragraph, idx) => (
                                                <p key={idx}>{paragraph}</p>
                                            ))
                                        ) : (
                                            <p className="text-muted-foreground">AI 시나리오 정보가 없습니다.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Approval Section */}
                        {selectedFilm.status === 'pending' && (
                            <Card className="p-6 bg-card border-border space-y-6">
                                <h3 className="text-lg font-bold text-foreground">심사 결정</h3>
                                <p className="text-sm text-muted-foreground">
                                    이 작품을 검토한 후 승인 또는 반려를 결정하세요. 승인된 작품만 심사 단계로 진행되어 점수를 매길 수 있습니다.
                                </p>

                                <div className="pt-4 flex gap-3">
                                    <Button
                                        onClick={() => handleStatusChange(selectedFilm.id, 'approved')}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        승인하기
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleStatusChange(selectedFilm.id, 'rejected')}
                                        className="flex-1 border-red-500/50 bg-red-500 text-white hover:bg-red-600"
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        반려하기
                                    </Button>
                                </div>
                            </Card>
                        )}

                        {selectedFilm.status === 'approved' && (
                            <Card className="p-6 bg-card border-border space-y-4">
                                <h3 className="text-lg font-bold text-foreground">처리 완료</h3>
                                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                        <p className="text-sm text-green-400 font-semibold">
                                            이 작품은 승인되었습니다. 이제 심사 단계에서 점수를 매길 수 있습니다.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {selectedFilm.status === 'rejected' && (
                            <Card className="p-6 bg-card border-border space-y-4">
                                <h3 className="text-lg font-bold text-foreground">처리 완료</h3>
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="w-5 h-5 text-red-400" />
                                        <p className="text-sm text-red-400 font-semibold">
                                            이 작품은 반려되었습니다.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                )}

                {!selectedFilm && (
                    <div className="lg:col-span-2 flex items-center justify-center text-muted-foreground bg-muted/10 rounded-lg border border-dashed min-h-[400px]">
                        <p>왼쪽 목록에서 영화를 선택해주세요.</p>
                    </div>
                )}
            </div>
        </div>
    )
}