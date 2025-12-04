import { Film, Review } from './types'

export const MOCK_FILM: Film = {
  id: '1',
  title: 'The Midnight Garden',
  director: 'Sarah Chen',
  genre: 'Fantasy Drama',
  status: 'approved',
  image: '/fantasy-film-poster.jpg',
  rating: 4.8,
  votes: 1240,
  reviews: 89,
  dreamTheme: 'A surreal garden that exists between dreams and reality',
  releaseDate: '2024-06-15',
  runtime: '118 minutes',
  description: 'In the depths of a troubled mind lies a garden that blooms only at midnight. Follow Maya, a young artist struggling with reality, as she discovers a portal to a world where her paintings come to life. What begins as an escape becomes a journey of self-discovery and healing.',
  cinematography: 'Gemini',
  awards: 'Festival Award for Outstanding Vision'
}

export const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Alex Thompson',
    rating: 5,
    text: 'Absolutely breathtaking! The way the dream sequences transition into reality is seamless. A masterpiece of modern filmmaking.',
    date: '2024-06-20',
    helpful: 234
  },
  {
    id: '2',
    author: 'Emma Wilson',
    rating: 5,
    text: 'The cinematography is stunning. Every frame feels like a painting. I was completely immersed in this world.',
    date: '2024-06-18',
    helpful: 189
  },
  {
    id: '3',
    author: 'Marcus Johnson',
    rating: 4,
    text: 'Great storytelling with minor pacing issues in the second act. Overall a very emotional and impactful experience.',
    date: '2024-06-16',
    helpful: 127
  },
  {
    id: '4',
    author: 'Marcus Johnson',
    rating: 4,
    text: 'Great storytelling with minor pacing issues in the second act. Overall a very emotional and impactful experience.',
    date: '2024-06-10',
    helpful: 129
  },
]

