import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Ensure production URLs are used
  const host = request.headers.get('host')
  
  if (host?.includes('localhost') && process.env.NODE_ENV === 'production') {
    return NextResponse.redirect(new URL(request.url.replace('localhost:3000', 'mini-tok.vercel.app')))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
