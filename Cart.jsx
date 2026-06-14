// Cart.jsx
// Cart view. Checkout now saves the order to Firestore (requires login).
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useAuth } from './AuthContext'
import { createOrder } from './orderService'
import {
  selectCartItems,
  selectCartCount,
  selectCartTotal,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
} from './cartSlice'

const PLACEHOLDER = 'https://via.placeholder.com/120x120?text=No+Image'

function handleImageError(e) {
  e.target.onerror = null
  e.target.src = PLACEHOLDER
}

export default function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useAuth()

  const items = useSelector(selectCartItems)
  const count = useSelector(selectCartCount)
  const total = useSelector(selectCartTotal)

  const [placing, setPlacing] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [error, setError] = useState('')

  async function handleCheckout() {
    if (!user) {
      navigate('/login')
      return
    }
    setError('')
    setPlacing(true)
    try {
      // Store the order in Firestore: all products + who placed it.
      const id = await createOrder({
        userId: user.uid,
        userEmail: user.email,
        items: items.map((i) => ({
          id: i.id,
          title: i.title,
          price: i.price,
          image: i.image,
          quantity: i.quantity,
        })),
        total,
      })
      // Clear Redux + sessionStorage after a successful order.
      dispatch(clearCart())
      setOrderId(id)
    } catch (err) {
      setError(err.message)
    } finally {
      setPlacing(false)
    }
  }

  // Success feedback after checkout
  if (orderId) {
    return (
      <section className="checkout-success">
        <div className="checkout-success__icon">✓</div>
        <h1 className="page-title">Order placed!</h1>
        <p className="state">
          Your order was saved. You can find it in your order history.
        </p>
        <div className="form__actions">
          <Link to={`/orders/${orderId}`} className="btn btn--primary">
            View order
          </Link>
          <Link to="/" className="btn btn--ghost">
            Continue shopping
          </Link>
        </div>
      </section>
    )
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <section className="cart-empty">
        <h1 className="page-title">Your cart is empty</h1>
        <p className="state">Browse the catalog and add a few things.</p>
        <Link to="/" className="btn btn--primary">
          Go to shop
        </Link>
      </section>
    )
  }

  return (
    <section className="cart">
      <div className="page-head">
        <div>
          <p className="eyebrow">Shopping cart</p>
          <h1 className="page-title">Review your order</h1>
        </div>
      </div>

      <div className="cart__layout">
        <ul className="cart__list">
          {items.map((item) => (
            <li key={item.id} className="cart-item">
              <img
                className="cart-item__image"
                src={item.image}
                alt={item.title}
                onError={handleImageError}
              />

              <div className="cart-item__info">
                <h3 className="cart-item__title">{item.title}</h3>
                <p className="cart-item__price">${item.price.toFixed(2)} each</p>

                <div className="qty">
                  <button
                    className="qty__btn"
                    aria-label="Decrease quantity"
                    onClick={() => dispatch(decrementQuantity(item.id))}
                  >
                    −
                  </button>
                  <span className="qty__count">{item.quantity}</span>
                  <button
                    className="qty__btn"
                    aria-label="Increase quantity"
                    onClick={() => dispatch(incrementQuantity(item.id))}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="cart-item__right">
                <span className="cart-item__subtotal">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  className="btn btn--ghost"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        <aside className="summary">
          <h2 className="summary__title">Summary</h2>
          <div className="summary__row">
            <span>Items</span>
            <span>{count}</span>
          </div>
          <div className="summary__row">
            <span>Total</span>
            <span className="summary__total">${total.toFixed(2)}</span>
          </div>

          {!user && (
            <p className="summary__note">
              <Link to="/login">Log in</Link> to place your order.
            </p>
          )}
          {error && <p className="form__error">{error}</p>}

          <button
            className="btn btn--primary summary__checkout"
            onClick={handleCheckout}
            disabled={placing}
          >
            {placing ? 'Placing order…' : 'Checkout'}
          </button>
          <button className="btn btn--ghost" onClick={() => dispatch(clearCart())}>
            Clear cart
          </button>
        </aside>
      </div>
    </section>
  )
}
