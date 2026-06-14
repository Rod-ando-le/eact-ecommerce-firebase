// src/app/store.js
import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
})

// Persist the cart to sessionStorage on every state change.
// This keeps sessionStorage in sync regardless of which action ran,
// so the cart survives navigation between components and page reloads
// within the same browser session.
store.subscribe(() => {
  try {
    const items = store.getState().cart.items
    sessionStorage.setItem('cart', JSON.stringify(items))
  } catch {
    // Ignore write errors (e.g. storage full or unavailable)
  }
})
