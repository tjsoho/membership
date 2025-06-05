'use client'

import Image from "next/image"
import { useSearchParams } from 'next/navigation'
import { ResetPasswordForm } from '../../components/auth/ResetPasswordForm'
import React from "react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  if (!token) {
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

        {/* Right side - Error Content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-coastal-light-grey">
          <div className="w-full max-w-md mx-auto px-6 py-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg space-y-8">
              <h1 className="text-3xl font-bold tracking-tight text-coastal-dark-teal text-center">
                Invalid Reset Link
              </h1>
              <p className="text-red-500 text-center">
                The password reset link is invalid or has expired. Please request a new one.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
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
              Reset Your Password
            </h1>
            <div className="w-full max-w-sm mx-auto">
              <ResetPasswordForm token={token} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}