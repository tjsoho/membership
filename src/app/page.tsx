/******************************************************************************
                                IMPORTS
******************************************************************************/
'use client'

import Image from "next/image"
import { useState, useEffect } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { useSearchParams } from 'next/navigation'

/******************************************************************************
                              TYPES & CONSTANTS
******************************************************************************/
type AuthMode = 'welcome' | 'login' | 'register' | 'forgot-password' | 'reset-password'

const codingNotes = [
  {
    title: "Authentication Flow",
    notes: [/* ... */]
  },
  // ... other notes
]

const titles = {
  'welcome': 'Welcome to Your Learning Journey',
  'login': 'Sign in to your account',
  'register': 'Create your account',
  'forgot-password': 'Reset your password',
  'reset-password': 'Set new password'
}

/******************************************************************************
                              MAIN COMPONENT
******************************************************************************/
export default function AuthPage() {
  const [mounted, setMounted] = useState(false)
  const [mode, setMode] = useState<AuthMode>('welcome')
  const [showNotes, setShowNotes] = useState(false)
  const searchParams = useSearchParams()
  const resetToken = searchParams.get('token')

  // Set initial mode based on token presence
  useEffect(() => {
    if (resetToken) {
      setMode('reset-password')
    }
    setMounted(true)
  }, [resetToken])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Full-bleed Image with Shimmer */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <Image
          src="/images/pool.jpg"
          alt="Learning Platform"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 shimmer" />
      </div>

      {/* Right side - Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-coastal-light-grey">
        <div className="w-full max-w-md mx-auto px-6 py-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg space-y-8">
            <h1 className="text-3xl font-bold tracking-tight text-coastal-dark-teal text-center">
              {titles[mode]}
            </h1>

            <div className="w-full max-w-sm mx-auto">
              {mode === 'welcome' && (
                <div className="space-y-6">
                  <p className="text-lg text-coastal-dark-grey">
                    Start your learning journey today. Access premium courses and grow your skills at your own pace.
                  </p>
                  <div className="space-y-4">
                    <button
                      onClick={() => setMode('login')}
                      className="w-full rounded-lg bg-coastal-dark-teal px-6 py-3 text-white 
                             hover:bg-coastal-light-teal transition-colors duration-200
                             font-semibold"
                    >
                      Sign in to your account
                    </button>
                    <button
                      onClick={() => setMode('register')}
                      className="w-full rounded-lg border-2 border-coastal-dark-teal px-6 py-3 
                             text-coastal-dark-teal hover:bg-coastal-dark-teal hover:text-white 
                             transition-colors duration-200 font-semibold"
                    >
                      Create new account
                    </button>
                  </div>
                  <p className="text-sm text-center text-coastal-dark-grey">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              )}

              {mode === 'login' && <LoginForm onForgotPassword={() => setMode('forgot-password')} />}
              {mode === 'register' && <RegisterForm onBackToLogin={() => setMode('login')} />}
              {mode === 'forgot-password' && <ForgotPasswordForm onBackToLogin={() => setMode('login')} />}
              {mode === 'reset-password' && resetToken && <ResetPasswordForm token={resetToken} />}
            </div>

            {mode !== 'welcome' && mode !== 'reset-password' && (
              <div className="pt-4 text-center">
                {mode === 'login' ? (
                  <p className="text-sm text-coastal-dark-grey">
                    Don&apos;t have an account?{' '}
                    <button
                      onClick={() => setMode('register')}
                      className="text-coastal-dark-teal hover:text-coastal-light-teal 
                               transition-colors font-semibold"
                    >
                      Register
                    </button>
                  </p>
                ) : mode === 'register' ? (
                  <p className="text-sm text-coastal-dark-grey">
                    Already have an account?{' '}
                    <button
                      onClick={() => setMode('login')}
                      className="text-coastal-dark-teal hover:text-coastal-light-teal 
                               transition-colors font-semibold"
                    >
                      Sign in
                    </button>
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}