'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { signIn } from 'next-auth/react'

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  // Check if passwords match whenever either password changes
  const checkPasswordsMatch = (password: string, confirmPassword: string) => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword)
    } else {
      setPasswordsMatch(null)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    checkPasswordsMatch(e.target.value, confirmPassword)
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    checkPasswordsMatch(password, e.target.value)
  }

  const isValidPassword = (password: string): { isValid: boolean; message: string } => {
    if (password.length < 8) {
      return { 
        isValid: false, 
        message: 'Password must be at least 8 characters long' 
      }
    }

    if (!/\d/.test(password)) {
      return { 
        isValid: false, 
        message: 'Password must contain at least one number' 
      }
    }

    if (!/[a-zA-Z]/.test(password)) {
      return { 
        isValid: false, 
        message: 'Password must contain at least one letter' 
      }
    }

    return { isValid: true, message: '' }
  }

 
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const passwordCheck = isValidPassword(password)
    if (!passwordCheck.isValid) {
      setError(passwordCheck.message)
      return
    }

    setIsLoading(true)

    try {
      // Reset the password
      const resetResponse = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      if (!resetResponse.ok) {
        const errorData = await resetResponse.text()
        let errorMessage = 'Failed to reset password. Please try again.'
        try {
          const parsedError = JSON.parse(errorData)
          errorMessage = parsedError.error || errorMessage
        } catch {
          errorMessage = errorData || errorMessage
        }
        throw new Error(errorMessage)
      }

      const resetData = await resetResponse.json()
      setIsSuccess(true)

      // Try to sign in with the email from the response
      if (resetData.email) {
        const result = await signIn('credentials', {
          email: resetData.email,
          password: password,
          redirect: false,
        })

        if (result?.error) {
          // If login fails, redirect to login page with success message
          router.push('/?reset=success')
        } else {
          // If login succeeds, redirect to dashboard
          router.push('/dashboard')
        }
      } else {
        // If no email in response, redirect to login
        router.push('/?reset=success')
      }

    } catch (error) {
      console.error('Reset password error:', error)
      setError(error instanceof Error 
        ? error.message 
        : 'Unable to reset password. Please try again or contact support.')
    } finally {
      setIsLoading(false)
    }
  }

  // Simple password requirements check
  const getPasswordStrength = (password: string): { strength: string; color: string } => {
    if (password.length === 0) return { strength: '', color: '' }
    
    const hasMinLength = password.length >= 8
    const hasNumber = /\d/.test(password)
    const hasLetter = /[a-zA-Z]/.test(password)

    if (hasMinLength && hasNumber && hasLetter) {
      return { strength: 'Password meets requirements', color: 'text-green-500' }
    }
    return { strength: 'Password requirements not met', color: 'text-orange-500' }
  }

  const passwordStrength = getPasswordStrength(password)

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="text-green-500 font-medium">
          Password reset successful!
        </div>
        <p className="text-coastal-dark-grey">
          Redirecting you to the dashboard...
        </p>
        <div className="animate-spin h-6 w-6 border-4 border-coastal-dark-teal border-t-transparent rounded-full mx-auto"></div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-coastal-teal">
          New Password
        </label>
        <div className="relative mt-1">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            required
            minLength={8}
            className="block w-full rounded-lg border border-coastal-sandDark px-3 py-2 pr-10
                     focus:border-coastal-oceanLight focus:ring-coastal-oceanLight
                     bg-white/90"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-coastal-dark-grey"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        {password && (
          <div className="mt-1 text-sm">
            <p className={passwordStrength.color}>
              {passwordStrength.strength}
            </p>
            <ul className="text-coastal-dark-grey mt-1 list-disc pl-5">
              <li>At least 8 characters</li>
              <li>At least one number</li>
              <li>At least one letter</li>
            </ul>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-coastal-teal">
          Confirm Password
        </label>
        <div className="relative mt-1">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
            className="block w-full rounded-lg border border-coastal-sandDark px-3 py-2 pr-10
                     focus:border-coastal-oceanLight focus:ring-coastal-oceanLight
                     bg-white/90"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-coastal-dark-grey"
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        {passwordsMatch !== null && (
          <p className={`mt-1 text-sm ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
            {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
          </p>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <button
          type="submit"
          disabled={isLoading || !passwordsMatch || password.length < 8}
          className="w-full rounded-lg bg-coastal-dark-teal px-6 py-3 text-white 
                     hover:bg-coastal-light-teal transition-colors duration-200
                     font-semibold disabled:bg-coastal-light-teal/50"
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>

        <button
          type="button"
          onClick={() => router.push('/login')}
          className="w-full rounded-lg border-2 border-coastal-dark-teal px-6 py-3 
                     text-coastal-dark-teal hover:bg-coastal-dark-teal hover:text-white 
                     transition-colors duration-200 font-semibold"
        >
          Back to Login
        </button>
      </div>
    </form>
  )
} 
