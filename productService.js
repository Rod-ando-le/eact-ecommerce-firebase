// productService.js
// CRUD operations for the `products` collection in Firestore.
// This replaces the old FakeStore API.
import { db } from './firebase'
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'

const productsRef = collection(db, 'products')

// READ — fetch every product
export async function getProducts() {
  const snap = await getDocs(productsRef)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

// CREATE — add a new product, returns it with its generated id
export async function addProduct(data) {
  const ref = await addDoc(productsRef, data)
  return { id: ref.id, ...data }
}

// UPDATE — edit an existing product
export async function updateProduct(id, data) {
  await updateDoc(doc(db, 'products', id), data)
}

// DELETE — remove a product
export async function deleteProduct(id) {
  await deleteDoc(doc(db, 'products', id))
}
