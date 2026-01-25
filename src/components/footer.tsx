import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Next.js Firebase Template</h3>
            <p className="text-sm text-muted-foreground">
              A production-ready template combining Next.js, Firebase, and
              Terraform.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={ROUTES.SETUP}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Setup Guide
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.DASHBOARD}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/fdzlabs/nextjs-firebase-template"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://nextjs.org/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Next.js Docs
                </a>
              </li>
              <li>
                <a
                  href="https://firebase.google.com/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Firebase Docs
                </a>
              </li>
              <li>
                <a
                  href="https://ui.shadcn.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  shadcn/ui
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            Built with Next.js and Firebase by{' '}
            <a
              href="https://fdzlabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-foreground transition-colors"
            >
              FDZ Labs
            </a>
            . Deploy your own with Vercel.
          </p>
        </div>
      </div>
    </footer>
  );
}
