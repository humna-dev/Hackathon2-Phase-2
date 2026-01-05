import { NextRequest, NextResponse } from 'next/server'

// This function runs before every route
export function middleware(request: NextRequest) {
  // Public routes that don't require authentication
  const publicPaths = ['/auth/login', '/auth/register', '/']

  const isPublicPath = publicPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  // Get token from cookies (if we were storing it in cookies)
  // For now, we'll handle authentication on the client-side since we're using localStorage
  // But we can still redirect if we know the user is not logged in

  // For this implementation, we'll allow all routes and handle authentication on the client-side
  // since localStorage is only accessible on the client
  return NextResponse.next()
}

// Specify which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}