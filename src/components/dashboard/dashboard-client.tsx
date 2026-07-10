'use client'

import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth-provider'
import { ROUTES } from '@/constants/routes'

export function DashboardClient() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Dashboard</CardTitle>
        <CardDescription>
          Welcome to your Firebase starter dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted rounded-lg p-4">
          <p className="font-medium">User Information</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Email: {user.email}
          </p>
          <p className="text-muted-foreground text-sm">User ID: {user.uid}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm">
            Open your profile to try Firestore document CRUD and Storage avatar
            uploads.
          </p>
          <Link href={ROUTES.AUTH.PROFILE}>
            <Button variant="outline" className="w-full">
              Edit Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
