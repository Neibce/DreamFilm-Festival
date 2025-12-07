'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Award, Crown, Star, Users, Heart } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { api, resolveImageUrl } from '@/lib/api'

interface AwardWinner {
    id: string
    rank: number
    title: string
    director: string
    genre?: string | null
    image?: string | null
    judgeAverageScore: number
    likes: number
    finalScore: number
    dreamSummary?: string | null
}

interface PopularityWinner {
    id: string
    title: string
    director: string
    likes: number
    popularityScore: number
    genre?: string | null
    image?: string | null
}

interface FestivalInfo {
    id: string
    name: string
    startDate: string
    endDate: string
}

export default function AwardsPage() {
    const [winners, setWinners] = useState<AwardWinner[]>([])
    const [popularityWinner, setPopularityWinner] = useState<PopularityWinner | null>(null)
    const [loading, setLoading] = useState(true)
    const [festival, setFestival] = useState<FestivalInfo | null>(null)
    const [festivals, setFestivals] = useState<FestivalInfo[]>([])
    const [festivalsLoading, setFestivalsLoading] = useState(true)
    const [selectedFestivalId, setSelectedFestivalId] = useState<string | null>(null)
    const [unfinalized, setUnfinalized] = useState(false)
    const [viewRanking, setViewRanking] = useState<any[]>([])

    // 영화제 목록 로드
    useEffect(() => {
        let mounted = true
        setFestivalsLoading(true)
        api.getFestivals()
            .then((res) => {
                if (!mounted) return
                const list = Array.isArray(res) ? res : []
                const sorted = [...list].sort((a, b) => (b.startDate || '').localeCompare(a.startDate || ''))
                const mapped = sorted.map((f) => ({
                    id: String(f.festivalId ?? f.id),
                    name: f.festivalName ?? f.name ?? 'Dream Film Festival',
                    startDate: f.startDate,
                    endDate: f.endDate,
                }))
                setFestivals(mapped)
                if (mapped[0]) {
                    setSelectedFestivalId(mapped[0].id)
                } else {
                    setUnfinalized(true)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.error(e)
                if (!mounted) return
                setUnfinalized(true)
                setLoading(false)
            })
            .finally(() => {
                if (mounted) setFestivalsLoading(false)
            })

        // View 기반 랭킹 조회 (v_film_ranking View 사용)
        api.getFilmRanking(10)
            .then((ranking: any) => {
                if (!mounted) return
                setViewRanking(Array.isArray(ranking) ? ranking : [])
            })
            .catch(() => {
                if (!mounted) return
                setViewRanking([])
            })

        return () => { mounted = false }
    }, [])

    // 선택한 영화제의 수상작 로드
    useEffect(() => {
        if (!selectedFestivalId) return

        const selected = festivals.find((f) => f.id === selectedFestivalId) ?? null
        setFestival(selected)
        setLoading(true)
        setUnfinalized(false)
        setWinners([])
        setPopularityWinner(null)

        let mounted = true
        const fetchAwards = async () => {
            try {
                const awards = await api.getAwardsByFestival(selectedFestivalId) as any[]
                if (!mounted) return
                if (!awards || awards.length === 0) {
                    setUnfinalized(true)
                    return
                }

                const rankingAwards = awards
                    .filter((a) => a.rank !== 4)
                    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
                    .slice(0, 5)
                const popularity = awards.find((a) => a.rank === 4) ?? null

                const rankingWithDetail = await Promise.all(rankingAwards.map(async (a: any) => {
                    const detail = await api.getFilmDetail(a.filmId) as any
                    return {
                        id: String(a.filmId),
                        rank: a.rank ?? 0,
                        title: detail?.title ?? '제목 미상',
                        director: detail?.director?.username ?? detail?.directorName ?? '감독 정보 없음',
                        genre: detail?.genre ?? null,
                        image: resolveImageUrl(detail?.imageUrl),
                        judgeAverageScore: detail?.averageRating ?? 0,
                        likes: detail?.voteCount ?? 0,
                        finalScore: (detail?.averageRating ?? 0) * 20,
                        dreamSummary: detail?.summary ?? detail?.dreamText ?? null,
                    } as AwardWinner
                }))

                let popularityMapped: PopularityWinner | null = null
                if (popularity) {
                    const detail = await api.getFilmDetail(popularity.filmId) as any
                    popularityMapped = {
                        id: String(popularity.filmId),
                        title: detail?.title ?? '제목 미상',
                        director: detail?.director?.username ?? detail?.directorName ?? '감독 정보 없음',
                        likes: detail?.voteCount ?? 0,
                        popularityScore: detail?.voteCount ?? 0,
                        genre: detail?.genre ?? null,
                        image: resolveImageUrl(detail?.imageUrl),
                    }
                }

                setWinners(rankingWithDetail)
                setPopularityWinner(popularityMapped)
            } catch (e) {
                console.error(e)
                if (!mounted) return
                setUnfinalized(true)
            } finally {
                if (mounted) setLoading(false)
            }
        }

        fetchAwards()

        return () => { mounted = false }
    }, [selectedFestivalId, festivals])

    const festivalTitle = useMemo(() => {
        if (!festival) return 'Dream Film Festival'
        const name = festival.name?.includes('Dream Film Festival') ? festival.name : `${festival.name} Dream Film Festival`
        return name
    }, [festival])

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

    const SkeletonBlock = ({ className }: { className?: string }) => (
        <div className={`animate-pulse bg-muted rounded-md ${className ?? ''}`} />
    )

    if (loading) {
        return (
            <main className="min-h-screen bg-background">
                <Header />

                {/* Hero Section */}
                <section className="pt-20 pb-12 px-4 md:px-6 lg:px-8 border-b border-border bg-gradient-to-b from-primary/5 to-background">
                    <div className="max-w-7xl mx-auto text-center space-y-4">
                        <div className="mx-auto w-16 h-16">
                            <SkeletonBlock className="w-full h-full rounded-full" />
                        </div>
                        <SkeletonBlock className="mx-auto h-10 w-64" />
                        <SkeletonBlock className="mx-auto h-6 w-48" />
                        <div className="mx-auto space-y-2 max-w-xl">
                            <SkeletonBlock className="h-4 w-full" />
                            <SkeletonBlock className="h-4 w-3/4 mx-auto" />
                        </div>
                    </div>
                </section>

                {/* Grand Prize Skeleton */}
                <section className="py-12 px-4 md:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto space-y-6">
                        <SkeletonBlock className="h-8 w-32 mx-auto" />
                        <SkeletonBlock className="h-6 w-48 mx-auto" />
                        <Card className="overflow-hidden border-border p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                                <SkeletonBlock className="h-96 w-full" />
                                <div className="p-8 lg:p-12 space-y-4">
                                    <SkeletonBlock className="h-8 w-3/4" />
                                    <SkeletonBlock className="h-4 w-1/2" />
                                    <SkeletonBlock className="h-5 w-24" />
                                    <SkeletonBlock className="h-20 w-full" />
                                    <div className="grid grid-cols-2 gap-6">
                                        <SkeletonBlock className="h-16 w-full" />
                                        <SkeletonBlock className="h-16 w-full" />
                                    </div>
                                    <SkeletonBlock className="h-20 w-full" />
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* Other Winners Skeleton */}
                <section className="py-12 px-4 md:px-6 lg:px-8 bg-muted/20">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Array.from({ length: 4 }).map((_, idx) => (
                                <Card key={idx} className="overflow-hidden border-border p-0 h-full flex flex-col">
                                    <SkeletonBlock className="h-64 w-full" />
                                    <div className="p-6 space-y-4 flex-1 flex flex-col">
                                        <SkeletonBlock className="h-6 w-3/4" />
                                        <SkeletonBlock className="h-4 w-1/2" />
                                        <SkeletonBlock className="h-5 w-16" />
                                        <SkeletonBlock className="h-10 w-full" />
                                        <div className="mt-auto grid grid-cols-3 gap-4 pt-4 border-t border-border">
                                            <SkeletonBlock className="h-12 w-full" />
                                            <SkeletonBlock className="h-12 w-full" />
                                            <SkeletonBlock className="h-12 w-full" />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Popularity Skeleton */}
                <section className="py-12 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-pink-500/5 to-background">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-8 space-y-3">
                            <SkeletonBlock className="h-8 w-32 mx-auto" />
                            <SkeletonBlock className="h-6 w-48 mx-auto" />
                            <SkeletonBlock className="h-4 w-64 mx-auto" />
                        </div>

                        <Card className="overflow-hidden border-border max-w-5xl mx-auto p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                                <SkeletonBlock className="h-80 w-full" />
                                <div className="p-8 lg:p-12 space-y-6 flex flex-col justify-center">
                                    <SkeletonBlock className="h-20 w-20 mx-auto rounded-full" />
                                    <SkeletonBlock className="h-8 w-3/4 mx-auto" />
                                    <SkeletonBlock className="h-5 w-1/2 mx-auto" />
                                    <SkeletonBlock className="h-4 w-24 mx-auto" />
                                    <SkeletonBlock className="h-10 w-32 mx-auto" />
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>

                <Footer />
            </main>
        )
    }

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
                        {festivalTitle}
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">
                        수상작 발표
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        심사위원 평가와 관객 투표 수를 종합하여 선정된 최종 수상작을 공개합니다.
                    </p>
                </div>
            </section>

            {/* Festival Selector */}
            <section className="px-4 md:px-6 lg:px-8 border-b border-border bg-background">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap gap-2 overflow-x-auto py-4">
                        {festivalsLoading ? (
                            Array.from({ length: 3 }).map((_, idx) => (
                                <div key={idx} className="h-10 w-24 rounded-lg bg-muted animate-pulse" />
                            ))
                        ) : festivals.length > 0 ? (
                            festivals.map((fest) => (
                                <button
                                    key={fest.id}
                                    onClick={() => setSelectedFestivalId(fest.id)}
                                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                                        fest.id === selectedFestivalId
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-card text-foreground hover:bg-border'
                                    }`}
                                >
                                    {fest.name}
                                </button>
                            ))
                        ) : (
                            <span className="text-sm text-muted-foreground">등록된 영화제가 없습니다.</span>
                        )}
                    </div>
                </div>
            </section>

            {!loading && (!topWinner || unfinalized) && (
                <section className="py-16 px-4 md:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center space-y-4">
                        <Card className="p-8 bg-card border-border">
                            <h3 className="text-2xl font-bold text-foreground mb-2">수상작이 아직 확정되지 않았습니다.</h3>
                            <p className="text-muted-foreground">
                                영화제 운영 측에서 수상작을 확정하면 이 페이지에 발표됩니다.
                            </p>
                        </Card>
                    </div>
                </section>
            )}

            {/* Grand Prize Winner */}
            {topWinner && (
            <section className="py-12 px-4 md:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 text-lg px-6 py-2 mb-4">
                            🏆 대상
                        </Badge>
                        <h2 className="text-3xl font-bold text-foreground mb-2">Grand Prize Winner</h2>
                    </div>

                    <Card className="overflow-hidden bg-gradient-to-br from-yellow-500/10 via-background to-background border-yellow-500/30 hover-glow-yellow group p-0">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                            {/* Image */}
                            <div className="relative w-full aspect-[4/5] overflow-hidden bg-muted">
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
                                    <h3 className="text-4xl font-bold text-foreground mb-2 break-words whitespace-normal leading-tight text-balance">
                                        {topWinner.title}
                                    </h3>
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
                                            <Heart className="w-4 h-4" />
                                            관객 투표 수
                                        </div>
                                        <p className="text-3xl font-bold text-foreground">
                                            {topWinner.likes.toLocaleString()}
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
                                        심사위원 평가 70% + 관객 투표 수 30%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>
            )}

            {/* Other Winners */}
            {otherWinners.length > 0 && (
            <section className="py-12 px-4 md:px-6 lg:px-8 bg-muted/20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {otherWinners.map((winner) => {
                            const rankBadge = getRankBadge(winner.rank)
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
                                    
                                    <Card className={`group overflow-hidden bg-card border-border ${hoverBorderClass} transition cursor-pointer p-0 h-full flex flex-col`}>
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
                                    <div className="p-6 space-y-4 flex-1 flex flex-col">
                                        <div className="space-y-1">
                                            <h3 className={`text-2xl font-bold text-foreground ${hoverTextClass} transition mb-1 break-words whitespace-normal leading-tight text-balance`}>
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

                                        <div className="mt-auto grid grid-cols-3 gap-4 pt-4 border-t border-border">
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">심사위원 평가</p>
                                                <p className="text-lg font-bold text-foreground">
                                                    {winner.judgeAverageScore.toFixed(1)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                                    관객 투표 수
                                                </p>
                                                <p className="text-lg font-bold text-foreground">
                                                    {winner.likes.toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">최종 점수</p>
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
            )}

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

                        <Card className="overflow-hidden bg-gradient-to-br from-pink-500/10 via-background to-background border-pink-500/30 max-w-5xl mx-auto p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                                {/* Poster Image */}
                                <div className="relative w-full aspect-[4/5] overflow-hidden bg-muted">
                                    <img
                                        src={popularityWinner.image || "/placeholder.svg"}
                                        alt={popularityWinner.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-pink-500/30 flex items-center justify-center backdrop-blur-sm">
                                            <Heart className="w-7 h-7 text-pink-500 fill-pink-500" />
                                        </div>
                                        {popularityWinner.genre && (
                                            <Badge className="bg-pink-500/20 text-pink-500 border-pink-500/30">
                                                {popularityWinner.genre}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 lg:p-12 space-y-6 flex flex-col justify-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <div className="w-20 h-20 rounded-full bg-pink-500/20 flex items-center justify-center">
                                            <Heart className="w-12 h-12 text-pink-500 fill-pink-500" />
                                        </div>
                                    </div>

                                    <div className="text-center space-y-2">
                                        <h3 className="text-4xl font-bold text-foreground break-words whitespace-normal leading-tight text-balance">
                                            {popularityWinner.title}
                                        </h3>
                                        <p className="text-xl text-muted-foreground">{popularityWinner.director}</p>
                                    </div>

                                    <div className="text-center pt-4">
                                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
                                            <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                                            관객 투표 수
                                        </div>
                                        <p className="text-5xl font-bold text-pink-500">
                                            {popularityWinner.likes.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-3">
                                            투표 수 100%로 선정된 인기상 수상작
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>
            )}

            {/* Festival Info */}
            {topWinner && (
                <section className="py-12 px-4 md:px-6 lg:px-8 border-t border-border">
                    <div className="max-w-3xl mx-auto text-center space-y-4">
                        <h3 className="text-2xl font-bold text-foreground">
                            모든 감독 분들과 참여해주신 심사위원, 관객 여러분께 감사드립니다.
                        </h3>
                        <p className="text-lg text-muted-foreground">
                            {festivalTitle}은 성공적으로 마무리되었습니다.
                        </p>
                    </div>
                </section>
            )}

            <Footer />
        </main>
    )
}

