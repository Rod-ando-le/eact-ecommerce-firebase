// AuthContext.jsx
// Provides the current Firebase user and auth actions to the whole app.
import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  deleteUser,
} from 'firebase/auth'
import { auth } from './firebase'
import { createUserDoc, deleteUserDoc } from './userService'

const AuthContext = createContext(null)

// Convenience hook: const { user, login, ... } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Keep `user` in sync with Firebase's auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  // REGISTER: create the auth account + a matching Firestore user document
  async function register(email, password, profile = {}) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await createUserDoc(cred.user.uid, {
      email,
      name: profile.name || '',
      address: profile.address || '',
    })
    return cred.user
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function logout() {
    return signOut(auth)
  }

  // DELETE ACCOUNT: remove the Firestore doc, then the auth account
  async function removeAccount() {
    const current = auth.currentUser
    if (!current) return
    await deleteUserDoc(current.uid)
    await deleteUser(current)
  }

  const value = { user, register, login, logout, removeAccount }

  // Don't render the app until we know whether someone is logged in
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
