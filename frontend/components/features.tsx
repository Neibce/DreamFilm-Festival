'use client'

export function Features() {
  const features = [
    {
      icon: '💭',
      title: '꿈 출품',
      description: '어젯밤 꾸었던 꿈을 간단히 기록하세요. 작은 단서도 충분합니다.'
    },
    {
      icon: '🎬',
      title: 'AI 시나리오 생성',
      description: '입력된 꿈의 분위기, 서사, 상징을 분석해 영화 시나리오와 콘셉트로 재구성합니다.'
    },
    {
      icon: '⭐',
      title: '커뮤니티 투표',
      description: '관객이 되고 싶은 사용자들이 가장 흥미로운 꿈의 영화화 결과물을 직접 선택하고 평점을 남깁니다.'
    },
    {
      icon: '🏆',
      title: '전문가 심사 시스템',
      description: '영화·스토리텔링 전문가가 창의성, 표현력, 완성도 등을 기준으로 작품을 평가합니다.'
    },
    {
      icon: '🎥',
      title: '유저 및 전문가 피드백',
      description: 'Get detailed feedback from industry judges and peer reviewers'
    },
    {
      icon: '🌟',
      title: '수상 및 홍보 지원',
      description: '선정된 꿈 영화는 플랫폼 내에서 정식 공개되며, 우수 작품은 특별 전시 및 홍보 기회를 얻습니다.'
    }
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">주요 기능</h2>
          <p className="text-xl text-muted-foreground text-balance">
            꿈 속에서만 존재하던 세계가 현실로 다가오다
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="p-6 rounded-xl border border-border bg-background/50  hover-glow group">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}