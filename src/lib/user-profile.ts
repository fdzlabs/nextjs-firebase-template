import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'

export const USERS_COLLECTION = 'users'

export interface UserProfile {
  uid: string
  displayName: string
  bio: string
  photoURL: string | null
  email: string | null
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

export type UserProfileInput = {
  displayName: string
  bio: string
  photoURL?: string | null
  email?: string | null
}

function userDocRef(uid: string) {
  return doc(db, USERS_COLLECTION, uid)
}

function isNotFoundError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'not-found'
  )
}

/** Read the signed-in user's Firestore profile document. */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(userDocRef(uid))
  if (!snapshot.exists()) return null
  return snapshot.data() as UserProfile
}

/**
 * Create or update the user's Firestore profile.
 * Updates in place when the doc exists; creates with `createdAt` only on first write
 * (no getDoc before every save).
 */
export async function saveUserProfile(
  uid: string,
  data: UserProfileInput,
): Promise<void> {
  const profileRef = userDocRef(uid)
  const payload = {
    uid,
    displayName: data.displayName,
    bio: data.bio,
    photoURL: data.photoURL ?? null,
    email: data.email ?? null,
    updatedAt: serverTimestamp(),
  }

  try {
    await updateDoc(profileRef, payload)
  } catch (error: unknown) {
    if (!isNotFoundError(error)) throw error
    await setDoc(profileRef, { ...payload, createdAt: serverTimestamp() })
  }
}

/** Upload an avatar to Storage and return its public download URL. */
export async function uploadUserAvatar(
  uid: string,
  file: File,
): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const objectRef = ref(storage, `avatars/${uid}/avatar.${extension}`)
  await uploadBytes(objectRef, file, { contentType: file.type })
  return getDownloadURL(objectRef)
}
