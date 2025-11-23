'use client'

export function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-accent/5 p-12 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10"></div>
          
          <h2 className="text-4xl font-bold mb-4">Ready to Create?</h2>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Join thousands of dreamers transforming imagination into cinema
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition">
              Start Your Dream Now
            </button>
            <button className="px-8 py-3 border border-primary/50 text-primary rounded-lg font-semibold hover:bg-primary/5 transition">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
