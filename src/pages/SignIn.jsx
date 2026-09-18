import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

export default function SignIn() {
  const { signIn } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    const res = signIn({ email, password })
    if (!res.ok) setError(res.error)
    else nav(email.toLowerCase() === 'cooltanwee@gmail.com' ? '/admin' : '/')
  }

  return (
    <section className="page auth-wrap">
      <div>
        <p className="kicker">welcome</p>
        <h1 className="display" style={{ fontSize: 64 }}>sign in & join us.</h1>
        <p className="muted">Browse freely. An account is only needed to track orders and keep favourites across devices.</p>
        <p className="muted">Admin sign-in is required to add products and manage the store.</p>
      </div>
      <form className="form" onSubmit={submit}>
        <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <label className="muted"><input type="checkbox" /> Remember me</label>
        {error && <p style={{ color: '#9a3a45' }}>{error}</p>}
        <button className="pill-btn dark" type="submit">Sign In</button>
        <Link to="/signup">Create Account</Link>
      </form>
    </section>
  )
}
