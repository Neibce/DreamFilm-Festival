import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'

/**
 * 역할 전용 페이지 접근을 막기 위한 가드 훅.
 * 필요한 역할이 아니면 조용히 메인으로 리다이렉트한다.
 */
export function useRoleGuard(requiredRoles: string | string[]) {
  const router = useRouter()
  const { user, fetchMeOnce, fetched, loading } = useAuthStore()
  const [redirected, setRedirected] = useState(false)

  const normalizedRoles = useMemo(
    () => (Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]).map((r) => r.toUpperCase()),
    [requiredRoles]
  )
  const currentRole = (user?.role || '').toUpperCase()
  const authorized = fetched && !loading && !!user && normalizedRoles.includes(currentRole)
  const checking = !fetched || loading

  useEffect(() => {
    fetchMeOnce()
  }, [fetchMeOnce])

  useEffect(() => {
    if (checking) return
    if (authorized) return
    if (redirected) return
    setRedirected(true)
    router.replace('/')
  }, [authorized, checking, router, redirected])

  return { authorized, checking }
}
