'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/header';
import { ROUTES } from '@/constants/routes';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (!currentUser) {
        router.push(ROUTES.AUTH.SIGNIN);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push(ROUTES.HOME);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Header variant="dashboard" />
        <div className="flex min-h-screen flex-col items-center justify-center p-4 pt-20">
          <Card className="w-full max-w-md">
            <CardHeader>
              <Skeleton className="h-8 w-1/2 mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full mb-4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header variant="dashboard" onSignOut={handleSignOut} user={user} />
      <div className="flex min-h-screen flex-col items-center justify-center p-4 pt-20 bg-background">
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
      </div>
    </>
  );
}
