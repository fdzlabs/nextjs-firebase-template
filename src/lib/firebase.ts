import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import {
  firebaseEnv,
  isConfigured,
  missingFirebaseEnvVars,
} from '@/lib/firebase-env'

if (missingFirebaseEnvVars.length > 0) {
  console.error(
    'Missing required Firebase environment variables:',
    missingFirebaseEnvVars,
  )
  console.error(
    'Please add these variables to your .env.local file or Vercel project settings',
  )
}

// Your Firebase configuration (demo fallbacks only used when unconfigured)
const firebaseConfig = {
  apiKey: firebaseEnv.apiKey || 'demo-api-key',
  authDomain: firebaseEnv.authDomain || 'demo-project.firebaseapp.com',
  projectId: firebaseEnv.projectId || 'demo-project',
  storageBucket: firebaseEnv.storageBucket || 'demo-project.appspot.com',
  messagingSenderId: firebaseEnv.messagingSenderId || '123456789',
  appId: firebaseEnv.appId || '1:123456789:web:abcdef',
  measurementId: firebaseEnv.measurementId,
}

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

// Initialize Firebase services
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account',
})

export { app, auth, db, storage, googleProvider, isConfigured }
