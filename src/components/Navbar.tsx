'use client'

import Link from 'next/link'
import { ProfileButton } from './ProfileButton'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  
  // Don't show navbar on auth pages
  if (pathname === '/login' || pathname === '/signup') {
    return null
  }

  // Debug log to check session data
  console.log('Session data:', session)

  return (
    <nav className="bg-white border-b border-coastal-sand">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="flex items-center space-x-8">
          {/* Logo and Home Link */}
          <Link 
            href="/dashboard" 
            className="flex items-center space-x-2 text-coastal-ocean hover:text-coastal-oceanLight transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
              />
            </svg>
            <span className="font-medium">Dashboard</span>
          </Link>

          {/* Navigation Links - Only shown to admin */}
          {session?.user?.email === 'tjcarroll1@me.com' && (
            <div className="flex items-center space-x-6">
              <Link 
                href="/courses" 
                className={`text-sm font-medium ${
                  pathname.startsWith('/courses') 
                    ? 'text-coastal-teal' 
                    : 'text-coastal-ocean/70 hover:text-coastal-ocean'
                }`}
              >
                Courses
              </Link>
              <Link 
                href="/admin/courses" 
                className={`text-sm font-medium ${
                  pathname.startsWith('/admin') 
                    ? 'text-coastal-teal' 
                    : 'text-coastal-ocean/70 hover:text-coastal-ocean'
                }`}
              >
                Admin
              </Link>
            </div>
          )}
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          <ProfileButton />
        </div>
      </div>
    </nav>
  )
} 