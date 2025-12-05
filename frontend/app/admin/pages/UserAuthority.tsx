'use client'

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Shield, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

type UserRole = 'admin' | 'judge' | 'user'

interface User {
    id: string
    name: string
    email: string
    role: UserRole
    joinedAt: string
}

const MOCK_USERS: User[] = [
    {
        id: '1',
        name: '김관리',
        email: 'admin@dreamfilm.com',
        role: 'admin',
        joinedAt: '2024-01-15'
    },
    {
        id: '2',
        name: '이심사',
        email: 'judge1@dreamfilm.com',
        role: 'judge',
        joinedAt: '2024-02-20'
    },
    {
        id: '3',
        name: '박관객',
        email: 'user1@dreamfilm.com',
        role: 'user',
        joinedAt: '2024-03-10'
    },
    {
        id: '4',
        name: '최심사',
        email: 'judge2@dreamfilm.com',
        role: 'judge',
        joinedAt: '2024-02-25'
    },
    {
        id: '5',
        name: '정사용자',
        email: 'user2@dreamfilm.com',
        role: 'user',
        joinedAt: '2024-03-15'
    },
    {
        id: '6',
        name: '강심사',
        email: 'judge3@dreamfilm.com',
        role: 'judge',
        joinedAt: '2024-03-01'
    },
    {
        id: '7',
        name: '윤관객',
        email: 'user3@dreamfilm.com',
        role: 'user',
        joinedAt: '2024-03-20'
    }
]

type SortField = 'name' | 'role' | null
type SortDirection = 'asc' | 'desc'

export default function UserAuthority() {
    const [users, setUsers] = useState<User[]>(MOCK_USERS)
    const [selectedRoles, setSelectedRoles] = useState<Record<string, UserRole>>(
        MOCK_USERS.reduce((acc, user) => ({ ...acc, [user.id]: user.role }), {})
    )
    const [sortField, setSortField] = useState<SortField>(null)
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

    const getRoleBadge = (role: UserRole) => {
        switch (role) {
            case 'admin':
                return { text: '관리자', color: 'bg-red-500/20 text-red-500 border-red-500/30' }
            case 'judge':
                return { text: '심사위원', color: 'bg-blue-500/20 text-blue-500 border-blue-500/30' }
            case 'user':
                return { text: '일반 사용자', color: 'bg-white/20 text-white border-white/30' }
        }
    }

    const handleRoleChange = (userId: string, newRole: UserRole) => {
        setSelectedRoles(prev => ({ ...prev, [userId]: newRole }))
    }

    const handleSaveRole = (userId: string) => {
        setUsers(users.map(user => 
            user.id === userId ? { ...user, role: selectedRoles[userId] } : user
        ))
    }

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection('asc')
        }
    }

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) {
            return <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
        }
        return sortDirection === 'asc' 
            ? <ArrowUp className="w-4 h-4 text-primary" />
            : <ArrowDown className="w-4 h-4 text-primary" />
    }

    const sortedUsers = [...users].sort((a, b) => {
        if (!sortField) return 0

        if (sortField === 'name') {
            const compare = a.name.localeCompare(b.name, 'ko')
            return sortDirection === 'asc' ? compare : -compare
        }

        if (sortField === 'role') {
            const roleOrder = { admin: 0, judge: 1, user: 2 }
            const compare = roleOrder[a.role] - roleOrder[b.role]
            return sortDirection === 'asc' ? compare : -compare
        }

        return 0
    })

    const roleStats = {
        admin: users.filter(u => u.role === 'admin').length,
        judge: users.filter(u => u.role === 'judge').length,
        user: users.filter(u => u.role === 'user').length,
        total: users.length
    }

    return (
        <div className="p-6 border-border h-full">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">사용자 권한 관리</h2>
                <p className="text-muted-foreground">사용자의 역할과 권한을 관리하세요.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
                        <p className="text-sm text-muted-foreground">일반 사용자</p>
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-white">{roleStats.user}</p>
                </Card>
            </div>

            {/* Users List */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">사용자 목록</h3>
                
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

                {/* User Rows */}
                {sortedUsers.map((user) => {
                    const roleBadge = getRoleBadge(user.role)
                    const currentSelectedRole = selectedRoles[user.id]

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
                                    {user.joinedAt}
                                </div>

                                {/* Role Change */}
                                <div className="flex items-center gap-2">
                                    <Select 
                                        value={currentSelectedRole} 
                                        onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                                    >
                                        <SelectTrigger className="w-[140px] h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">관리자</SelectItem>
                                            <SelectItem value="judge">심사위원</SelectItem>
                                            <SelectItem value="user">일반 사용자</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button 
                                        size="sm" 
                                        onClick={() => handleSaveRole(user.id)}
                                        className="bg-primary hover:bg-primary/90 h-9 px-3"
                                        disabled={currentSelectedRole === user.role}
                                    >
                                        변경
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
