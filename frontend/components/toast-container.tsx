'use client'

import { useEffect, useState } from 'react'
import { useToastStore } from '@/store/toast'

export function ToastContainer() {
  const { toast, clear } = useToastStore()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!toast) return
    setVisible(true)
    const hideTimer = setTimeout(() => setVisible(false), 1800)
    const clearTimer = setTimeout(clear, 2200)
    return () => {
      clearTimeout(hideTimer)
      clearTimeout(clearTimer)
    }
  }, [toast, clear])

  if (!toast) return null

  const icon =
    toast.kind === 'success' ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 13l4 4L19 7" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    )

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`rounded-lg px-4 py-3 shadow-lg border text-sm flex items-center gap-2 transition-all duration-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        } ${
          toast.kind === 'success'
            ? 'bg-primary/10 border-primary/30 text-primary'
            : 'bg-destructive/10 border-destructive/30 text-destructive'
        }`}
      >
        {icon}
        <span>{toast.message}</span>
      </div>
    </div>
  )
}

