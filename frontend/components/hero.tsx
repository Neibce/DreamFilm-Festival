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
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
              <p className="text-primary text-sm font-medium">✨ AI-Powered Filmmaking</p>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold text-balance leading-tight">
              Transform Your <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Dreams into Cinema</span>
            </h1>
            
            <p className="text-xl text-muted-foreground text-balance leading-relaxed">
              Submit your wildest dreams. Watch AI transform them into stunning film scenarios. Vote for your favorites and compete for glory.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition">
                Submit Your Dream
              </button>
              <button className="px-8 py-3 border border-primary/50 text-primary rounded-lg font-semibold hover:bg-primary/5 transition">
                Explore Films
              </button>
            </div>

            <div className="flex gap-6 text-sm text-muted-foreground pt-4">
              <div>
                <p className="font-bold text-accent">2,847+</p>
                <p>Dreams Submitted</p>
              </div>
              <div>
                <p className="font-bold text-accent">1,203</p>
                <p>Films Created</p>
              </div>
              <div>
                <p className="font-bold text-accent">15K+</p>
                <p>Active Community</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl border border-primary/20 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-primary/30 rounded-full animate-pulse"></div>
              </div>
              <img
                src="/film-production-with-ai-elements.jpg"
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
