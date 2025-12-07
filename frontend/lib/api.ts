const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://127.0.0.1:8085'

export const resolveImageUrl = (path?: string | null) => {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (path.startsWith('/')) return `${API_BASE}${path}`
  return `${API_BASE}/${path}`
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    credentials: 'include',
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `API error: ${res.status}`)
  }

  if (res.status === 204) {
    return undefined as T
  }

  const text = await res.text().catch(() => '')
  if (!text) {
    return undefined as T
  }

  return JSON.parse(text) as T
}

export const api = {
  getFilms: () => request('/api/films'),
  getFilmsAdmin: () => request('/api/films/admin'),
  getOngoingFilms: (params?: { search?: string; genre?: string }) => {
    const query = new URLSearchParams()
    if (params?.search) query.set('search', params.search)
    if (params?.genre) query.set('genre', params.genre)
    const queryString = query.toString()
    const path = `/api/films/ongoing${queryString ? `?${queryString}` : ''}`
    return request(path)
  },
  getFilmsByDirector: (directorId: string | number) => request(`/api/films/director/${directorId}`),
  getFilmDetail: (filmId: string | number) => request(`/api/films/${filmId}`),
  getMyFilms: () => request('/api/films/me'),
  approveFilmUser: (filmId: string | number) =>
    request(`/api/films/${filmId}/user-approve`, { method: 'POST' }),
  denyFilmUser: (filmId: string | number) =>
    request(`/api/films/${filmId}/user-deny`, { method: 'POST' }),
  submitFilm: (payload: { title: string; dreamText: string; genre: string; mood?: string; themes?: string; targetAudience?: string }) =>
    request('/api/films', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getFestivals: () => request('/api/festivals'),
  createFestival: (payload: { festivalName: string; startDate: string; endDate: string }) =>
    request('/api/festivals', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateFestival: (festivalId: string | number, payload: { festivalName: string; startDate: string; endDate: string }) =>
    request(`/api/festivals/${festivalId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteFestival: (festivalId: string | number) =>
    request(`/api/festivals/${festivalId}`, {
      method: 'DELETE',
    }),
  getFestivalStats: (festivalId: string | number) => request(`/api/festivals/${festivalId}/stats`),
  getReviewsByFilm: (filmId: string | number, params?: { sort?: 'recent' | 'rating' }) => {
    const query = new URLSearchParams()
    if (params?.sort) query.set('sort', params.sort)
    const qs = query.toString()
    return request(`/api/reviews/film/${filmId}${qs ? `?${qs}` : ''}`)
  },
  postVote: (filmId: string | number) => request('/api/votes', {
    method: 'POST',
    body: JSON.stringify({ filmId }),
  }),
  deleteVote: (filmId: string | number) => request(`/api/votes/film/${filmId}`, {
    method: 'DELETE',
  }),
  getMyVotes: () => request('/api/votes/me'),
  getMyVoteSummary: () => request('/api/votes/me/summary'),
  getAwardsByFestival: (festivalId: string | number) => request(`/api/awards/festival/${festivalId}`),
  getMyJudgeScore: (filmId: string | number) => request(`/api/judges/film/${filmId}/me`),
  submitJudgeScore: (filmId: string | number, payload: { creativity: number; execution: number; emotionalImpact: number; storytelling: number; comment?: string }) =>
    request(`/api/judges/film/${filmId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  approveFilmAdmin: (filmId: string | number) =>
    request(`/api/films/${filmId}/admin-approve`, { method: 'POST' }),
  rejectFilmAdmin: (filmId: string | number) =>
    request(`/api/films/${filmId}/admin-reject`, { method: 'POST' }),
  getUsers: (params?: { sortField?: string; sortDirection?: 'asc' | 'desc' }) => {
    const query = new URLSearchParams()
    if (params?.sortField) query.set('sortField', params.sortField)
    if (params?.sortDirection) query.set('sortDirection', params.sortDirection)
    const qs = query.toString()
    return request(`/api/users${qs ? `?${qs}` : ''}`)
  },
  updateUserRole: (userId: string | number, payload: { role: string }) =>
    request(`/api/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  getJudgesProgress: () => request('/api/judges/progress'),
  getFilmsWithJudgeStatus: () => request('/api/judges/films'),
  getUserActivityStats: () => request<{ activeUsers: number; engagedUsers: number; inactiveUsers: number }>('/api/users/stats/activity'),
  getTopRatedFilms: (minRating: number = 0) => request<{ filmId: number; reviewCount: number; avgRating: number }[]>(`/api/reviews/films/top-rated?minRating=${minRating}`),
  // LEFT JOIN - 영화 + 감독 정보 조회
  getFilmsWithDirector: () => request('/api/films/with-director'),
  // View - 영화 상세 정보 조회
  getFilmDetailsFromView: (filmId: string | number) => request(`/api/films/${filmId}/view-details`),
  // View - 영화 랭킹 조회
  getFilmRanking: (limit: number = 10) => request(`/api/films/ranking?limit=${limit}`),
  getAwardRankings: (festivalId: string | number, limit = 5) =>
    request(`/api/awards/rankings?festivalId=${festivalId}&limit=${limit}`),
  getAwardPopularity: (festivalId: string | number, limit = 3) =>
    request(`/api/awards/popularity?festivalId=${festivalId}&limit=${limit}`),
  finalizeAwards: (festivalId: string | number, rankingLimit = 5, popularityLimit = 3) =>
    request(`/api/awards/finalize?festivalId=${festivalId}&rankingLimit=${rankingLimit}&popularityLimit=${popularityLimit}`, {
      method: 'POST',
    }),
  postReview: (payload: { filmId: string | number; rating: number; comment: string }) =>
    request('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  login: (payload: { email: string; password: string }) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  logout: () =>
    request('/api/auth/logout', {
      method: 'POST',
    }),
  signUp: (payload: { username: string; password: string; email: string; role?: string }) =>
    request('/api/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getMe: () => request('/api/auth/me'),
}

