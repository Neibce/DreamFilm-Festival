'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Award, Crown, Star, Users, Heart } from 'lucide-react'
import { useEffect, useState } from 'react'

interface AwardWinner {
    id: string
    rank: number
    title: string
    director: string
    genre?: string
    image?: string
    judgeAverageScore: number
    audienceRating: number
    audienceVotes: number
    finalScore: number
    dreamSummary?: string
}

interface PopularityWinner {
    id: string
    title: string
    director: string
    audienceRating: number
    audienceVotes: number
    popularityScore: number
}

const MOCK_WINNERS: AwardWinner[] = [
    {
        id: '1',
        rank: 1,
        title: '하늘을 나는 도시',
        director: '김윤영',
        genre: '판타지',
        image: '/fantasy-film-poster.jpg',
        judgeAverageScore: 4.5,
        audienceRating: 4.8,
        audienceVotes: 1240,
        finalScore: 90.0,
        dreamSummary: '도시가 하늘로 떠오르는 초현실적인 세계를 그린 판타지 드라마'
    },
    {
        id: '2',
        rank: 2,
        title: '기억을 파는 상점',
        director: '양준영',
        genre: 'SF',
        image: '/sci-fi-movie-poster.png',
        judgeAverageScore: 4.5,
        audienceRating: 4.6,
        audienceVotes: 956,
        finalScore: 90.6,
        dreamSummary: '기억을 사고파는 미래 사회의 어두운 이면을 다룬 SF 스릴러'
    },
    {
        id: '3',
        rank: 3,
        title: '시간이 멈춘 카페',
        director: '임지우',
        genre: '드라마',
        image: '/drama-film-poster.jpg',
        judgeAverageScore: 4.2,
        audienceRating: 4.7,
        audienceVotes: 1120,
        finalScore: 87.0,
        dreamSummary: '시간이 멈춘 카페에서 펼쳐지는 따뜻한 인간 드라마'
    }
]

export default function AwardsPage() {
    const [winners, setWinners] = useState<AwardWinner[]>(MOCK_WINNERS)
    const [popularityWinner, setPopularityWinner] = useState<PopularityWinner | null>(null)

    // localStorage에서 수상작 데이터 가져오기
    useEffect(() => {
        const savedWinners = localStorage.getItem('awardWinners')
        const savedPopularityWinner = localStorage.getItem('popularityWinner')
        
        if (savedWinners) {
            setWinners(JSON.parse(savedWinners))
        }
        if (savedPopularityWinner) {
            setPopularityWinner(JSON.parse(savedPopularityWinner))
        }
    }, [])

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Trophy className="w-12 h-12 text-yellow-500" />
        if (rank === 2) return <Trophy className="w-12 h-12 text-gray-400" />
        if (rank === 3) return <Trophy className="w-12 h-12 text-amber-600" />
        return null
    }

    const getRankBadge = (rank: number) => {
        if (rank === 1) return { text: '대상', color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' }
        if (rank === 2) return { text: '우수상', color: 'bg-gray-400/20 text-[16px] text-gray-400 border-gray-400/30 px-4 py-1' }
        if (rank === 3) return { text: '장려상', color: 'bg-amber-600/20 text-[16px] text-amber-600 border-amber-600/30 px-4 py-1' }
        return { text: `${rank}위`, color: 'bg-primary/20 text-primary border-primary/30' }
    }

    const topWinner = winners[0]
    const otherWinners = winners.slice(1)

    return (
        <main className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <section className="pt-20 pb-12 px-4 md:px-6 lg:px-8 border-b border-border bg-gradient-to-b from-primary/5 to-background">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex justify-center mb-6">
                        <Crown className="w-16 h-16 text-yellow-500" />
                    </div>
                    <h1 className="font-clipartkorea text-4xl md:text-6xl font-extrabold text-foreground mb-4">
                        2025 제13회 Dream Film Festival
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
                        수상작 발표
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        심사위원 평가와 관객 투표를 종합하여 선정된 최종 수상작을 공개합니다.
                    </p>
                </div>
            </section>

            {/* Grand Prize Winner */}
            <section className="py-12 px-4 md:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8">
                        <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 text-lg px-6 py-2 mb-4">
                            🏆 대상
                        </Badge>
                        <h2 className="text-3xl font-bold text-foreground mb-2">Grand Prize Winner</h2>
                    </div>

                    <Card className="overflow-hidden bg-gradient-to-br from-yellow-500/10 via-background to-background border-yellow-500/30 hover:shadow-2xl hover:shadow-yellow-500/40 hover:ring-1 hover:ring-yellow-500/20">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                            {/* Image */}
                            <div className="relative h-96 lg:h-auto overflow-hidden bg-muted">
                                <img
                                    src={topWinner.image || "/placeholder.svg"}
                                    alt={topWinner.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                                <div className="absolute bottom-6 left-6">
                                    <Trophy className="w-16 h-16 text-yellow-500" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 lg:p-12 space-y-6">
                                <div>
                                    <h3 className="text-4xl font-bold text-foreground mb-2">{topWinner.title}</h3>
                                    <p className="text-xl text-muted-foreground">{topWinner.director}</p>
                                </div>

                                <Badge className="bg-primary/20 text-primary text-sm">
                                    {topWinner.genre}
                                </Badge>

                                <p className="text-muted-foreground leading-relaxed">
                                    {topWinner.dreamSummary}
                                </p>

                                <div className="grid grid-cols-2 gap-6 pt-4">
                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                            <Star className="w-4 h-4" />
                                            심사위원 평가
                                        </div>
                                        <p className="text-3xl font-bold text-foreground">
                                            {topWinner.judgeAverageScore.toFixed(1)}
                                            <span className="text-lg text-muted-foreground font-normal">/5.0</span>
                                        </p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                            <Users className="w-4 h-4" />
                                            관객 투표
                                        </div>
                                        <p className="text-3xl font-bold text-foreground">
                                            {topWinner.audienceRating.toFixed(1)}
                                            <span className="text-lg text-muted-foreground font-normal">/5.0</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border">
                                    <p className="text-sm text-muted-foreground mb-2">최종 점수</p>
                                    <p className="text-4xl font-bold text-yellow-500">
                                        {topWinner.finalScore.toFixed(1)}
                                        <span className="text-xl text-muted-foreground font-normal">/100</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        심사위원 평가 70% + 관객 투표 30%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Other Winners */}
            <section className="py-12 px-4 md:px-6 lg:px-8 bg-muted/20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {otherWinners.map((winner) => {
                            const rankBadge = getRankBadge(winner.rank)
                            // 우수상(2위)은 gray-400, 장려상(3위)은 amber-600
                            const hoverBorderClass = winner.rank === 2 ? 'hover:border-gray-400' : 'hover:border-amber-600'
                            const hoverTextClass = winner.rank === 2 ? 'group-hover:text-gray-400' : 'group-hover:text-amber-600'
                            const badgeBgClass = winner.rank === 2 ? 'bg-gray-400/20 text-gray-400' : 'bg-amber-600/20 text-amber-600'
                            const scoreTextClass = winner.rank === 2 ? 'text-gray-400' : 'text-amber-600'
                            
                            return (
                                <div key={winner.id} className="relative">
                                    <div className="flex justify-center mb-4">
                                        <Badge className={rankBadge.color}>
                                            {rankBadge.text}
                                        </Badge>
                                    </div>
                                    
                                    <Card className={`group overflow-hidden bg-card border-border ${hoverBorderClass} transition cursor-pointer`}>
                                        {/* Image */}
                                        <div className="relative h-64 overflow-hidden bg-muted">
                                            <img
                                                src={winner.image || "/placeholder.svg"}
                                                alt={winner.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />

                                            {/* Trophy Icon */}
                                            <div className="absolute bottom-4 left-4">
                                                {getRankIcon(winner.rank)}
                                            </div>
                                        </div>

                                    {/* Content */}
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <h3 className={`text-2xl font-bold text-foreground ${hoverTextClass} transition mb-1`}>
                                                {winner.title}
                                            </h3>
                                            <p className="text-muted-foreground">{winner.director}</p>
                                        </div>

                                        <Badge className={`${badgeBgClass} text-xs`}>
                                            {winner.genre}
                                        </Badge>

                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {winner.dreamSummary}
                                        </p>

                                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">심사위원</p>
                                                <p className="text-lg font-bold text-foreground">
                                                    {winner.judgeAverageScore.toFixed(1)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">관객</p>
                                                <p className="text-lg font-bold text-foreground">
                                                    {winner.audienceRating.toFixed(1)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">최종</p>
                                                <p className={`text-lg font-bold ${scoreTextClass}`}>
                                                    {winner.finalScore.toFixed(1)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    </Card>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Popularity Award Section */}
            {popularityWinner && (
                <section className="py-12 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-pink-500/5 to-background">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-8">
                            <Badge className="bg-pink-500/20 text-pink-500 border-pink-500/30 text-lg px-6 py-2 mb-4">
                                💖 인기상
                            </Badge>
                            <h2 className="text-3xl font-bold text-foreground mb-2">Popularity Award</h2>
                            <p className="text-muted-foreground">관객 여러분의 투표로 선정된 가장 사랑받은 작품</p>
                        </div>

                        <Card className="overflow-hidden bg-gradient-to-br from-pink-500/10 via-background to-background border-pink-500/30 max-w-4xl mx-auto">
                            <div className="p-8 lg:p-12 space-y-6">
                                <div className="flex items-center justify-center mb-6">
                                    <div className="w-20 h-20 rounded-full bg-pink-500/20 flex items-center justify-center">
                                        <Heart className="w-12 h-12 text-pink-500 fill-pink-500" />
                                    </div>
                                </div>

                                <div className="text-center">
                                    <h3 className="text-4xl font-bold text-foreground mb-2">{popularityWinner.title}</h3>
                                    <p className="text-xl text-muted-foreground">{popularityWinner.director}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-6 pt-6 max-w-md mx-auto">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
                                            <Users className="w-4 h-4" />
                                            관객 투표
                                        </div>
                                        <p className="text-3xl font-bold text-foreground">
                                            {popularityWinner.audienceRating.toFixed(1)}
                                            <span className="text-lg text-muted-foreground font-normal">/5.0</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            ({popularityWinner.audienceVotes.toLocaleString()}명)
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
                                            <Star className="w-4 h-4" />
                                            인기상 점수
                                        </div>
                                        <p className="text-3xl font-bold text-pink-500">
                                            {popularityWinner.popularityScore.toFixed(1)}
                                            <span className="text-lg text-muted-foreground font-normal">/100</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            관객 투표 100%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>
            )}

            {/* Festival Info */}
            <section className="py-12 px-4 md:px-6 lg:px-8 border-t border-border">
                <div className="max-w-3xl mx-auto text-center space-y-4">
                    <h3 className="text-2xl font-bold text-foreground">
                        축하합니다! 🎉
                    </h3>
                    <p className="text-lg text-muted-foreground">
                        모든 출품작과 참여해주신 심사위원, 관객 여러분께 감사드립니다.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        2025 제13회 Dream Film Festival은 성공적으로 마무리되었습니다.
                    </p>
                </div>
            </section>

            <Footer />
        </main>
    )
}

