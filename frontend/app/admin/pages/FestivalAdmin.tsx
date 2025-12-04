'use client'

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Edit2, CheckCircle, Clock, Film } from "lucide-react"

interface Festival {
    id: string
    name: string
    year: number
    status: 'ongoing' | 'completed'
    submissionStart: string
    submissionEnd: string
    judgingStart: string
    judgingEnd: string
    announcementDate: string
    totalSubmissions: number
    approvedSubmissions: number
}

const MOCK_FESTIVALS: Festival[] = [
    {
        id: '1',
        name: '제13회 Dream Film Festival',
        year: 2025,
        status: 'ongoing',
        submissionStart: '2025-01-01',
        submissionEnd: '2025-03-31',
        judgingStart: '2025-04-01',
        judgingEnd: '2025-05-31',
        announcementDate: '2025-06-15',
        totalSubmissions: 45,
        approvedSubmissions: 32
    },
    {
        id: '2',
        name: '제12회 Dream Film Festival',
        year: 2024,
        status: 'completed',
        submissionStart: '2024-01-01',
        submissionEnd: '2024-03-31',
        judgingStart: '2024-04-01',
        judgingEnd: '2024-05-31',
        announcementDate: '2024-06-15',
        totalSubmissions: 38,
        approvedSubmissions: 28
    },
    {
        id: '3',
        name: '제11회 Dream Film Festival',
        year: 2023,
        status: 'completed',
        submissionStart: '2023-01-01',
        submissionEnd: '2023-03-31',
        judgingStart: '2023-04-01',
        judgingEnd: '2023-05-31',
        announcementDate: '2023-06-15',
        totalSubmissions: 32,
        approvedSubmissions: 25
    }
]

export default function FestivalAdmin() {
    const [festivals, setFestivals] = useState<Festival[]>(MOCK_FESTIVALS)
    const [editingFestivalId, setEditingFestivalId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState<Partial<Festival>>({})

    const handleEditFestival = (festival: Festival) => {
        setEditingFestivalId(festival.id)
        setEditForm({
            submissionStart: festival.submissionStart,
            submissionEnd: festival.submissionEnd,
            judgingStart: festival.judgingStart,
            judgingEnd: festival.judgingEnd,
            announcementDate: festival.announcementDate
        })
    }

    const handleSaveEdit = (festivalId: string) => {
        setFestivals(festivals.map(festival =>
            festival.id === festivalId
                ? { ...festival, ...editForm }
                : festival
        ))
        setEditingFestivalId(null)
        setEditForm({})
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

    return (
        <div className="p-6 border-border h-full">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">영화제 관리</h2>
                <p className="text-muted-foreground">지난 영화제 및 현재 영화제를 관리하세요.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
            </div>

            {/* Festivals List */}
            <div className="space-y-6">
                {/* Ongoing Festivals */}
                {ongoingFestivals.length > 0 && (
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
                                                    {festival.name}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <Badge className={statusBadge.color}>
                                                        {statusBadge.text}
                                                    </Badge>
                                                    <Badge className="bg-primary/20 text-primary">
                                                        {festival.year}년
                                                    </Badge>
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
                                                            출품 시작일
                                                        </Label>
                                                        <Input
                                                            type="date"
                                                            value={editForm.submissionStart}
                                                            onChange={(e) => handleInputChange('submissionStart', e.target.value)}
                                                            className="bg-background"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm font-semibold mb-2 block">
                                                            출품 마감일
                                                        </Label>
                                                        <Input
                                                            type="date"
                                                            value={editForm.submissionEnd}
                                                            onChange={(e) => handleInputChange('submissionEnd', e.target.value)}
                                                            className="bg-background"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm font-semibold mb-2 block">
                                                            심사 시작일
                                                        </Label>
                                                        <Input
                                                            type="date"
                                                            value={editForm.judgingStart}
                                                            onChange={(e) => handleInputChange('judgingStart', e.target.value)}
                                                            className="bg-background"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm font-semibold mb-2 block">
                                                            심사 마감일
                                                        </Label>
                                                        <Input
                                                            type="date"
                                                            value={editForm.judgingEnd}
                                                            onChange={(e) => handleInputChange('judgingEnd', e.target.value)}
                                                            className="bg-background"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <Label className="text-sm font-semibold mb-2 block">
                                                            수상작 발표일
                                                        </Label>
                                                        <Input
                                                            type="date"
                                                            value={editForm.announcementDate}
                                                            onChange={(e) => handleInputChange('announcementDate', e.target.value)}
                                                            className="bg-background"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 pt-2">
                                                    <Button 
                                                        onClick={() => handleSaveEdit(festival.id)}
                                                        className="bg-primary hover:bg-primary/90"
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
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">출품 기간</p>
                                                        <p className="text-sm font-semibold text-foreground">
                                                            {festival.submissionStart} ~ {festival.submissionEnd}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">심사 기간</p>
                                                        <p className="text-sm font-semibold text-foreground">
                                                            {festival.judgingStart} ~ {festival.judgingEnd}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 md:col-span-2">
                                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">수상작 발표</p>
                                                        <p className="text-sm font-semibold text-foreground">
                                                            {festival.announcementDate}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Completed Festivals */}
                {completedFestivals.length > 0 && (
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
                                                    {festival.name}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <Badge className={statusBadge.color}>
                                                        {statusBadge.text}
                                                    </Badge>
                                                    <Badge className="bg-muted text-muted-foreground">
                                                        {festival.year}년
                                                    </Badge>
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
                                            <p>수상작 발표일: {festival.announcementDate}</p>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
