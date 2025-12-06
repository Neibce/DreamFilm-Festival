import { create } from 'zustand'

type ToastKind = 'success' | 'error'

interface ToastState {
  toast: { message: string; kind: ToastKind } | null
  show: (toast: { message: string; kind: ToastKind }) => void
  clear: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  toast: null,
  show: (toast) => set({ toast }),
  clear: () => set({ toast: null }),
}))

