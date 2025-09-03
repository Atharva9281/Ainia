import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Sparkles, Heart, BookOpen, Users, Shield, Zap, Play, Star } from 'lucide-react'
import LoginModal from '../components/LoginModal'

const HomePage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-space-accent/20 rounded-full animate-bounce-gentle" />
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-forest-accent/20 rounded-full animate-bounce-gentle" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/6 w-16 h-16 bg-gradient-magic opacity-30 rounded-full animate-bounce-gentle" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-primary/10 rounded-full animate-bounce-gentle" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          {/* Navigation */}
          <nav className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-magic bg-clip-text text-transparent">
                Ainia Quest Cards
              </span>
            </div>
            <Button 
              onClick={() => setShowLoginModal(true)}
              className="bg-gradient-magic hover:opacity-90 text-white px-6 py-2 rounded-full font-semibold shadow-soft"
            >
              Sign In (Parents)
            </Button>
          </nav>

          {/* Main Hero */}
          <div className="text-center max-w-4xl mx-auto mb-20">
            <Badge className="mb-6 bg-gradient-magic text-white px-4 py-2 rounded-full">
              Inspired by Stanford Research & Child Development
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent leading-tight">
              Where Learning Meets Adventure
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              <strong className="text-foreground">AI-powered storytelling companion</strong> for children ages 5-10. 
              Turn every question into an interactive 3-step quest that builds empathy, 
              resilience, and critical thinking through voice-first learning.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                onClick={() => setShowLoginModal(true)}
                className="bg-gradient-magic hover:opacity-90 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-glow flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start Learning Adventure
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="px-8 py-4 rounded-full text-lg font-semibold border-2 border-primary/20 hover:border-primary/40"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </div>

            {/* Hero Image */}
            <div className="rounded-2xl overflow-hidden shadow-2xl mb-16 mx-auto max-w-5xl">
              <img 
                src="/hero-banner.jpg" 
                alt="Children exploring magical forest and space themes"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-purple-50/50 via-blue-50/50 to-emerald-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-magic bg-clip-text text-transparent">
              Learning That Feels Like Play
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Following Ainia's proven approach to social-emotional learning through interactive storytelling
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="border-2 border-purple-200/50 shadow-soft hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-space rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-space-primary">Social-Emotional Learning</CardTitle>
                <CardDescription>
                  Build empathy, resilience, and kindness through character interactions and moral choices
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-emerald-200/50 shadow-soft hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-forest rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-forest-primary">Voice-First Interaction</CardTitle>
                <CardDescription>
                  Audio-forward experience reduces screen time while encouraging natural conversation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-blue-200/50 shadow-soft hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-magic rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-primary">Adaptive Storytelling</CardTitle>
                <CardDescription>
                  Every story adapts to your child's interests and developmental needs
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-purple-200/50 shadow-soft hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-space rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-space-primary">Parent Insights</CardTitle>
                <CardDescription>
                  Understand which skills your child practiced and get home activity suggestions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-emerald-200/50 shadow-soft hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-forest rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-forest-primary">Child-Safe AI</CardTitle>
                <CardDescription>
                  Rigorous content filtering and parental oversight ensure safe, age-appropriate experiences
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-blue-200/50 shadow-soft hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-magic rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-primary">Interactive Choices</CardTitle>
                <CardDescription>
                  Children become co-creators, making meaningful decisions that shape their stories
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How Quest Cards Works</h2>
            <p className="text-xl text-muted-foreground">Simple steps to meaningful learning</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-space rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Ask a Question</h3>
              <p className="text-muted-foreground">Your child asks anything they're curious about - from "Why do stars twinkle?" to "How do friendships work?"</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-forest rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Interactive Story</h3>
              <p className="text-muted-foreground">AI creates a 3-step adventure with choices at each step. Your child becomes the hero of their learning journey.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-magic rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Learn & Grow</h3>
              <p className="text-muted-foreground">Gentle checkpoint questions ensure understanding, while parents get insights into skills practiced.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Parent Testimonials
      <section className="py-20 bg-gradient-to-r from-purple-50/50 via-blue-50/50 to-emerald-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by Parents</h2>
            <p className="text-xl text-muted-foreground">Like Ainia, we prioritize screen time parents can feel good about</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-primary/10 shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg mb-4 italic">
                  "Quest Cards is one of the few apps I don't feel guilty about screen time. 
                  My daughter learns empathy through the stories while practicing critical thinking."
                </p>
                <p className="font-semibold text-primary">- Sarah M., Parent of 7-year-old</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-2 border-primary/10 shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg mb-4 italic">
                  "The parent digest helps me understand exactly what skills my son practiced. 
                  It's like having a learning coach built into our family time."
                </p>
                <p className="font-semibold text-primary">- Michael R., Parent of 6-year-old</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-magic bg-clip-text text-transparent">
              Ready to Start Your Child's Learning Adventure?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join families who've discovered learning that feels like magic
            </p>
            <Button 
              size="lg"
              onClick={() => setShowLoginModal(true)}
              className="bg-gradient-magic hover:opacity-90 text-white px-10 py-4 rounded-full text-xl font-semibold shadow-glow"
            >
              <Play className="w-6 h-6 mr-2" />
              Begin Quest Cards Journey
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Parent sign-in required for child safety and progress tracking
            </p>
          </div>
        </div>
      </section>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  )
}

export default HomePage