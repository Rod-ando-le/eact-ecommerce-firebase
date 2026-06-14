// Navbar.jsx
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAuth } from './AuthContext'
import { selectCartCount } from './cartSlice'

export default function Navbar() {
  const count = useSelector(selectCartCount)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="brand">
          <span className="brand__mark">◈</span>
          <span className="brand__name">Nimbus</span>
        </Link>

        <nav className="navbar__links">
          <Link to="/" className="navbar__link">
            Shop
          </Link>

          {user && (
            <>
              <Link to="/manage" className="navbar__link">
                Manage
              </Link>
              <Link to="/orders" className="navbar__link">
                Orders
              </Link>
              <Link to="/profile" className="navbar__link">
                Profile
              </Link>
            </>
          )}

          {user ? (
            <button className="navbar__link navbar__link--button" onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <Link to="/login" className="navbar__link">
              Log in
            </Link>
          )}

          <Link to="/cart" className="cart-button">
            Cart
            {count > 0 && <span className="cart-button__badge">{count}</span>}
          </Link>
        </nav>
      </div>
    </header>
  )
}
