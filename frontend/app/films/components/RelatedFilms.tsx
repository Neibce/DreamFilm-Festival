import { Card } from '@/components/ui/card'
import { Star, Film } from 'lucide-react'
import Link from 'next/link'

interface RelatedFilm {
  id: string
  title: string
  director: string
  image: string
  rating: number
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
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={film.image || "/placeholder.svg"}
                    alt={film.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-foreground group-hover:text-primary transition line-clamp-2">
                    {film.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{film.director}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex">
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
                    </div>
                    <span className="text-sm text-foreground font-medium">{film.rating}</span>
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

