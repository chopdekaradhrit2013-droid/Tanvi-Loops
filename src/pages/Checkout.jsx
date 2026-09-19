import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh',
  'Lakshadweep', 'Puducherry',
]

export default function Checkout() {
  const { cartItems, subtotal, placeOrder, user } = useStore()
  const nav = useNavigate()
  const shipping = subtotal === 0 || subtotal > 2000 ? 0 : 80
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    landmark: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    country: 'India',
    payment: 'Cash on Delivery',
  })
  const [error, setError] = useState('')
  if (!cartItems.length) return <section className="page"><p>Your cart is empty.</p></section>
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.country !== 'India') {
      setError('We currently deliver only within India.')
      return
    }
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ''))) {
      setError('Enter a valid 10-digit Indian mobile number.')
      return
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      setError('Enter a valid 6-digit PIN code.')
      return
    }
    const order = await placeOrder({
      ...form,
      phone: form.phone.replace(/\s/g, ''),
      payment: 'Cash on Delivery',
      country: 'India',
    })
    nav(`/confirmation/${order.id}`)
  }
  return (
    <section className="page checkout-wrap">
      <div>
        <p className="kicker">Cash on delivery</p>
        <h1 className="display" style={{ fontSize: 56 }}>Checkout</h1>
        <p className="muted">Pay in cash when your order arrives. We ship only within India.</p>
        <form className="form" onSubmit={submit}>
          <input required placeholder="Full name" value={form.name} onChange={set('name')} />
          <input required type="email" placeholder="Email" value={form.email} onChange={set('email')} />
          <input required type="tel" inputMode="numeric" placeholder="Mobile number" value={form.phone} onChange={set('phone')} />
          <textarea required rows={3} placeholder="House / flat, street, area" value={form.address} onChange={set('address')} />
          <input placeholder="Landmark (optional)" value={form.landmark} onChange={set('landmark')} />
          <input required placeholder="City" value={form.city} onChange={set('city')} />
          <select required value={form.state} onChange={set('state')}>
            {STATES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <input required inputMode="numeric" placeholder="PIN code" value={form.pincode} onChange={set('pincode')} />
          <input readOnly value="India" aria-label="Country" />
          <div className="cod-box">
            <strong>Cash on Delivery</strong>
            <p className="muted">No online payment. Please keep ₹{(subtotal + shipping).toFixed(0)} ready for the delivery person.</p>
          </div>
          {error && <p className="sold-text">{error}</p>}
          <button className="pill-btn dark" type="submit">Place COD order</button>
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
          <div className="row"><strong>Pay on delivery</strong><strong>₹{(subtotal + shipping).toFixed(0)}</strong></div>
        </div>
      </div>
    </section>
  )
}
