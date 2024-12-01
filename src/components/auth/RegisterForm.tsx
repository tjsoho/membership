'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface RegisterFormProps {
  onBackToLogin: () => void
}

export function RegisterForm({ onBackToLogin }: RegisterFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log('👋 User clicked submit button')
    
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    }
    
    console.log('📧 User is trying to register with email:', data.email)

    try {
      console.log('🚀 Sending data to server...')
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        console.log('❌ Something went wrong:', res.status)
        const data = await res.json()
        throw new Error(data.error || 'Failed to register')
      }

      console.log('✅ Registration successful!')
      onBackToLogin() // Instead of redirecting, switch back to login
    } catch (error) {
      console.log('💥 Error caught:', error)
      setError(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-coastal-dark-grey">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 block w-full rounded-lg border border-coastal-sand px-3 py-2
                   focus:border-coastal-dark-teal focus:ring-coastal-dark-teal
                   bg-white/90"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-coastal-dark-grey">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 block w-full rounded-lg border border-coastal-sand px-3 py-2
                   focus:border-coastal-dark-teal focus:ring-coastal-dark-teal
                   bg-white/90"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-coastal-dark-grey">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="mt-1 block w-full rounded-lg border border-coastal-sand px-3 py-2
                   focus:border-coastal-dark-teal focus:ring-coastal-dark-teal
                   bg-white/90"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-coastal-dark-teal px-4 py-2 text-white 
                 hover:bg-coastal-light-teal transition-colors duration-200
                 disabled:bg-coastal-light-teal/50"
      >
        {isLoading ? 'Creating account...' : 'Create account'}
      </button>

      <div className="text-sm text-center">
        <button 
          type="button"
          onClick={onBackToLogin}
          className="text-coastal-dark-teal hover:text-coastal-light-teal transition-colors"
        >
          Already have an account? Sign in
        </button>
      </div>
    </form>
  )
} 