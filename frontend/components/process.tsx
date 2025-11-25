'use client'

export function Process() {
  const steps = [
    { num: '1', title: 'Submit', desc: 'Share your dream description' },
    { num: '2', title: 'AI Creates', desc: 'AI generates film scenario' },
    { num: '3', title: 'Review', desc: 'Admins approve the film' },
    { num: '4', title: 'Showcase', desc: 'Film goes live' },
    { num: '5', title: 'Vote', desc: 'Community votes' },
    { num: '6', title: 'Judge', desc: 'Expert judges score' }
  ]

  return (
    <section id="process" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground">
            From dream to screen in six simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-6 gap-4 md:gap-2">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-lg text-primary-foreground mb-4">
                {step.num}
              </div>
              <h3 className="font-bold text-center mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground text-center">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute ml-32 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
