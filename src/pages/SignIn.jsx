import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

export default function SignIn() {
  const { signIn } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [params] = useSearchParams()
  const nav = useNavigate()
  const next = params.get('next') || '/'
  const wantsAdmin = next.startsWith('/admin')

  const submit = (e) => {
    e.preventDefault()
    const res = signIn({ email, password })
    if (!res.ok) {
      setError(res.error)
      return
    }
    const isAdmin = email.toLowerCase() === 'cooltanwee@gmail.com'
    if (wantsAdmin && !isAdmin) {
      setError('This account is not the store admin.')
      return
    }
    nav(isAdmin ? '/admin' : next === '/admin' ? '/' : next)
  }

  return (
    <section className="page auth-wrap">
      <div>
        <p className="kicker">welcome</p>
        <h1 className="display" style={{ fontSize: 64 }}>{wantsAdmin ? 'admin sign in.' : 'sign in & join us.'}</h1>
        <p className="muted">
          {wantsAdmin
            ? 'The dashboard is locked. Sign in with the admin email to continue.'
            : 'Browse freely. An account is only needed to track orders and keep favourites across devices.'}
        </p>
      </div>
      <form className="form" onSubmit={submit}>
        <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p style={{ color: '#9a3a45' }}>{error}</p>}
        <button className="pill-btn dark" type="submit">Sign In</button>
        {!wantsAdmin && <Link to="/signup">Create Account</Link>}
      </form>
    </section>
  )
}
