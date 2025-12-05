'use client'

import { useState, useEffect } from "react"
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
    startDate: string
    endDate: string
    totalSubmissions: number
    approvedSubmissions: number
}

const MOCK_FESTIVALS: Festival[] = [
    {
        id: '1',
        name: '제3회 Dream Film Festival',
        year: 2025,
        status: 'ongoing',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        totalSubmissions: 45,
        approvedSubmissions: 32
    },
    {
        id: '2',
        name: '제2회 Dream Film Festival',
        year: 2024,
        status: 'completed',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        totalSubmissions: 38,
        approvedSubmissions: 28
    },
    {
        id: '3',
        name: '제1회 Dream Film Festival',
        year: 2023,
        status: 'completed',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        totalSubmissions: 32,
        approvedSubmissions: 25
    }
]

export default function FestivalAdmin() {
    const [festivals, setFestivals] = useState<Festival[]>(MOCK_FESTIVALS)
    const [editingFestivalId, setEditingFestivalId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState<Partial<Festival>>({})

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

    const handleEditFestival = (festival: Festival) => {
        setEditingFestivalId(festival.id)
        setEditForm({
            startDate: festival.startDate,
            endDate: festival.endDate
        })
    }

    const handleSaveEdit = (festivalId: string) => {
        const updatedFestivals = festivals.map(festival =>
            festival.id === festivalId
                ? { ...festival, ...editForm }
                : festival
        )
        setFestivals(updatedFestivals)
        
        // 진행중인 영화제의 기간을 localStorage에 저장
        const updatedFestival = updatedFestivals.find(f => f.id === festivalId && f.status === 'ongoing')
        if (updatedFestival && editForm.startDate && editForm.endDate) {
            localStorage.setItem('currentFestivalPeriod', JSON.stringify({
                startDate: editForm.startDate,
                endDate: editForm.endDate
            }))
        }
        
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
                                                        {festival.startDate} ~ {festival.endDate}
                                                    </p>
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
                                            <p>영화제 기간: {festival.startDate} ~ {festival.endDate}</p>
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
