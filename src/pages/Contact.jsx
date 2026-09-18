import { useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'

const STUDIO_EMAIL = 'cooltanwee@gmail.com'

export default function Contact() {
  const { notify } = useStore()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const send = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Tanvi Loops enquiry from ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name} <${form.email}>`)
    window.location.href = `mailto:${STUDIO_EMAIL}?subject=${subject}&body=${body}`
    notify('Opening email to cooltanwee@gmail.com')
    setForm({ name: '', email: '', message: '' })
  }
  return (
    <section className="page auth-wrap">
      <div>
        <p className="kicker">Studio</p>
        <h1 className="display" style={{ fontSize: 56 }}>Contact</h1>
        <p><a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a></p>
        <p className="muted">Mumbai, India · Made to order, shipped in 5–7 days.</p>
      </div>
      <form className="form" onSubmit={send}>
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <textarea required rows="5" placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <button className="pill-btn dark" type="submit">Send Message</button>
      </form>
    </section>
  )
}
