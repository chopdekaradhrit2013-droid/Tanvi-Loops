import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

export default function SignUp() {
  const { signUp } = useStore()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const nav = useNavigate()
  const submit = (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return setError('Passwords do not match')
    const res = signUp(form)
    if (!res.ok) setError(res.error)
    else nav('/')
  }
  return (
    <section className="page auth-wrap">
      <div><p className="kicker">welcome</p><h1 className="display" style={{ fontSize: 56 }}>Create account</h1></div>
      <form className="form" onSubmit={submit}>
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="email" required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" required placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input type="password" required placeholder="Confirm password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
        {error && <p style={{ color: '#9a3a45' }}>{error}</p>}
        <button className="pill-btn dark" type="submit">Create Account</button>
        <Link to="/signin">Already have an account? Sign in</Link>
      </form>
    </section>
  )
}
