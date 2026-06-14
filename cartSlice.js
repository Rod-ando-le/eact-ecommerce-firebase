// src/features/cart/cartSlice.js
import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'cart'

// --- sessionStorage helpers -------------------------------------------------
// The cart is stored as an array of product objects, each with a `quantity`.
function loadCartFromSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const initialState = {
  items: loadCartFromSession(), // [{ id, title, price, image, ..., quantity }]
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add a product (or +1 if it is already in the cart)
    addToCart(state, action) {
      const product = action.payload
      const existing = state.items.find((item) => item.id === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...product, quantity: 1 })
      }
    },

    // Increase quantity of an existing line item
    incrementQuantity(state, action) {
      const item = state.items.find((i) => i.id === action.payload)
      if (item) item.quantity += 1
    },

    // Decrease quantity; remove the line if it reaches zero
    decrementQuantity(state, action) {
      const item = state.items.find((i) => i.id === action.payload)
      if (item) {
        item.quantity -= 1
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== action.payload)
        }
      }
    },

    // Remove a product entirely
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload)
    },

    // Empty the cart (used by checkout)
    clearCart(state) {
      state.items = []
    },
  },
})

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions

// --- Selectors --------------------------------------------------------------
export const selectCartItems = (state) => state.cart.items

export const selectCartCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0)

export const selectCartTotal = (state) =>
  state.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

export default cartSlice.reducer
