'use client'

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Edit2, CheckCircle, Clock, Film, Plus } from "lucide-react"
import { api } from "@/lib/api"
import { useToastStore } from "@/store/toast"

interface Festival {
    id: string
    name: string
    status: 'ongoing' | 'completed'
    startDate: string
    endDate: string
    totalSubmissions: number
    approvedSubmissions: number
}

export default function FestivalAdmin() {
    const [festivals, setFestivals] = useState<Festival[]>([])
    const [editingFestivalId, setEditingFestivalId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState<Partial<Festival>>({})
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [newFestival, setNewFestival] = useState({ name: '', startDate: '', endDate: '' })
    const { show } = useToastStore()

    // 초기 로드 시 진행중인 영화제의 기간을 localStorage에 저장
    useEffect(() => {
        const ongoingFestival = festivals.find(f => f.status === 'ongoing')
        if (ongoingFestival && ongoingFestival.startDate && ongoingFestival.endDate) {
            localStorage.setItem('currentFestivalPeriod', JSON.stringify({
                startDate: ongoingFestival.startDate,
                endDate: ongoingFestival.endDate
            }))
        }
    }, [festivals])

    useEffect(() => {
        let mounted = true
        setLoading(true)
        api.getFestivals()
            .then(async (res) => {
                if (!mounted) return
                const today = new Date()
                const mapped = await Promise.all((res as any[]).map(async (f): Promise<Festival> => {
                    const stats = await api.getFestivalStats(f.festivalId).catch(() => ({} as any))
                    const totalSubmissions = (stats as any)?.totalFilms ?? 0
                    const approvedSubmissions = (stats as any)?.submittedFilms ?? 0
                    const startDateStr = f.startDate ?? ''
                    const endDateStr = f.endDate ?? ''
                    const status: 'ongoing' | 'completed' = (() => {
                        if (!startDateStr || !endDateStr) return 'completed'
                        const end = new Date(endDateStr)
                        return end >= today ? 'ongoing' : 'completed'
                    })()
                    const festival = {
                        id: String(f.festivalId),
                        name: f.festivalName,
                        status,
                        startDate: startDateStr,
                        endDate: endDateStr,
                        totalSubmissions,
                        approvedSubmissions,
                    } satisfies Festival
                    return festival
                }))
                setFestivals(mapped)
            })
            .catch((err: Error) => {
                if (!mounted) return
                show({ message: err.message || '영화제 정보를 불러오지 못했습니다.', kind: 'error' })
                setFestivals([])
            })
            .finally(() => {
                if (mounted) setLoading(false)
            })
        return () => { mounted = false }
    }, [show])

    const handleEditFestival = (festival: Festival) => {
        setEditingFestivalId(festival.id)
        setEditForm({
            startDate: festival.startDate,
            endDate: festival.endDate
        })
    }

    const handleSaveEdit = (festivalId: string) => {
        if (submitting) return
        if (!editForm.startDate || !editForm.endDate) {
            show({ message: '시작일과 종료일을 입력하세요.', kind: 'error' })
            return
        }
        const payload = {
            festivalName: festivals.find(f => f.id === festivalId)?.name || '',
            startDate: editForm.startDate,
            endDate: editForm.endDate,
        }
        setSubmitting(true)
        api.updateFestival(festivalId, payload)
            .then((updated: any) => {
                const updatedFestivals = festivals.map(festival =>
                    festival.id === festivalId
                        ? {
                            ...festival,
                            name: updated.festivalName,
                            startDate: updated.startDate,
                            endDate: updated.endDate,
                            status: new Date(updated.endDate) >= new Date() ? 'ongoing' : 'completed'
                        }
                        : festival
                )
                setFestivals(updatedFestivals)
                const updatedFestival = updatedFestivals.find(f => f.id === festivalId && f.status === 'ongoing')
                if (updatedFestival) {
                    localStorage.setItem('currentFestivalPeriod', JSON.stringify({
                        startDate: updatedFestival.startDate,
                        endDate: updatedFestival.endDate
                    }))
                }
                setEditingFestivalId(null)
                setEditForm({})
                show({ message: '영화제 일정이 수정되었습니다.', kind: 'success' })
            })
            .catch((err: Error) => {
                show({ message: err.message || '영화제 수정에 실패했습니다.', kind: 'error' })
            })
            .finally(() => setSubmitting(false))
    }

    const handleCancelEdit = () => {
        setEditingFestivalId(null)
        setEditForm({})
    }

    const handleInputChange = (field: keyof Festival, value: string) => {
        setEditForm(prev => ({ ...prev, [field]: value }))
    }

    const getStatusBadge = (status: Festival['status']) => {
        if (status === 'ongoing') {
            return { text: '진행중', color: 'bg-blue-500/20 text-blue-500 border-blue-500/30' }
        }
        return { text: '종료됨', color: 'bg-gray-500/20 text-gray-500 border-gray-500/30' }
    }

    const ongoingFestivals = festivals.filter(f => f.status === 'ongoing')
    const completedFestivals = festivals.filter(f => f.status === 'completed')

    const formatDate = (value: string) => {
        if (!value) return ''
        const date = new Date(value)
        if (Number.isNaN(date.getTime())) return value
        const yyyy = date.getFullYear()
        const mm = String(date.getMonth() + 1).padStart(2, '0')
        const dd = String(date.getDate()).padStart(2, '0')
        return `${yyyy}/${mm}/${dd}`
    }

    return (
        <div className="p-6 border-border h-full">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">영화제 관리</h2>
                <p className="text-muted-foreground">지난 영화제 및 현재 영화제를 관리하세요.</p>
            </div>

            {/* Create New Festival */}
            <Card className="p-6 bg-card border-border mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Plus className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold text-foreground">새 영화제 개최</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label className="text-sm font-semibold mb-2 block">영화제 이름</Label>
                        <Input
                            value={newFestival.name}
                            onChange={(e) => setNewFestival(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="예: 2025 제4회"
                            className="bg-background"
                        />
                    </div>
                    <div>
                        <Label className="text-sm font-semibold mb-2 block">시작일</Label>
                        <Input
                            type="date"
                            value={newFestival.startDate}
                            onChange={(e) => setNewFestival(prev => ({ ...prev, startDate: e.target.value }))}
                            className="bg-background"
                        />
                    </div>
                    <div>
                        <Label className="text-sm font-semibold mb-2 block">종료일</Label>
                        <Input
                            type="date"
                            value={newFestival.endDate}
                            onChange={(e) => setNewFestival(prev => ({ ...prev, endDate: e.target.value }))}
                            className="bg-background"
                        />
                    </div>
                </div>
                <div className="mt-4 flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setNewFestival({ name: '', startDate: '', endDate: '' })}>
                        초기화
                    </Button>
                    <Button
                        onClick={() => {
                            if (submitting) return
                            if (!newFestival.name || !newFestival.startDate || !newFestival.endDate) {
                                show({ message: '이름과 기간을 모두 입력하세요.', kind: 'error' })
                                return
                            }
                            setSubmitting(true)
                            api.createFestival({
                                festivalName: newFestival.name,
                                startDate: newFestival.startDate,
                                endDate: newFestival.endDate,
                            })
                                .then(async (created: any) => {
                                    const stats = await api.getFestivalStats(created.festivalId).catch(() => ({} as any))
                                    const today = new Date()
                                    const status = new Date(created.endDate) >= today ? 'ongoing' : 'completed'
                                    const newItem: Festival = {
                                        id: String(created.festivalId),
                                        name: created.festivalName,
                                        status,
                                        startDate: created.startDate,
                                        endDate: created.endDate,
                                        totalSubmissions: (stats as any)?.totalFilms ?? 0,
                                        approvedSubmissions: (stats as any)?.submittedFilms ?? 0,
                                    }
                                    setFestivals(prev => [newItem, ...prev])
                                    setNewFestival({ name: '', startDate: '', endDate: '' })
                                    show({ message: '새 영화제가 추가되었습니다.', kind: 'success' })
                                })
                                .catch((err: Error) => {
                                    show({ message: err.message || '영화제 추가에 실패했습니다.', kind: 'error' })
                                })
                                .finally(() => setSubmitting(false))
                        }}
                        className="bg-primary text-primary-foreground"
                    >
                        영화제 개최
                    </Button>
                </div>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {loading ? (
                    <>
                        {[1,2,3].map(i => (
                            <Card key={i} className="p-6 bg-card border-border animate-pulse space-y-3">
                                <div className="h-4 w-24 bg-muted rounded" />
                                <div className="h-8 w-20 bg-muted rounded" />
                            </Card>
                        ))}
                    </>
                ) : (
                    <>
                        <Card className="p-6 bg-card border-border">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">전체 영화제</p>
                                <Film className="w-5 h-5 text-primary" />
                            </div>
                            <p className="text-3xl font-bold text-foreground">{festivals.length}</p>
                        </Card>
                        <Card className="p-6 bg-card border-border">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">진행중</p>
                                <Clock className="w-5 h-5 text-blue-500" />
                            </div>
                            <p className="text-3xl font-bold text-blue-500">{ongoingFestivals.length}</p>
                        </Card>
                        <Card className="p-6 bg-card border-border">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">종료됨</p>
                                <CheckCircle className="w-5 h-5 text-gray-500" />
                            </div>
                            <p className="text-3xl font-bold text-gray-500">{completedFestivals.length}</p>
                        </Card>
                    </>
                )}
            </div>

            {/* Festivals List */}
            <div className="space-y-6">
                {/* Ongoing Festivals */}
                {loading ? (
                    <div className="space-y-4">
                        {[1,2].map(i => (
                            <Card key={i} className="p-6 bg-card border-border animate-pulse space-y-4">
                                <div className="h-6 w-48 bg-muted rounded" />
                                <div className="h-4 w-32 bg-muted rounded" />
                                <div className="h-4 w-24 bg-muted rounded" />
                                <div className="h-20 w-full bg-muted rounded" />
                            </Card>
                        ))}
                    </div>
                ) : ongoingFestivals.length > 0 ? (
                    <div>
                        <h3 className="text-xl font-bold mb-4">진행중인 영화제</h3>
                        <div className="space-y-4">
                            {ongoingFestivals.map((festival) => {
                                const statusBadge = getStatusBadge(festival.status)
                                const isEditing = editingFestivalId === festival.id

                                return (
                                    <Card key={festival.id} className="p-6 bg-card border-border border-blue-500/30">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-2xl font-bold text-foreground mb-2">
                                                    {festival.name ? `${festival.name} Dream Film Festival` : 'Dream Film Festival'}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <Badge className={statusBadge.color}>
                                                        {statusBadge.text}
                                                    </Badge>
                                                    {festival.startDate && (
                                                        <Badge className="bg-primary/20 text-primary">
                                                            {new Date(festival.startDate).getFullYear()}년
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            {!isEditing && festival.status === 'ongoing' && (
                                                <Button 
                                                    onClick={() => handleEditFestival(festival)}
                                                    variant="outline"
                                                >
                                                    <Edit2 className="w-4 h-4 mr-2" />
                                                    일정 수정
                                                </Button>
                                            )}
                                        </div>

                                        {/* Festival Stats */}
                                        <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-border">
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">총 출품작</p>
                                                <p className="text-2xl font-bold text-foreground">{festival.totalSubmissions}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">승인된 작품</p>
                                                <p className="text-2xl font-bold text-primary">{festival.approvedSubmissions}</p>
                                            </div>
                                        </div>

                                        {/* Schedule */}
                                        {isEditing ? (
                                            <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <Label className="text-sm font-semibold mb-2 block">
                                                            영화제 시작일
                                                        </Label>
                                                        <Input
                                                            type="date"
                                                            value={editForm.startDate}
                                                            onChange={(e) => handleInputChange('startDate', e.target.value)}
                                                            className="bg-background"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm font-semibold mb-2 block">
                                                            영화제 종료일
                                                        </Label>
                                                        <Input
                                                            type="date"
                                                            value={editForm.endDate}
                                                            onChange={(e) => handleInputChange('endDate', e.target.value)}
                                                            className="bg-background"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 pt-2">
                                                    <Button 
                                                        onClick={() => handleSaveEdit(festival.id)}
                                                        className="bg-primary hover:bg-primary/90"
                                                        disabled={submitting}
                                                    >
                                                        저장
                                                    </Button>
                                                    <Button 
                                                        onClick={handleCancelEdit}
                                                        variant="outline"
                                                    >
                                                        취소
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground">영화제 기간</p>
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {formatDate(festival.startDate)} ~ {formatDate(festival.endDate)}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="text-muted-foreground">진행중인 영화제가 없습니다.</div>
                )}

                {/* Completed Festivals */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1,2].map(i => (
                            <Card key={i} className="p-6 bg-card border-border animate-pulse space-y-4">
                                <div className="h-5 w-40 bg-muted rounded" />
                                <div className="h-4 w-24 bg-muted rounded" />
                                <div className="h-4 w-20 bg-muted rounded" />
                                <div className="h-16 w-full bg-muted rounded" />
                            </Card>
                        ))}
                    </div>
                ) : completedFestivals.length > 0 ? (
                    <div>
                        <h3 className="text-xl font-bold mb-4">지난 영화제</h3>
                        <div className="space-y-4">
                            {completedFestivals.map((festival) => {
                                const statusBadge = getStatusBadge(festival.status)

                                return (
                                    <Card key={festival.id} className="p-6 bg-card border-border">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-foreground mb-2">
                                                    {festival.name ? `${festival.name} Dream Film Festival` : 'Dream Film Festival'}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <Badge className={statusBadge.color}>
                                                        {statusBadge.text}
                                                    </Badge>
                                                    {festival.startDate && (
                                                        <Badge className="bg-muted text-muted-foreground">
                                                            {new Date(festival.startDate).getFullYear()}년
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Festival Stats */}
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">총 출품작</p>
                                                <p className="text-xl font-bold text-foreground">{festival.totalSubmissions}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">승인된 작품</p>
                                                <p className="text-xl font-bold text-foreground">{festival.approvedSubmissions}</p>
                                            </div>
                                        </div>

                                        <div className="text-sm text-muted-foreground pt-4 border-t border-border">
                                            <p>영화제 기간: {formatDate(festival.startDate)} ~ {formatDate(festival.endDate)}</p>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="text-muted-foreground">지난 영화제가 없습니다.</div>
                )}
            </div>
        </div>
    )
}
