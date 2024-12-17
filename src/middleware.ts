import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// CORS middleware function
function corsMiddleware(request: NextRequest) {
  console.log('🔍 CORS Middleware - Request URL:', request.url)
  console.log('🔍 CORS Middleware - Request Method:', request.method)
  
  const origin = request.headers.get('origin')
  console.log('🔍 Request Origin:', origin)
  
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://www.savetime-makemoney.com',
  ]
  console.log('✅ Allowed Origins:', allowedOrigins)

  // Handle CORS for external API routes
  if (request.url.includes('/api/external')) {
    console.log('👉 Processing external API request')
    
    if (request.method === 'OPTIONS') {
      console.log('👉 Handling OPTIONS preflight request')
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      })
    }

    // Add CORS headers for actual requests
    console.log('👉 Adding CORS headers to response')
    const response = NextResponse.next()
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  }

  return NextResponse.next()
}

// Export the combined middleware
export default withAuth({
  pages: {
    signIn: '/api/auth/signin',
  },
  callbacks: {
    authorized: ({ req, token }) => {
      console.log('🔒 Auth Check - URL:', req.url)
      
      // If it's an external API route
      if (req.url.includes('/api/external')) {
        console.log('✅ External API route - allowing without auth')
        
        // Apply CORS middleware
        const corsResponse = corsMiddleware(req)
        if (corsResponse.headers.has('Access-Control-Allow-Origin')) {
          console.log('✅ CORS headers added')
          return true
        }
        
        return true // Allow external API routes without auth
      }
      
      // For all other routes, require authentication
      console.log('🔒 Protected route - checking token:', !!token)
      return !!token
    },
  }
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/courses/:path*',
    '/api/external/:path*',
  ]
} 