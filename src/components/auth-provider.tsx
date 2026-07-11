'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { onIdTokenChanged, type User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { createSessionCookie } from '@/lib/session-client'

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // onIdTokenChanged also fires on hourly ID token refresh, so we can roll
    // the httpOnly session cookie — unlike onAuthStateChanged alone.
    const unsubscribe = onIdTokenChanged(auth, (nextUser) => {
      setUser(nextUser)
      setLoading(false)

      // Do not clear the cookie here on null — that races with initial load;
      // explicit sign-out calls clearSessionCookie.
      if (nextUser) {
        void nextUser
          .getIdToken()
          .then((idToken) => createSessionCookie(idToken))
          .then((result) => {
            if (!result.ok && result.code !== 'ADMIN_NOT_CONFIGURED') {
              console.warn(
                '[auth] Failed to refresh session cookie:',
                result.message,
              )
            }
          })
          .catch((error) => {
            console.warn('[auth] Failed to refresh session cookie:', error)
          })
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
