"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  variant?: "landing" | "dashboard"
  isConfigured?: boolean
  onSignOut?: () => void
}

export function Header({ variant = "landing", isConfigured = true, onSignOut }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="App Logo"
            width={32}
            height={32}
            className="rounded-md"
          />
          <span className="text-lg font-semibold">App Name</span>
        </Link>
        
        <nav className="flex items-center gap-2">
          {variant === "landing" && (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm" disabled={!isConfigured}>
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" disabled={!isConfigured}>
                  Sign Up
                </Button>
              </Link>
            </>
          )}
          {variant === "dashboard" && onSignOut && (
            <Button variant="outline" size="sm" onClick={onSignOut} className="bg-transparent">
              Sign Out
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
