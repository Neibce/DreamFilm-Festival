'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, User } from "lucide-react"

interface Judge {
    id: string
    name: string
    email: string
    totalFilms: number
    reviewedFilms: number
    pendingFilms: number
    completionRate: number
}

// Mock data
const MOCK_JUDGES: Judge[] = [
    {
        id: '1',
        name: '김민준',
        email: 'minjun.kim@dreamfilm.com',
        totalFilms: 10,
        reviewedFilms: 8,
        pendingFilms: 2,
        completionRate: 80
    },
    {
        id: '2',
        name: '이서연',
        email: 'seoyeon.lee@dreamfilm.com',
        totalFilms: 10,
        reviewedFilms: 10,
        pendingFilms: 0,
        completionRate: 100
    },
    {
        id: '3',
        name: '박지훈',
        email: 'jihoon.park@dreamfilm.com',
        totalFilms: 10,
        reviewedFilms: 5,
        pendingFilms: 5,
        completionRate: 50
    },
    {
        id: '4',
        name: '최유진',
        email: 'yujin.choi@dreamfilm.com',
        totalFilms: 10,
        reviewedFilms: 7,
        pendingFilms: 3,
        completionRate: 70
    },
    {
        id: '5',
        name: '정민우',
        email: 'minwoo.jung@dreamfilm.com',
        totalFilms: 10,
        reviewedFilms: 3,
        pendingFilms: 7,
        completionRate: 30
    }
]

export default function JudgeProgress() {
    const averageCompletion = Math.round(
        MOCK_JUDGES.reduce((sum, judge) => sum + judge.completionRate, 0) / MOCK_JUDGES.length
    )
    const totalReviewed = MOCK_JUDGES.reduce((sum, judge) => sum + judge.reviewedFilms, 0)
    const totalPending = MOCK_JUDGES.reduce((sum, judge) => sum + judge.pendingFilms, 0)

    const getProgressColor = (rate: number) => {
        if (rate === 100) return 'bg-green-500'
        if (rate >= 70) return 'bg-blue-500'
        if (rate >= 50) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    const getStatusBadge = (rate: number) => {
        if (rate === 100) return { text: '완료', color: 'bg-green-500/20 text-green-500' }
        if (rate >= 70) return { text: '양호', color: 'bg-blue-500/20 text-blue-500' }
        if (rate >= 50) return { text: '진행중', color: 'bg-yellow-500/20 text-yellow-500' }
        return { text: '지연', color: 'bg-red-500/20 text-red-500' }
    }

    return (
        <div className="p-6 border-border h-full">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">심사 진행률</h2>
                <p className="text-muted-foreground">각 심사위원의 작품 심사 진행 상황을 확인하세요.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className="p-6 bg-card border-border">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">평균 완료율</p>
                        <CheckCircle className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">{averageCompletion}%</p>
                </Card>
                <Card className="p-6 bg-card border-border">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">총 심사 완료</p>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">{totalReviewed}</p>
                    <p className="text-xs text-muted-foreground mt-1">작품</p>
                </Card>
                <Card className="p-6 bg-card border-border">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">심사 대기중</p>
                        <Clock className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">{totalPending}</p>
                    <p className="text-xs text-muted-foreground mt-1">작품</p>
                </Card>
            </div>

            {/* Judge Progress List */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">심사위원별 진행 현황</h3>
                {MOCK_JUDGES.map((judge) => {
                    const statusBadge = getStatusBadge(judge.completionRate)
                    return (
                        <Card key={judge.id} className="p-6 bg-card border-border">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">{judge.name}</h3>
                                        <p className="text-sm text-muted-foreground">{judge.email}</p>
                                    </div>
                                </div>
                                <Badge className={statusBadge.color}>
                                    {statusBadge.text}
                                </Badge>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">진행률</span>
                                    <span className="font-bold text-foreground">
                                        {judge.reviewedFilms} / {judge.totalFilms} 작품 ({judge.completionRate}%)
                                    </span>
                                </div>
                                
                                <div className="relative">
                                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                                        <div 
                                            className={`h-full ${getProgressColor(judge.completionRate)} transition-all duration-500`}
                                            style={{ width: `${judge.completionRate}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">심사 완료</p>
                                            <p className="text-sm font-bold text-foreground">{judge.reviewedFilms}개</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-yellow-500" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">심사 대기</p>
                                            <p className="text-sm font-bold text-foreground">{judge.pendingFilms}개</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
