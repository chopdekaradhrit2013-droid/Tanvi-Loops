import { useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'

export default function Contact() {
  const { notify } = useStore()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  return (
    <section className="page auth-wrap">
      <div>
        <p className="kicker">Studio</p>
        <h1 className="display" style={{ fontSize: 56 }}>Contact</h1>
        <p>hello@tanviloops.com</p>
        <p><a href="https://wa.me/910000000000">WhatsApp</a> · <a href="https://instagram.com">Instagram</a></p>
        <p className="muted">Mumbai, India · Made to order, shipped in 5–7 days.</p>
      </div>
      <form className="form" onSubmit={(e) => { e.preventDefault(); notify('Message sent — we will write back soon'); setForm({ name: '', email: '', message: '' }) }}>
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <textarea required rows="5" placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <button className="pill-btn dark" type="submit">Send Message</button>
      </form>
    </section>
  )
}
