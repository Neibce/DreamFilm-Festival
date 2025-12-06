import { create } from 'zustand'
import { api } from '@/lib/api'

type UserInfo = { id?: string; username: string; role: string }

interface AuthState {
  user: UserInfo | null
  fetched: boolean
  loading: boolean
  fetchMeOnce: () => Promise<void>
  setUser: (user: UserInfo) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  fetched: false,
  loading: false,
  fetchMeOnce: async () => {
    const { fetched, loading } = get()
    if (fetched || loading) return
    set({ loading: true })
    try {
      const me: any = await api.getMe()
      set({
        user: {
          id: me.id ? String(me.id) : (me.userId ? String(me.userId) : undefined),
          username: me.username,
          role: me.role,
        },
        fetched: true,
        loading: false,
      })
    } catch {
      set({ user: null, fetched: true, loading: false })
    }
  },
  setUser: (user) => set({ user, fetched: true, loading: false }),
  clear: () => set({ user: null, fetched: true }),
}))

