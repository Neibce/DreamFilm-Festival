import { Card } from '@/components/ui/card'
import { Star, MessageCircle, BadgeInfo } from 'lucide-react'
import { Film } from '../types'

interface FilmStatsProps {
  film: Film
}

export function FilmStats({ film }: FilmStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="p-4 bg-card border-border justify-center items-center text-center">
        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        <span className="text-2xl font-bold text-foreground">{film.rating}</span>
        <p className="text-xs text-muted-foreground">
          평균 총점 <br />
          <span className='text-[10px]'>(총 {film.votes}개)</span>
        </p>
      </Card>
      <Card className="p-4 bg-card border-border flex flex-col justify-center items-center text-center">
        <MessageCircle className="w-5 h-5 mx-auto mb-2 text-accent" />
        <p className="text-2xl font-bold text-foreground">{film.reviews}</p>
        <p className="text-xs text-muted-foreground">리뷰</p>
      </Card>
      <Card className="p-4 bg-card border-border text-center">
        <BadgeInfo className="w-5 h-5 mx-auto text-primary" />
        <div className="space-y-2 pb-2">
          <div>
            <p className="text-xs text-muted-foreground mb-1">감독 및 각본</p>
            <p className="text-md text-foreground font-medium mb-3">{film.director}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">포스터 제작</p>
            <p className="text-md text-foreground font-medium">{film.cinematography}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

