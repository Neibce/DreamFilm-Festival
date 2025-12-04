'use client'

export function Process() {
  const steps = [
    { num: '1', title: '꿈 기록하기', desc: '꿈 내용 작성 및 출품' },
    { num: '2', title: 'AI 시나리오 생성', desc: 'AI의 꿈 기반 영화 시나리오 생성' },
    { num: '3', title: '예선', desc: '본선 출품작 선정' },
    { num: '4', title: '상영작 공개', desc: '승인된 작품 공개' },
    { num: '5', title: '관객 투표', desc: '커뮤니티 투표 및 리뷰' },
    { num: '6', title: '전문가 심사', desc: '전문가 심사 및 피드백' },
    { num: '7', title: '수상작 선정', desc: '최종 수상작 발표' }
  ]

  return (
    <section id="process" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-10">영화제 진행 과정</h2>
        </div>

        <div className="grid md:grid-cols-7 gap-4 md:gap-2">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-lg text-primary-foreground mb-4">
                {step.num}
              </div>
              <h3 className="font-bold text-center mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground text-center">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
