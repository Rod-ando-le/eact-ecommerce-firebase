// Register.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register(form.email, form.password, {
        name: form.name,
        address: form.address,
      })
      navigate('/')
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="auth">
      <div className="auth__card">
        <p className="eyebrow">Create account</p>
        <h1 className="page-title">Join Nimbus</h1>

        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Name</span>
            <input value={form.name} onChange={update('name')} type="text" />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              value={form.email}
              onChange={update('email')}
              type="email"
              required
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              value={form.password}
              onChange={update('password')}
              type="password"
              required
              minLength={6}
            />
          </label>
          <label className="field">
            <span>Address</span>
            <input
              value={form.address}
              onChange={update('address')}
              type="text"
            />
          </label>

          {error && <p className="form__error">{error}</p>}

          <button className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <p className="auth__switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  )
}
