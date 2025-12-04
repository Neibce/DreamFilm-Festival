'use client'

import { useMemo, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Medal, Award, Crown, CheckCircle, Heart } from "lucide-react"

interface AwardFilm {
    id: string
    title: string
    director: string
    judgeAverageScore: number // 심사위원 평균 점수 (5점 만점)
    audienceRating: number // 관객 투표 점수 (5점 만점)
    audienceVotes: number // 관객 투표 수
}

const MOCK_AWARD_FILMS: AwardFilm[] = [
    {
        id: '1',
        title: '하늘을 나는 도시',
        director: '김윤영',
        judgeAverageScore: 4.5,
        audienceRating: 4.8,
        audienceVotes: 1240
    },
    {
        id: '2',
        title: '기억을 파는 상점',
        director: '양준영',
        judgeAverageScore: 4.5,
        audienceRating: 4.6,
        audienceVotes: 956
    },
    {
        id: '3',
        title: '시간이 멈춘 카페',
        director: '임지우',
        judgeAverageScore: 4.2,
        audienceRating: 4.7,
        audienceVotes: 1120
    },
    {
        id: '4',
        title: 'The Midnight Garden',
        director: 'Sarah Chen',
        judgeAverageScore: 4.3,
        audienceRating: 4.5,
        audienceVotes: 834
    },
    {
        id: '5',
        title: 'Echoes in the Cloud',
        director: 'James Rivera',
        judgeAverageScore: 4.0,
        audienceRating: 4.4,
        audienceVotes: 720
    }
]

export default function AwardAdmin() {
    const router = useRouter()
    const [isFinalized, setIsFinalized] = useState(false)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)

    useEffect(() => {
        const finalized = localStorage.getItem('festivalFinalized') === 'true'
        setIsFinalized(finalized)
    }, [])

    const rankedFilms = useMemo(() => {
        return MOCK_AWARD_FILMS
            .map(film => {
                const judgeScore100 = film.judgeAverageScore * 20
                const audienceScore100 = film.audienceRating * 20
                const finalScore = judgeScore100 * 0.7 + audienceScore100 * 0.3

                return {
                    ...film,
                    judgeScore100,
                    audienceScore100,
                    finalScore
                }
            })
            .sort((a, b) => b.finalScore - a.finalScore)
            .map((film, index) => ({
                ...film,
                rank: index + 1
            }))
    }, [])

    const popularityRankedFilms = useMemo(() => {
        return MOCK_AWARD_FILMS
            .map(film => {
                const audienceScore100 = film.audienceRating * 20
                return {
                    ...film,
                    audienceScore100,
                    popularityScore: audienceScore100
                }
            })
            .sort((a, b) => b.popularityScore - a.popularityScore)
            .map((film, index) => ({
                ...film,
                popularityRank: index + 1
            }))
    }, [])

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />
        if (rank === 2) return <Trophy className="w-6 h-6 text-gray-400" />
        if (rank === 3) return <Trophy className="w-6 h-6 text-amber-600" />
        return null
    }

    const getRankBadgeColor = (rank: number) => {
        if (rank === 1) return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
        if (rank === 2) return "bg-gray-400/20 text-gray-400 border-gray-400/30"
        if (rank === 3) return "bg-amber-600/20 text-amber-600 border-amber-600/30"
        return "bg-primary/20 text-white border-primary/30"
    }

    const handleFinalizeAwards = () => {
        localStorage.setItem('festivalFinalized', 'true')
        localStorage.setItem('awardWinners', JSON.stringify(rankedFilms.slice(0, 3)))
        localStorage.setItem('popularityWinner', JSON.stringify(popularityRankedFilms[0]))
        setIsFinalized(true)
        setShowConfirmDialog(false)
        
        router.push('/awards')
    }

    return (
        <div className="p-6 border-border h-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">수상작 후보</h2>
                {!isFinalized ? (
                    <Button 
                        onClick={() => setShowConfirmDialog(true)}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold"
                    >
                        <Crown className="w-4 h-4 mr-2" />
                        수상작 선정 최종 확정
                    </Button>
                ) : (
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/30 px-4 py-2">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        수상작 확정 완료
                    </Badge>
                )}
            </div>

            {isFinalized && (
                <div className="p-5 rounded-lg w-full bg-green-500/20 border border-green-500/30 mb-6">
                    <p className="text-green-400 font-semibold">
                        ✓ 수상작이 최종 확정되었습니다. 영화제가 종료되어 더 이상 심사가 불가능합니다.
                    </p>
                </div>
            )}

            <div className="space-y-4 mb-6">
                <div className="p-5 rounded-lg w-full bg-blue-500/20">
                    <span className="">
                        <p className="font-bold">&lt;최종 점수 산출 방식&gt;</p>
                        심사위원 평가(70%) + 관객 투표(30%)
                    </span>
                </div>
                <div className="p-5 rounded-lg w-full bg-pink-500/20">
                    <span className="">
                        <p className="font-bold">&lt;인기상 점수 산출 방식&gt;</p>
                        관객 투표(100%)
                    </span>
                </div>
            </div>

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full p-6 bg-card border-border space-y-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                <Crown className="w-8 h-8 text-yellow-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">
                                    수상작 최종 확정
                                </h3>
                                <p className="text-muted-foreground">
                                    이 작업은 되돌릴 수 없습니다. 수상작을 확정하면 영화제가 종료되며, 더 이상 심사위원 평가가 불가능합니다.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-foreground">확정될 수상작:</p>
                            <div className="space-y-2">
                                {rankedFilms.slice(0, 3).map((film, index) => (
                                    <div key={film.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                        <Trophy className={`w-5 h-5 ${
                                            index === 0 ? 'text-yellow-500' :
                                            index === 1 ? 'text-gray-400' :
                                            'text-amber-600'
                                        }`} />
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm text-foreground">{film.title}</p>
                                            <p className="text-xs text-muted-foreground">{film.director}</p>
                                        </div>
                                        <Badge className="text-xs">
                                            {index === 0 ? '대상' : index === 1 ? '우수상' : '장려상'}
                                        </Badge>
                                    </div>
                                ))}
                                <div className="flex items-center gap-3 p-3 bg-pink-500/10 rounded-lg border border-pink-500/30">
                                    <Heart className="w-5 h-5 text-pink-500" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm text-foreground">{popularityRankedFilms[0].title}</p>
                                        <p className="text-xs text-muted-foreground">{popularityRankedFilms[0].director}</p>
                                    </div>
                                    <Badge className="text-xs bg-pink-500/20 text-pink-500">
                                        인기상
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowConfirmDialog(false)}
                                className="flex-1"
                            >
                                취소
                            </Button>
                            <Button
                                onClick={handleFinalizeAwards}
                                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
                            >
                                확정하기
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
            
            {/* 종합 부문 수상작 후보 */}
            <h3 className="text-xl font-bold mb-4">종합 부문 (상위 5개)</h3>
            <div className="grid grid-cols-1 gap-4 mb-8">
                {rankedFilms.slice(0, 5).map((film) => (
                    <Card key={film.id} className="group overflow-hidden p-6 bg-card border-border hover:border-primary transition cursor-pointer">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                                    {getRankIcon(film.rank) || (
                                        <span className="text-2xl font-bold text-primary">{film.rank}</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-foreground transition mb-1">{film.title}</h3>
                                    <p className="text-sm text-muted-foreground">{film.director}</p>
                                </div>
                                <Badge className={getRankBadgeColor(film.rank)}>
                                    {film.rank}위
                                </Badge>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">심사위원 합산 평균 점수</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {film.judgeAverageScore.toFixed(1)}
                                    <span className="text-base text-muted-foreground font-normal">/5.0</span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    ({film.judgeScore100.toFixed(1)}점 만점)
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">관객 투표</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {film.audienceRating.toFixed(1)}
                                    <span className="text-base text-muted-foreground font-normal">/5.0</span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    ({film.audienceVotes.toLocaleString()}명 투표)
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">전체 점수</p>
                                <p className="text-2xl font-bold text-primary">
                                    {film.finalScore.toFixed(1)}
                                    <span className="text-base text-muted-foreground font-normal">/100</span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    (심사위원 {film.judgeScore100.toFixed(1)} × 70% + 관객 {film.audienceScore100.toFixed(1)} × 30%)
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* 인기상 부문 */}
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                인기상 부문 (상위 3개)
            </h3>
            <div className="grid grid-cols-1 gap-4">
                {popularityRankedFilms.slice(0, 3).map((film) => (
                    <div key={film.id} className="relative">
                        {/* 2위, 3위만 카드 위에 배지 표시 */}
                        {(film.popularityRank === 2 || film.popularityRank === 3) && (
                            <div className="flex justify-center mb-2">
                                <Badge className={
                                    film.popularityRank === 2
                                        ? "bg-pink-400/20 text-pink-400 border-pink-400/30"
                                        : "bg-pink-300/20 text-pink-300 border-pink-300/30"
                                }>
                                    인기상 {film.popularityRank}위
                                </Badge>
                            </div>
                        )}
                        <Card className="group overflow-hidden p-6 bg-card border-border hover:border-pink-500 transition cursor-pointer">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-500/10">
                                        {film.popularityRank === 1 ? (
                                            <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                                        ) : (
                                            <span className="text-2xl font-bold text-pink-500">{film.popularityRank}</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-foreground transition mb-1">{film.title}</h3>
                                        <p className="text-sm text-muted-foreground">{film.director}</p>
                                    </div>
                                    {/* 1위만 카드 내부에 배지 표시 */}
                                    {film.popularityRank === 1 && (
                                        <Badge className="bg-pink-500/20 text-pink-500 border-pink-500/30">
                                            인기상
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">관객 투표</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {film.audienceRating.toFixed(1)}
                                    <span className="text-base text-muted-foreground font-normal">/5.0</span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    ({film.audienceVotes.toLocaleString()}명 투표)
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">인기상 점수</p>
                                <p className="text-2xl font-bold text-pink-500">
                                    {film.popularityScore.toFixed(1)}
                                    <span className="text-base text-muted-foreground font-normal">/100</span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    (관객 투표 100%)
                                </p>
                            </div>
                        </div>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    )
}