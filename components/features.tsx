'use client'

export function Features() {
  const features = [
    {
      icon: '💭',
      title: 'Submit Your Dreams',
      description: 'Share your wildest dreams and imaginative concepts with our creative community'
    },
    {
      icon: '🎬',
      title: 'AI Transformation',
      description: 'Watch as advanced AI transforms your dreams into compelling film scenarios and scripts'
    },
    {
      icon: '⭐',
      title: 'Community Voting',
      description: 'Vote on your favorite films and help choose award-winning creations'
    },
    {
      icon: '🏆',
      title: 'Judging System',
      description: 'Expert judges evaluate and score films across multiple creative criteria'
    },
    {
      icon: '🎥',
      title: 'Professional Review',
      description: 'Get detailed feedback from industry judges and peer reviewers'
    },
    {
      icon: '🌟',
      title: 'Win Recognition',
      description: 'Compete for prestigious awards and showcase your work globally'
    }
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Key Features</h2>
          <p className="text-xl text-muted-foreground text-balance">
            Everything you need to create, share, and celebrate AI-powered films
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="p-6 rounded-xl border border-border bg-background/50 hover:border-primary/50 transition group">
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
