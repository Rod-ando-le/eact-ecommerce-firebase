// orderService.js
// Operations for the `orders` collection in Firestore.
import { db } from './firebase'
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from 'firebase/firestore'

const ordersRef = collection(db, 'orders')

// CREATE — store an order placed from the cart.
// order = { userId, userEmail, items: [...], total }
export async function createOrder(order) {
  const ref = await addDoc(ordersRef, {
    ...order,
    createdAt: Date.now(),
  })
  return ref.id
}

// READ — all orders that belong to one user (sorted newest first)
export async function getUserOrders(userId) {
  const q = query(ordersRef, where('userId', '==', userId))
  const snap = await getDocs(q)
  const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  // Sort client-side so we don't need a Firestore composite index
  return orders.sort((a, b) => b.createdAt - a.createdAt)
}

// READ — a single order by its id
export async function getOrder(id) {
  const snap = await getDoc(doc(db, 'orders', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}
