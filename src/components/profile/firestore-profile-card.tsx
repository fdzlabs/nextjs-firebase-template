'use client'

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { updateProfile, type User } from 'firebase/auth'
import {
  getUserProfile,
  saveUserProfile,
  uploadUserAvatar,
} from '@/lib/user-profile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'

type FirestoreProfileCardProps = {
  user: User
  onMessage: (message: string) => void
  onError: (error: string) => void
}

export function FirestoreProfileCard({
  user,
  onMessage,
  onError,
}: FirestoreProfileCardProps) {
  const onErrorRef = useRef(onError)
  const [displayName, setDisplayName] = useState(user.displayName || '')
  const [bio, setBio] = useState('')
  const [photoURL, setPhotoURL] = useState<string | null>(user.photoURL)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])

  useEffect(() => {
    let cancelled = false
    const authDisplayName = user.displayName || ''
    const authPhotoURL = user.photoURL

    async function loadProfile() {
      setLoadingProfile(true)
      try {
        const profile = await getUserProfile(user.uid)
        if (cancelled) return

        if (profile) {
          setDisplayName(profile.displayName || authDisplayName)
          setBio(profile.bio || '')
          setPhotoURL(profile.photoURL ?? authPhotoURL)
        } else {
          setDisplayName(authDisplayName)
          setBio('')
          setPhotoURL(authPhotoURL)
        }
      } catch (error: unknown) {
        if (!cancelled) {
          const message =
            error instanceof Error
              ? error.message
              : 'Failed to load Firestore profile'
          onErrorRef.current(message)
        }
      } finally {
        if (!cancelled) setLoadingProfile(false)
      }
    }

    void loadProfile()
    return () => {
      cancelled = true
    }
  }, [user.uid, user.displayName, user.photoURL])

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const trimmedDisplayName = displayName.trim()
    const trimmedBio = bio.trim()

    try {
      await saveUserProfile(user.uid, {
        displayName: trimmedDisplayName,
        bio: trimmedBio,
        photoURL,
        email: user.email,
      })

      setDisplayName(trimmedDisplayName)
      setBio(trimmedBio)

      if (trimmedDisplayName !== (user.displayName || '')) {
        await updateProfile(user, { displayName: trimmedDisplayName })
      }

      onMessage('Firestore profile saved')
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to save profile'
      onError(message)
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      onError('Please choose an image file')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      onError('Avatar must be 2MB or smaller')
      return
    }

    const trimmedDisplayName = displayName.trim()
    const trimmedBio = bio.trim()

    setUploading(true)
    try {
      const downloadURL = await uploadUserAvatar(user.uid, file)
      await saveUserProfile(user.uid, {
        displayName: trimmedDisplayName || user.displayName || '',
        bio: trimmedBio,
        photoURL: downloadURL,
        email: user.email,
      })
      await updateProfile(user, { photoURL: downloadURL })
      setDisplayName(trimmedDisplayName || user.displayName || '')
      setBio(trimmedBio)
      setPhotoURL(downloadURL)
      onMessage('Avatar uploaded to Firebase Storage')
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to upload avatar'
      onError(message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const initials = (user.email || 'U').charAt(0).toUpperCase()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Firestore &amp; Storage Profile</CardTitle>
        <CardDescription>
          Demo of reading and writing a Firestore user document, plus uploading
          an avatar to Firebase Storage.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={photoURL || undefined}
              alt={displayName || 'Avatar'}
            />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar (Storage)</Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              disabled={loadingProfile || uploading}
              onChange={handleAvatarChange}
            />
            <p className="text-muted-foreground text-xs">
              {uploading ? 'Uploading…' : 'PNG or JPG up to 2MB'}
            </p>
          </div>
        </div>

        <Separator />

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firestoreDisplayName">Display name</Label>
            <Input
              id="firestoreDisplayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Jane Doe"
              disabled={loadingProfile || saving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A short bio stored in Firestore…"
              rows={3}
              disabled={loadingProfile || saving}
            />
          </div>
          <Button
            type="submit"
            disabled={loadingProfile || saving || uploading}
          >
            {saving ? 'Saving…' : 'Save Firestore profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
