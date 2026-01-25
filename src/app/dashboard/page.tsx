'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-provider';
import { ROUTES } from '@/constants/routes';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Dashboard</CardTitle>
          <CardDescription>
            Welcome to your Firebase starter dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium">User Information</p>
            <p className="text-sm text-muted-foreground mt-1">
              Email: {user?.email}
            </p>
            <p className="text-sm text-muted-foreground">
              User ID: {user?.uid}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm">
              This is a starter dashboard. You can extend it with Firebase
              Firestore, Storage, and other services.
            </p>
            <Link href={ROUTES.AUTH.PROFILE}>
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
