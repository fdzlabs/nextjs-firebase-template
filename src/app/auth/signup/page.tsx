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
import { SignUpForm } from '@/components/auth/signup-form'
import { isConfigured } from '@/lib/firebase-env'
import { ROUTES } from '@/constants/routes'

export default function SignUp() {
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
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Create a new account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-muted-foreground text-sm">
            Already have an account?{' '}
            <Link
              href={ROUTES.AUTH.SIGNIN}
              className="text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
