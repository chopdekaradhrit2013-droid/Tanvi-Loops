import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

export default function Checkout() {
  const { cartItems, subtotal, placeOrder, user } = useStore()
  const nav = useNavigate()
  const shipping = subtotal === 0 || subtotal > 2000 ? 0 : 80
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', address: '', city: '', payment: 'UPI' })
  if (!cartItems.length) return <section className="page"><p>Your cart is empty.</p></section>
  const submit = async (e) => {
    e.preventDefault()
    const order = await placeOrder(form)
    nav(`/confirmation/${order.id}`)
  }
  return (
    <section className="page checkout-wrap">
      <div>
        <p className="kicker">Secure</p>
        <h1 className="display" style={{ fontSize: 56 }}>Checkout</h1>
        <form className="form" onSubmit={submit}>
          <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input required placeholder="Shipping address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <select value={form.payment} onChange={(e) => setForm({ ...form, payment: e.target.value })}>
            <option>UPI</option><option>Card</option><option>Cash on Delivery</option>
          </select>
          <button className="pill-btn dark" type="submit">Place Order</button>
        </form>
      </div>
      <div>
        <p className="muted">Order summary · {cartItems.length} items</p>
        {cartItems.map((i) => (
          <div className="line-item" key={i.id + i.color}>
            <img src={i.product.images[0]} alt="" />
            <div>{i.product.name}<div className="muted">Qty {i.qty}</div></div>
            <div>₹{(i.product.price * i.qty).toFixed(0)}</div>
          </div>
        ))}
        <div className="totals">
          <div className="row"><span>Subtotal</span><span>₹{subtotal.toFixed(0)}</span></div>
          <div className="row"><span>Shipping</span><span>{shipping ? `₹${shipping}` : 'Complimentary'}</span></div>
          <div className="row"><strong>Total</strong><strong>₹{(subtotal + shipping).toFixed(0)}</strong></div>
          <p className="muted">Payment is simulated for this prototype.</p>
        </div>
      </div>
    </section>
  )
}
