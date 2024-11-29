'use client'

import { useState } from 'react'
import Link from 'next/link'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    // Validate email
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Failed to process request')
      }

      setSuccess(true)
    } catch (error) {
      setError('Failed to send reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <p className="text-coastal-teal">
          If an account exists with that email, you will receive reset instructions shortly.
        </p>
        <Link 
          href="/login"
          className="text-coastal-ocean hover:text-coastal-oceanLight transition-colors inline-block"
        >
          Return to login
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-coastal-teal">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-lg border border-coastal-sandDark px-3 py-2
                     focus:border-coastal-oceanLight focus:ring-coastal-oceanLight
                     bg-white/90"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-coastal-ocean px-4 py-2 text-white 
                   hover:bg-coastal-oceanLight transition-colors duration-200
                   disabled:bg-coastal-oceanLight/50"
        >
          {isLoading ? 'Sending...' : 'Send Reset Instructions'}
        </button>

        <Link 
          href="/login"
          className="text-sm text-center text-coastal-teal hover:text-coastal-tealLight 
                     transition-colors block"
        >
          Back to login
        </Link>
      </div>
    </form>
  )
} 