'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut } from 'lucide-react';
import type { User as FirebaseUser } from 'firebase/auth';

interface HeaderProps {
  variant?: 'landing' | 'dashboard';
  isConfigured?: boolean;
  onSignOut?: () => void;
  user?: FirebaseUser | null;
}

export function Header({
  variant = 'landing',
  isConfigured = true,
  onSignOut,
  user,
}: HeaderProps) {
  // Get user initials for avatar fallback
  const getUserInitials = (email: string | null | undefined) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  // Get display name or email
  const getDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };
  console.log('user', user);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
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
          {variant === 'landing' && (
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
          {variant === 'dashboard' && user && onSignOut && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.photoURL || undefined}
                      alt={getDisplayName()}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserInitials(user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {getDisplayName()}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled className="cursor-not-allowed">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onSignOut}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </div>
    </header>
  );
}
