import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// CORS middleware function
function corsMiddleware(request: NextRequest) {
  const origin = request.headers.get('origin')
  
  // List of allowed origins
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://www.savetime-makemoney.com/', // Add your marketing site domain
  ]

  // Handle CORS for API routes
  if (request.url.includes('/api/external')) {
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        headers: {
          'Access-Control-Allow-Origin': origin || '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      })
    }

    // Add CORS headers for actual requests
    const response = NextResponse.next()
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }
    return response
  }

  // For non-API routes, continue with normal flow
  return NextResponse.next()
}

// Combine with auth middleware
export default withAuth({
  pages: {
    signIn: '/api/auth/signin',
  },
  callbacks: {
    authorized: ({ req, token }) => {
      // Handle CORS first
      if (req.url.includes('/api/external')) {
        return true // Allow external API routes without auth
      }
      
      // Then check auth for protected routes
      return !!token
    },
  }
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/courses/:path*',
    '/api/external/:path*', // Add this to handle external API routes
    // Add other protected routes here
  ]
} 