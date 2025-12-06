'use client'

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Shield, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { api } from "@/lib/api"
import { useToastStore } from "@/store/toast"

type UserRole = 'ADMIN' | 'JUDGE' | 'DIRECTOR' | 'AUDIENCE'

interface UserItem {
  id: string
  name: string
  email: string
  role: UserRole
  joinedAt: string
}

type SortField = 'name' | 'role' | null
type SortDirection = 'asc' | 'desc'

const ROLE_OPTIONS: UserRole[] = ['ADMIN', 'JUDGE', 'DIRECTOR', 'AUDIENCE']

export default function UserAuthority() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [selectedRoles, setSelectedRoles] = useState<Record<string, UserRole>>({})
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const { show } = useToastStore()

  const fetchUsers = (field: SortField, direction: SortDirection) => {
    setLoading(true)
    const params = field ? { sortField: field, sortDirection: direction } : undefined

    api.getUsers(params)
      .then((res) => {
        const mapped: UserItem[] = (res as any[]).map((u) => ({
          id: String(u.userId),
          name: u.username,
          email: u.email,
          role: (u.role || 'AUDIENCE') as UserRole,
          joinedAt: (u.createdAt || '').replace('T', ' ').slice(0, 16),
        }))
        setUsers(mapped)
        setSelectedRoles(mapped.reduce((acc, user) => ({ ...acc, [user.id]: user.role }), {}))
      })
      .catch((err: Error) => {
        show({ message: err.message || '사용자 목록을 불러오지 못했습니다.', kind: 'error' })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchUsers(sortField, sortDirection)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setSelectedRoles(prev => ({ ...prev, [userId]: newRole }))
  }

  const handleSaveRole = (userId: string) => {
    const role = selectedRoles[userId]
    if (!role) return
    setSaving(prev => ({ ...prev, [userId]: true }))
    api.updateUserRole(userId, { role })
      .then(() => {
        setUsers(prev => prev.map(user => user.id === userId ? { ...user, role } : user))
        show({ message: '역할이 업데이트되었습니다.', kind: 'success' })
      })
      .catch((err: Error) => {
        show({ message: err.message || '역할 변경에 실패했습니다.', kind: 'error' })
      })
      .finally(() => setSaving(prev => ({ ...prev, [userId]: false })))
  }

  const handleSort = (field: SortField) => {
    let nextDirection: SortDirection = 'asc'
    if (sortField === field) {
      nextDirection = sortDirection === 'asc' ? 'desc' : 'asc'
    }
    setSortField(field)
    setSortDirection(nextDirection)
    fetchUsers(field, nextDirection)
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
    return sortDirection === 'asc'
      ? <ArrowUp className="w-4 h-4 text-primary" />
      : <ArrowDown className="w-4 h-4 text-primary" />
  }

  const roleStats = {
    admin: users.filter(u => u.role === 'ADMIN').length,
    judge: users.filter(u => u.role === 'JUDGE').length,
    director: users.filter(u => u.role === 'DIRECTOR').length,
    audience: users.filter(u => u.role === 'AUDIENCE').length,
    total: users.length,
  }

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return { text: '관리자', color: 'bg-red-500/20 text-red-500 border-red-500/30' }
      case 'JUDGE':
        return { text: '심사위원', color: 'bg-blue-500/20 text-blue-500 border-blue-500/30' }
      case 'DIRECTOR':
        return { text: '감독', color: 'bg-primary/20 text-primary border-primary/30' }
      case 'AUDIENCE':
      default:
        return { text: '관객', color: 'bg-muted text-foreground border-border' }
    }
  }

  return (
    <div className="p-6 border-border h-full space-y-8">
      <div className="mb-2">
        <h2 className="text-2xl font-bold mb-2">사용자 권한 관리</h2>
        <p className="text-muted-foreground">사용자의 역할과 권한을 관리하세요.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {loading ? (
          <>
            {[1,2,3,4,5].map(i => (
              <Card key={i} className="p-6 bg-card border-border animate-pulse space-y-3">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-8 w-16 bg-muted rounded" />
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">전체 사용자</p>
                <User className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{roleStats.total}</p>
            </Card>
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">관리자</p>
                <Shield className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-3xl font-bold text-red-500">{roleStats.admin}</p>
            </Card>
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">심사위원</p>
                <Shield className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-blue-500">{roleStats.judge}</p>
            </Card>
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">감독</p>
                <User className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-primary">{roleStats.director}</p>
            </Card>
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">관객</p>
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold text-foreground">{roleStats.audience}</p>
            </Card>
          </>
        )}
      </div>

      {/* Users List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">사용자 목록</h3>

        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 px-20 py-3 bg-muted/50 rounded-lg font-semibold text-sm text-muted-foreground items-center">
          <button 
            onClick={() => handleSort('name')}
            className="flex items-center gap-2 hover:text-foreground transition text-left"
          >
            <span>이름</span>
            {getSortIcon('name')}
          </button>
          <div className="pl-5">이메일</div>
          <button 
            onClick={() => handleSort('role')}
            className="flex items-center gap-2 hover:text-foreground transition text-left"
          >
            <span className="pl-9">현재 역할</span>
            {getSortIcon('role')}
          </button>
          <div className="pl-7">가입일</div>
          <div className="pl-9">역할 변경</div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <Card key={i} className="p-6 bg-card border-border animate-pulse space-y-3">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-3 w-32 bg-muted rounded" />
                <div className="h-3 w-40 bg-muted rounded" />
              </Card>
            ))}
          </div>
        )}

        {/* User Rows */}
        {!loading && users.map((user) => {
          const roleBadge = getRoleBadge(user.role)
          const currentSelectedRole = selectedRoles[user.id] || user.role

          return (
            <Card key={user.id} className="p-6 bg-card border-border hover:bg-card/80 transition">
              <div className="grid grid-cols-5 gap-4 items-center">
                {/* Name */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-semibold text-foreground">{user.name}</span>
                </div>

                {/* Email */}
                <div className="text-sm text-muted-foreground">
                  {user.email}
                </div>

                {/* Current Role */}
                <div className="flex justify-center items-center pr-18">
                  <Badge className={roleBadge.color}>
                    {roleBadge.text}
                  </Badge>
                </div>

                {/* Join Date */}
                <div className="text-sm text-muted-foreground">
                  {user.joinedAt || '-'}
                </div>

                {/* Role Change */}
                <div className="flex items-center gap-2">
                  <Select
                    value={currentSelectedRole}
                    onValueChange={(val) => handleRoleChange(user.id, val as UserRole)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="역할 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => handleSaveRole(user.id)}
                    disabled={saving[user.id]}
                  >
                    {saving[user.id] ? '저장중...' : '저장'}
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
