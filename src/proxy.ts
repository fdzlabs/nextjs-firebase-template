import { NextResponse } from "next/server"

export function proxy() {
  // Add any middleware logic here
  // For example, you could redirect unauthenticated users
  // or add headers to the response
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Add paths that should be protected by the proxy
    // '/dashboard/:path*',
  ],
}
