import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import FirebaseConfigGuide from "@/components/firebase-config-guide"

export default function Setup() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image src="/firebase-logo.png" alt="Firebase Logo" width={150} height={50} className="h-auto" />
          </div>
          <CardTitle className="text-2xl">Firebase Starter Setup</CardTitle>
          <CardDescription>Follow these steps to set up your Firebase project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Step 1: Create a Firebase Project</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                Go to the{" "}
                <a
                  href="https://console.firebase.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Firebase Console
                </a>
              </li>
              <li>Click "Add project" and follow the setup steps</li>
              <li>Enable Authentication with Email/Password provider</li>
              <li>Enable Google Sign-In provider in Authentication settings</li>
              <li>Create a Firestore database in test mode</li>
              <li>Set up Firebase Storage if needed</li>
            </ol>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Step 2: Configure Google Authentication</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>In Firebase Console, go to Authentication → Sign-in method</li>
              <li>Enable Google provider</li>
              <li>Add your domain to authorized domains (for production)</li>
              <li>Copy the Web client ID if you need additional Google API access</li>
            </ol>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Step 3: Register Your Web App</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>In your Firebase project, click the web icon ({"<>"}) to add a web app</li>
              <li>Register your app with a nickname</li>
              <li>Copy the Firebase configuration object</li>
            </ol>
          </div>

          <FirebaseConfigGuide />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Step 5: Run Your Application</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                Start your development server with <code className="bg-muted px-1 py-0.5 rounded">npm run dev</code>
              </li>
              <li>
                Visit <code className="bg-muted px-1 py-0.5 rounded">http://localhost:3000</code> to see your app
              </li>
              <li>Try signing up and signing in with email/password or Google</li>
            </ol>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
