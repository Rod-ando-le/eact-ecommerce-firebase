// Profile.jsx
// Read / Update / Delete for the logged-in user's Firestore document.
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { getUserDoc, updateUserDoc } from './userService'

export default function Profile() {
  const { user, removeAccount } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile] = useState({ name: '', address: '', email: '' })
  const [status, setStatus] = useState('') // '', 'saved'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // READ profile on mount
  useEffect(() => {
    if (!user) return
    getUserDoc(user.uid)
      .then((data) => {
        if (data) setProfile({ name: data.name || '', address: data.address || '', email: data.email || user.email })
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [user])

  // UPDATE profile
  async function handleSave(e) {
    e.preventDefault()
    setStatus('')
    setError('')
    try {
      await updateUserDoc(user.uid, {
        name: profile.name,
        address: profile.address,
      })
      setStatus('saved')
    } catch (err) {
      setError(err.message)
    }
  }

  // DELETE account
  async function handleDelete() {
    const sure = window.confirm(
      'Delete your account permanently? This cannot be undone.'
    )
    if (!sure) return
    try {
      await removeAccount()
      navigate('/')
    } catch (err) {
      // Firebase requires a recent login to delete an account
      setError(
        err.code === 'auth/requires-recent-login'
          ? 'For security, please log out, log back in, and try again.'
          : err.message
      )
    }
  }

  if (loading) return <p className="state state--loading">Loading profile…</p>

  return (
    <section className="profile">
      <div className="page-head">
        <div>
          <p className="eyebrow">Account</p>
          <h1 className="page-title">Your profile</h1>
        </div>
      </div>

      <form className="form form--boxed" onSubmit={handleSave}>
        <label className="field">
          <span>Email</span>
          <input value={profile.email} type="email" disabled />
        </label>
        <label className="field">
          <span>Name</span>
          <input
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            type="text"
          />
        </label>
        <label className="field">
          <span>Address</span>
          <input
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            type="text"
          />
        </label>

        {status === 'saved' && <p className="form__success">Profile updated ✓</p>}
        {error && <p className="form__error">{error}</p>}

        <div className="form__actions">
          <button className="btn btn--primary" type="submit">
            Save changes
          </button>
          <button
            className="btn btn--danger"
            type="button"
            onClick={handleDelete}
          >
            Delete account
          </button>
        </div>
      </form>
    </section>
  )
}
