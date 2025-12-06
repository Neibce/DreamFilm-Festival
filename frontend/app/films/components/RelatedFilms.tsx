import { Card } from '@/components/ui/card'
import { Star, Film, Heart, MessageCircle } from 'lucide-react'
import Link from 'next/link'

interface RelatedFilm {
  id: string
  title: string
  director: string
  image: string
  rating: number
  likes: number
  reviews: number
}

interface RelatedFilmsProps {
  films: RelatedFilm[]
}

export function RelatedFilms({ films }: RelatedFilmsProps) {
  return (
    <section className="mt-16 pt-12 border-t border-border">
      <h2 className="text-3xl font-bold text-foreground mb-6">관련된 작품들</h2>
      {films.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {films.map((film) => (
            <Link key={film.id} href={`/films/${film.id}`}>
              <Card className="group overflow-hidden hover:border-primary transition cursor-pointer bg-card border-border h-full">
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src={film.image || "/placeholder.svg"}
                    alt={film.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-foreground group-hover:text-primary transition break-words whitespace-normal leading-tight text-balance">
                    {film.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{film.director}</p>
                  <div className="flex items-center gap-2 justify-between items-end">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(film.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-foreground font-medium">{film.rating}</span>
                    </div>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        {film.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {film.reviews}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-12 bg-card border-border text-center">
          <Film className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">
            관련된 작품이 없습니다.
          </p>
        </Card>
      )}
    </section>
  )
}

