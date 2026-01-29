'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { HeaderAuthActions } from '@/components/header/auth-actions';
import { ThemeToggle } from '@/components/header/theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={ROUTES.HOME} className="flex items-center gap-2">
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
          <ThemeToggle />
          <HeaderAuthActions />
        </nav>
      </div>
    </header>
  );
}
