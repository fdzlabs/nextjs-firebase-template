import type React from 'react';
import ProtectedRoute from '@/components/protected-route';
import { ProfileSkeleton } from './page.component';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute skeleton={<ProfileSkeleton />}>{children}</ProtectedRoute>
  );
}
