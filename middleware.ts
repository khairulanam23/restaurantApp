import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is a dashboard route
  if (pathname.startsWith("/dashboard")) {
    // In a real app, you'd verify the JWT token here
    // For now, we'll just check if there's a user in localStorage (client-side)
    // This is handled by the dashboard components themselves
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
