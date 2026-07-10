import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

export const USERS_COLLECTION = 'users';

export interface UserProfile {
  uid: string;
  displayName: string;
  bio: string;
  photoURL: string | null;
  email: string | null;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export type UserProfileInput = {
  displayName: string;
  bio: string;
  photoURL?: string | null;
  email?: string | null;
};

function userDocRef(uid: string) {
  return doc(db, USERS_COLLECTION, uid);
}

/** Read the signed-in user's Firestore profile document. */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(userDocRef(uid));
  if (!snapshot.exists()) return null;
  return snapshot.data() as UserProfile;
}

/**
 * Create or update the user's Firestore profile.
 * Uses merge so avatar uploads and partial edits do not wipe other fields.
 */
export async function saveUserProfile(
  uid: string,
  data: UserProfileInput,
): Promise<void> {
  const existing = await getDoc(userDocRef(uid));
  const payload = {
    uid,
    displayName: data.displayName,
    bio: data.bio,
    photoURL: data.photoURL ?? null,
    email: data.email ?? null,
    updatedAt: serverTimestamp(),
    ...(existing.exists() ? {} : { createdAt: serverTimestamp() }),
  };

  await setDoc(userDocRef(uid), payload, { merge: true });
}

/** Upload an avatar to Storage and return its public download URL. */
export async function uploadUserAvatar(
  uid: string,
  file: File,
): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const objectRef = ref(storage, `avatars/${uid}/avatar.${extension}`);
  await uploadBytes(objectRef, file, { contentType: file.type });
  return getDownloadURL(objectRef);
}
