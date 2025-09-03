import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'
import { Sparkles } from 'lucide-react'
import { signInWithGoogle } from '../lib/auth'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await signInWithGoogle()
      // Modal will close automatically when auth state changes
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in')
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-background via-accent/20 to-background border-2 border-primary/20 shadow-glow">

        <DialogHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto w-16 h-16 bg-gradient-magic rounded-full flex items-center justify-center shadow-soft">
            <Sparkles className="w-8 h-8 text-white animate-bounce-gentle" />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-bold bg-gradient-magic bg-clip-text text-transparent">
              Parent Portal
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Sign in to access your child's learning progress and insights
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {error && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Google OAuth Button */}
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full h-12 text-base font-semibold bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 shadow-soft"
            variant="outline"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>
                {isLoading ? "Connecting..." : "Continue with Google"}
              </span>
            </div>
          </Button>

          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-background px-4 text-sm text-muted-foreground">
                Why sign in?
              </span>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-space-bg/30 border border-space-accent/20">
              <div className="w-6 h-6 bg-gradient-space rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">📊</span>
              </div>
              <div>
                <h4 className="font-semibold text-space-primary text-sm">Track Progress</h4>
                <p className="text-muted-foreground text-xs">See which skills your child is developing</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-forest-bg/30 border border-forest-accent/20">
              <div className="w-6 h-6 bg-gradient-forest rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">🏠</span>
              </div>
              <div>
                <h4 className="font-semibold text-forest-primary text-sm">Home Activities</h4>
                <p className="text-muted-foreground text-xs">Get personalized learning suggestions</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-magic/10 border border-primary/20">
              <div className="w-6 h-6 bg-gradient-magic rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">✨</span>
              </div>
              <div>
                <h4 className="font-semibold text-primary text-sm">Safe Learning</h4>
                <p className="text-muted-foreground text-xs">Child-safe AI with parental oversight</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Your child's data is kept safe and private. We never share personal information.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LoginModal
