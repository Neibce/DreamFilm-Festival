'use client'

export function Features() {
  const features = [
    {
      icon: '💭',
      title: '꿈 이야기 출품',
      description: '어젯밤 꾸었던 꿈을 간단히 기록하세요. 작은 단서도 충분합니다.'
    },
    {
      icon: '🎬',
      title: 'AI 시나리오 제작',
      description: '당신의 꿈을 기반으로 AI가 분위기, 대사, 상황을 분석하여 영화 스타일의 시나리오로 재구성합니다.'
    },
    {
      icon: '⭐',
      title: '관객 참여 평가',
      description: '가장 흥미로운 작품을 직접 선택하고 평점을 남겨 특별한 영향력을 행사해 보세요.'
    },
    {
      icon: '🏆',
      title: '전문가 심사',
      description: '영화·스토리텔링 전문가가 창의성, 표현력, 완성도 등을 기준으로 작품을 평가합니다.'
    },
    {
      icon: '🎥',
      title: '관객 및 전문가 피드백',
      description: '관객과 전문가의 피드백을 통해 작품의 방향성과 완성도를 한 단계 끌어올릴 수 있습니다.'
    },
    {
      icon: '🌟',
      title: '수상 및 홍보 지원',
      description: '선정된 꿈 영화는 플랫폼 내에서 공식적으로 전시되며, 우수 작품은 특별 전시 및 홍보 기회를 얻습니다.'
    }
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-10">주요 기능</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="p-6 rounded-xl border border-border bg-background/50 hover-glow group">
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