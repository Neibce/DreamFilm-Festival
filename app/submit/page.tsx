'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { Upload, Wand2, CheckCircle } from 'lucide-react'

export default function SubmitPage() {
  const [step, setStep] = useState<'dream' | 'details' | 'review' | 'success'>('dream')
  const [formData, setFormData] = useState({
    dreamDescription: '',
    mood: '',
    themes: '',
    title: '',
    genre: '',
    targetAudience: '',
    director: '',
    email: '',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isStep1Valid = formData.dreamDescription.length > 50
  const isStep2Valid = formData.title && formData.genre && formData.director && formData.email

  const handleSubmit = () => {
    setStep('success')
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Transform Your Dream into Film
            </h1>
            <p className="text-lg text-muted-foreground text-balance">
              Share your dream with our AI-powered platform. We'll transform it into a complete film scenario that the community can vote on and enjoy.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex justify-between mb-8">
              {['Dream', 'Details', 'Review', 'Success'].map((s, i) => (
                <div key={s} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                    step === ['dream', 'details', 'review', 'success'][i]
                      ? 'bg-primary text-primary-foreground'
                      : ['dream', 'details', 'review', 'success'].indexOf(step) > i
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-card text-muted-foreground border border-border'
                  }`}>
                    {i + 1}
                  </div>
                  <span className="text-sm mt-2 text-muted-foreground">{s}</span>
                </div>
              ))}
            </div>
            <div className="h-1 bg-card rounded-full overflow-hidden">
              <div className={`h-full bg-primary transition-all ${
                step === 'dream' ? 'w-1/4' :
                step === 'details' ? 'w-1/2' :
                step === 'review' ? 'w-3/4' :
                'w-full'
              }`} />
            </div>
          </div>

          {/* Step 1: Dream Description */}
          {step === 'dream' && (
            <Card className="p-8 bg-card border-border space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Describe Your Dream</h2>
                <p className="text-muted-foreground">Be as detailed as possible. Include colors, emotions, characters, and scenarios.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="dream" className="text-foreground font-semibold mb-2 block">
                    Your Dream Story
                  </Label>
                  <Textarea
                    id="dream"
                    placeholder="I dreamed about a city made of clouds where memories float like butterflies. There was a mysterious figure trying to collect all the golden memories..."
                    value={formData.dreamDescription}
                    onChange={(e) => handleInputChange('dreamDescription', e.target.value)}
                    className="min-h-48 bg-background border-border text-foreground placeholder:text-muted-foreground resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {formData.dreamDescription.length}/500 characters (minimum 50)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mood" className="text-foreground font-semibold mb-2 block">
                      Primary Mood
                    </Label>
                    <Select value={formData.mood} onValueChange={(value) => handleInputChange('mood', value)}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select mood..." />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="mysterious">Mysterious</SelectItem>
                        <SelectItem value="joyful">Joyful</SelectItem>
                        <SelectItem value="haunting">Haunting</SelectItem>
                        <SelectItem value="adventurous">Adventurous</SelectItem>
                        <SelectItem value="melancholic">Melancholic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="themes" className="text-foreground font-semibold mb-2 block">
                      Themes (comma separated)
                    </Label>
                    <Input
                      id="themes"
                      placeholder="e.g., memories, time travel, mystery"
                      value={formData.themes}
                      onChange={(e) => handleInputChange('themes', e.target.value)}
                      className="bg-background border-border"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setStep('details')}
                disabled={!isStep1Valid}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Film Scenario
              </Button>
            </Card>
          )}

          {/* Step 2: Film Details */}
          {step === 'details' && (
            <Card className="p-8 bg-card border-border space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Film Details</h2>
                <p className="text-muted-foreground">Provide information about your film submission.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-foreground font-semibold mb-2 block">
                    Film Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Give your film a compelling title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="bg-background border-border"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="genre" className="text-foreground font-semibold mb-2 block">
                      Genre
                    </Label>
                    <Select value={formData.genre} onValueChange={(value) => handleInputChange('genre', value)}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select genre..." />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="fantasy">Fantasy</SelectItem>
                        <SelectItem value="scifi">Sci-Fi</SelectItem>
                        <SelectItem value="drama">Drama</SelectItem>
                        <SelectItem value="adventure">Adventure</SelectItem>
                        <SelectItem value="thriller">Thriller</SelectItem>
                        <SelectItem value="romance">Romance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="audience" className="text-foreground font-semibold mb-2 block">
                      Target Audience
                    </Label>
                    <Select value={formData.targetAudience} onValueChange={(value) => handleInputChange('targetAudience', value)}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select audience..." />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="teen">Teen</SelectItem>
                        <SelectItem value="adult">Adult</SelectItem>
                        <SelectItem value="all">All Ages</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="director" className="text-foreground font-semibold mb-2 block">
                    Director Name
                  </Label>
                  <Input
                    id="director"
                    placeholder="Your name (as you'd like it credited)"
                    value={formData.director}
                    onChange={(e) => handleInputChange('director', e.target.value)}
                    className="bg-background border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-foreground font-semibold mb-2 block">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setStep('dream')}
                  variant="outline"
                  className="flex-1 border-border hover:bg-card"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep('review')}
                  disabled={!isStep2Valid}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Review Submission
                </Button>
              </div>
            </Card>
          )}

          {/* Step 3: Review */}
          {step === 'review' && (
            <Card className="p-8 bg-card border-border space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Review Your Submission</h2>
                <p className="text-muted-foreground">Please review your information before submitting.</p>
              </div>

              <div className="space-y-6 bg-background rounded-lg p-6">
                <div className="border-b border-border pb-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">Dream Description</h3>
                  <p className="text-foreground line-clamp-3">{formData.dreamDescription}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">Film Title</h3>
                    <p className="text-foreground">{formData.title}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">Genre</h3>
                    <p className="text-foreground">{formData.genre}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">Director</h3>
                    <p className="text-foreground">{formData.director}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">Email</h3>
                    <p className="text-foreground">{formData.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-blue-400">
                  Your submission will be reviewed by our admin team within 24 hours. You'll receive an email confirmation once approved.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setStep('details')}
                  variant="outline"
                  className="flex-1 border-border hover:bg-card"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Submit Dream
                </Button>
              </div>
            </Card>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <Card className="p-8 bg-card border-border text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Dream Submitted!</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Thank you for submitting your dream. Our AI will transform it into a film scenario, and our admins will review it shortly. You'll receive an email confirmation once approved.
                </p>
              </div>

              <div className="bg-background rounded-lg p-6 space-y-2 text-left">
                <p className="text-sm text-muted-foreground">Confirmation sent to:</p>
                <p className="text-foreground font-semibold">{formData.email}</p>
              </div>

              <Button
                onClick={() => window.location.href = '/explore'}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Explore Films
              </Button>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
