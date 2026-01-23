import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Add any middleware logic here
  // For example, you could redirect unauthenticated users
  // or add headers to the response
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Add paths that should be protected by the middleware
    // '/dashboard/:path*',
  ],
}
