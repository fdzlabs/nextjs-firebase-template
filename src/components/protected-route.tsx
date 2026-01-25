'use client';

import type React from 'react';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-provider';
import { ROUTES } from '@/constants/routes';

export default function ProtectedRoute({
  hideSkeleton,
  children,
}: {
  children: React.ReactNode;
  hideSkeleton?: boolean;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(ROUTES.AUTH.SIGNIN);
    }
  }, [user, loading, router]);

  if (loading && !hideSkeleton) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return user ? <>{children}</> : null;
}
