'use client'

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl font-bold text-balance leading-tight">
              당신의 꿈이
              <br/>
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text font-clipartkorea font-bold text-transparent">영화가 되는 순간</span>
            </h1>
            
            <p className="font-light text-xl text-muted-foreground text-balance leading-relaxed">
            잠들었던 상상이 스크린 위에서 깨어납니다. <br/> AI가 당신의 꿈을 시나리오로 만들고, 관객과 심사위원이 평가합니다.<br/>
            <span className="font-bold">세상에 단 하나뿐인 꿈 기반 영화제 플랫폼</span>
            ,<br/> 이제 당신의 무의식을 작품으로 남겨보세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="px-11 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition">
                꿈 출품하기
              </button>
              <button className="px-10 py-3 border border-primary/50 text-primary rounded-lg font-semibold hover:bg-primary/5 transition">
                작품 감상하기
              </button>
            </div>

            <div className="flex gap-12 text-sm text-muted-foreground pt-4">
              <div>
                <p className="font-bold text-accent">2,847+</p>
                <p>출품된 꿈 작품</p>
              </div>
              <div>
                <p className="font-bold text-accent">1,203</p>
                <p>선정 및 상영이 완료된 영화</p>
              </div>
              <div>
                <p className="font-bold text-accent">15K+</p>
                <p>영화제 참여자 수</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl overflow-hidden">
              <img
                src="/Dreamfilm-festival-hero-image.jpg"
                alt="DreamFilm Festival showcase"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
