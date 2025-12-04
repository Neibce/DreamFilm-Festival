'use client'

import SubmitAdmin from './pages/SubmitAdmin'
import JudgeProgress from './pages/JudgeProgress'
import AwardAdmin from './pages/AwardAdmin'
import FestivalAdmin from './pages/FestivalAdmin'
import UserAuthority from './pages/UserAuthority'

interface AdminContentProps {
  selectedMenu: string
}

export default function AdminContent({ selectedMenu }: AdminContentProps) {
  const renderContent = () => {
    switch (selectedMenu) {
      case '출품 관리':
        return <SubmitAdmin />
      case '심사 진행률':
        return <JudgeProgress />
      case '수상작 선정':
        return <AwardAdmin />
      case '영화제 관리':
        return <FestivalAdmin />
      case '사용자 관리':
        return <UserAuthority />
      default:
        return <div>메뉴를 선택해주세요.</div>
    }
  }

  return (
    <div className="bg-card border-border border shadow-lg rounded-lg">
      {renderContent()}
    </div>
  )
}
