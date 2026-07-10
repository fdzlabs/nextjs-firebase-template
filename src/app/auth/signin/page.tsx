import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { SignInForm } from '@/components/auth/signin-form'
import { isConfigured } from '@/lib/firebase-env'
import { ROUTES } from '@/constants/routes'

export default function SignIn() {
  if (!isConfigured) {
    redirect(ROUTES.SETUP)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Image
              src="/firebase-logo.png"
              alt="Firebase Logo"
              width={120}
              height={40}
              className="h-auto"
            />
          </div>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-muted-foreground text-sm">
            Don&apos;t have an account?{' '}
            <Link
              href={ROUTES.AUTH.SIGNUP}
              className="text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
