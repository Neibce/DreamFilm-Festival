export interface Review {
  id: string
  userId?: string
  author: string
  rating: number
  text: string
  date: string
  helpful: number
}

export interface Film {
  id: string
  title: string
  director: string
  directorId?: string
  genre: string
  status: 'approved' | 'pending' | 'rejected'
  image: string
  rating: number
  votes: number
  reviews: number
  likes: number
  dreamTheme: string
  releaseDate?: string
  runtime?: string
  description?: string
  cinematography?: string
  awards?: string
}

export type SortType = 'recent' | 'rating'

