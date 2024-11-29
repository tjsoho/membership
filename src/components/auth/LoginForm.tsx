'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const response = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    })

    setIsLoading(false)

    if (!response?.error) {
      router.push('/dashboard')
      router.refresh()
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-coastal-ocean px-4 py-2 text-white 
                     hover:bg-coastal-oceanLight transition-colors duration-200
                     disabled:bg-coastal-oceanLight/50"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>

        <Link
          href="/forgot-password"
          className="text-sm text-coastal-teal hover:text-coastal-tealLight transition-colors"
        >
          Forgot Password?
        </Link>
      </div>
    </form>
  )
} 