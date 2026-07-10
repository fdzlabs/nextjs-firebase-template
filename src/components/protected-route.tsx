'use client'

import type React from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './auth-provider'
import { isConfigured } from '@/lib/firebase-env'
import { ROUTES } from '@/constants/routes'

export default function ProtectedRoute({
  children,
  skeleton,
}: {
  children: React.ReactNode
  skeleton?: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isConfigured) {
      router.replace(ROUTES.SETUP)
      return
    }

    if (!loading && !user) {
      router.push(ROUTES.AUTH.SIGNIN)
    }
  }, [user, loading, router])

  if (!isConfigured || loading) {
    return (
      <>
        {skeleton ?? (
          <div className="flex min-h-screen items-center justify-center">
            Loading...
          </div>
        )}
      </>
    )
  }

  return user ? <>{children}</> : null
}
