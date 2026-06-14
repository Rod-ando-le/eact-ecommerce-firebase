// userService.js
// CRUD operations for the `users` collection in Firestore.
import { db } from './firebase'
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'

// CREATE — called right after a user registers
export async function createUserDoc(uid, data) {
  await setDoc(doc(db, 'users', uid), {
    uid,
    email: data.email,
    name: data.name || '',
    address: data.address || '',
    createdAt: Date.now(),
  })
}

// READ — fetch a user's profile
export async function getUserDoc(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? snap.data() : null
}

// UPDATE — edit profile fields (name, address, ...)
export async function updateUserDoc(uid, data) {
  await updateDoc(doc(db, 'users', uid), data)
}

// DELETE — remove the user's data from Firestore
export async function deleteUserDoc(uid) {
  await deleteDoc(doc(db, 'users', uid))
}
