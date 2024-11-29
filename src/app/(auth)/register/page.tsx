'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
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
      router.push('/login?registered=true')
    } catch (error) {
      console.log('💥 Error caught:', error)
      setError(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-coastal-shell to-coastal-sand">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-coastal-ocean">Create an account</h2>
            <p className="mt-2 text-coastal-teal">
              Sign up to access your courses
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-coastal-teal">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full rounded-lg border border-coastal-sandDark px-3 py-2
                         focus:border-coastal-oceanLight focus:ring-coastal-oceanLight
                         bg-white/90"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-coastal-teal">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full rounded-lg border border-coastal-sandDark px-3 py-2
                         focus:border-coastal-oceanLight focus:ring-coastal-oceanLight
                         bg-white/90"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-coastal-teal">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-coastal-ocean px-4 py-2 text-white 
                       hover:bg-coastal-oceanLight transition-colors duration-200
                       disabled:bg-coastal-oceanLight/50"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>

            <div className="text-sm text-center">
              <Link 
                href="/login" 
                className="text-coastal-teal hover:text-coastal-tealLight transition-colors"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 