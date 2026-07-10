'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getErrorMessage } from '@/lib/firebase-error'
import { useAuth } from '@/components/auth-provider'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { X } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { ROUTES } from '@/constants/routes'

const GOOGLE_PROVIDER_ID = 'google.com'

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()

  // Form states
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [currentEmailPassword, setCurrentEmailPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // UI states
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [emailVerificationSent, setEmailVerificationSent] = useState(false)

  // Check if user is using Google Auth
  const isGoogleUser =
    user?.providerData.some(
      (provider) => provider.providerId === GOOGLE_PROVIDER_ID,
    ) || false

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '')
      setEmail(user.email || '')
    }
  }, [user])

  // Auto-dismiss messages after 5 seconds
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('')
        setError('')
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [message, error])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push(ROUTES.HOME)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!user) {
      setError('No user logged in')
      return
    }

    setLoading(true)

    try {
      await updateProfile(user, {
        displayName: displayName,
      })

      setMessage('Display name updated successfully')
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Failed to update display name'))
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setEmailVerificationSent(false)

    if (!user) {
      setError('No user logged in')
      return
    }
    if (!currentEmailPassword) {
      setError('Current password is required')
      return
    }
    if (!user.email) {
      setError('Account has no email address')
      return
    }
    if (email === user.email) {
      setError('New email must be different from current email')
      return
    }

    setLoading(true)

    try {
      // Reauthenticate user before updating email
      const credential = EmailAuthProvider.credential(
        user.email,
        currentEmailPassword,
      )
      await reauthenticateWithCredential(user, credential)

      // Send verification email to new address
      await verifyBeforeUpdateEmail(user, email)

      setEmailVerificationSent(true)
      setMessage(
        'Verification email sent! Please check your inbox at ' +
          email +
          ' and click the verification link to complete the email change.',
      )
      setCurrentEmailPassword('')
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Failed to send verification email'))
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (!user) {
      setError('No user logged in')
      return
    }
    if (!currentPassword) {
      setError('Current password is required')
      return
    }
    if (!user.email) {
      setError('Account has no email address')
      return
    }

    setLoading(true)

    try {
      // Reauthenticate user before updating password
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      )
      await reauthenticateWithCredential(user, credential)

      await updatePassword(user, newPassword)

      setMessage('Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Failed to update password'))
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <main className="bg-background flex min-h-screen flex-col items-center justify-center p-4 pt-20">
      <div className="w-full max-w-2xl space-y-6">
        {/* Success/Error Messages */}
        {message && (
          <Alert className="relative">
            <AlertDescription className="pr-8">{message}</AlertDescription>
            <button
              onClick={() => setMessage('')}
              className="ring-offset-background focus:ring-ring absolute top-2 right-2 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="relative">
            <AlertDescription className="pr-8">{error}</AlertDescription>
            <button
              onClick={() => setError('')}
              className="ring-offset-background focus:ring-ring absolute top-2 right-2 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </Alert>
        )}

        {/* Display Name Card */}
        <Card>
          <CardHeader>
            <CardTitle>Display Name</CardTitle>
            <CardDescription>
              Update your display name. This is how other users will see you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="John Doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Display Name'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Email Card - Only for non-Google users */}
        {!isGoogleUser && (
          <Card>
            <CardHeader>
              <CardTitle>Email Address</CardTitle>
              <CardDescription>
                Update your email address. You'll need to verify the new email
                before it takes effect.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">New Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={emailVerificationSent}
                  />
                  <p className="text-muted-foreground text-xs">
                    Current email: {user?.email}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentPasswordEmail">Current Password</Label>
                  <Input
                    id="currentPasswordEmail"
                    type="password"
                    placeholder="Enter your current password"
                    value={currentEmailPassword}
                    onChange={(e) => setCurrentEmailPassword(e.target.value)}
                    name="current-password-email"
                    autoComplete="new-password"
                    disabled={emailVerificationSent}
                  />
                </div>
                {emailVerificationSent && (
                  <Alert>
                    <AlertDescription>
                      Check your inbox at <strong>{email}</strong> and click the
                      verification link. You may need to sign in again after
                      verification.
                    </AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  disabled={loading || emailVerificationSent}
                >
                  {loading
                    ? 'Sending...'
                    : emailVerificationSent
                      ? 'Verification Email Sent'
                      : 'Send Verification Email'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Password Card - Only for non-Google users */}
        {!isGoogleUser && (
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Update your password. Make sure it's at least 6 characters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPasswordPass">Current Password</Label>
                  <Input
                    id="currentPasswordPass"
                    type="password"
                    placeholder="Enter your current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Account Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your account details and authentication method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">User ID:</span>
              <span className="font-mono text-sm">{user.uid}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Email:</span>
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">
                Authentication Method:
              </span>
              <span className="text-sm">
                {isGoogleUser ? 'Google' : 'Email/Password'}
              </span>
            </div>
            {isGoogleUser && (
              <Alert className="mt-4">
                <AlertDescription>
                  You're signed in with Google. Email and password changes are
                  managed through your Google account.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
