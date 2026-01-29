'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CreditCard, LogOut, User } from 'lucide-react';
import { signOut } from 'firebase/auth';

import { useAuth } from '@/components/auth-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes';
import { auth } from '@/lib/firebase';

function isFirebaseConfigured() {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'demo-api-key'
  );
}

export function HeaderAuthActions() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isConfigured = isFirebaseConfigured();

  const getUserInitials = (email: string | null | undefined) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  const getDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push(ROUTES.HOME);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  if (!user) {
    return (
      <>
        <Link href={ROUTES.AUTH.SUBSCRIPTION}>
          <Button variant="ghost" size="sm">
            Pricing
          </Button>
        </Link>
        <Link href={ROUTES.AUTH.SIGNIN}>
          <Button variant="ghost" size="sm" disabled={!isConfigured}>
            Sign In
          </Button>
        </Link>
        <Link href={ROUTES.AUTH.SIGNUP}>
          <Button size="sm" disabled={!isConfigured}>
            Sign Up
          </Button>
        </Link>
      </>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.photoURL || undefined} alt={getDisplayName()} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getUserInitials(user.email)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={ROUTES.DASHBOARD}>
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
        </Link>
        <Link href={ROUTES.AUTH.SUBSCRIPTION}>
          <DropdownMenuItem className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Subscription</span>
          </DropdownMenuItem>
        </Link>
        <Link href={ROUTES.AUTH.PROFILE}>
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
