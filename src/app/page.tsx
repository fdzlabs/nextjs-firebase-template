import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Shield, Database, Zap, Lock, Users, Cloud } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Next.js Firebase Template - Production Ready Starter',
  description:
    'A robust, production-ready template for shipping web applications fast. Combines Next.js, Firebase Auth, Firestore, and Terraform for infrastructure as code.',
  keywords: [
    'Next.js',
    'Firebase',
    'Terraform',
    'React',
    'TypeScript',
    'Authentication',
    'Firestore',
    'Template',
    'Starter Kit',
  ],
  authors: [{ name: 'FDZ Labs', url: 'https://fdzlabs.com' }],
  creator: 'FDZ Labs',
  publisher: 'FDZ Labs',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    title: 'Next.js Firebase Template - Production Ready Starter',
    description:
      'A robust, production-ready template for shipping web applications fast.',
    siteName: 'Next.js Firebase Template',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js Firebase Template',
    description: 'Production-ready Next.js + Firebase + Terraform template',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Esta función verifica la configuración en el servidor
function isFirebaseConfigured() {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ];

  return requiredVars.every(
    (varName) =>
      process.env[varName] && process.env[varName] !== 'demo-api-key',
  );
}

const features = [
  {
    icon: Shield,
    title: 'Firebase Authentication',
    description:
      'Secure user authentication with email/password and Google Sign-In out of the box.',
  },
  {
    icon: Database,
    title: 'Firestore Database',
    description:
      'Real-time NoSQL database for storing and syncing data across clients.',
  },
  {
    icon: Cloud,
    title: 'Cloud Storage',
    description:
      'Store and serve user-generated content like images and files with ease.',
  },
  {
    icon: Zap,
    title: 'Fast Setup',
    description:
      'Get started in minutes with pre-configured authentication flows and database rules.',
  },
  {
    icon: Lock,
    title: 'Secure by Default',
    description:
      'Built-in security rules and best practices for protecting user data.',
  },
  {
    icon: Users,
    title: 'User Management',
    description:
      'Complete user profile management with protected routes and sessions.',
  },
];

export default function Home() {
  const configured = isFirebaseConfigured();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="px-4 pt-20 pb-20 md:pt-32 md:pb-28">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-balance md:text-6xl">
            Start building in seconds
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
            Kickstart your next project with this Firebase starter template.
            Authentication, database, and storage - all pre-configured and ready
            to go.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href={ROUTES.AUTH.SIGNUP}>
              <Button size="lg" disabled={!configured}>
                Get Started
              </Button>
            </Link>
            <Link href={ROUTES.SETUP}>
              <Button variant="outline" size="lg">
                View Setup Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need to get started
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              This template includes all the essentials for building a modern
              web application with Firebase.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border bg-card">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <feature.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-border bg-card p-8 text-center md:p-12">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Ready to build your next app?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Sign up now and start building with Firebase authentication and
              Firestore database in minutes.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href={ROUTES.AUTH.SIGNUP}>
                <Button size="lg" disabled={!configured}>
                  Create Account
                </Button>
              </Link>
              <Link href={ROUTES.AUTH.SIGNIN}>
                <Button variant="ghost" size="lg" disabled={!configured}>
                  Sign In
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
