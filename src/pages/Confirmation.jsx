import { Link, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

export default function Confirmation() {
  const { id } = useParams()
  const { orders } = useStore()
  const order = orders.find((o) => o.id === id)
  if (!order) return <section className="page"><p>Order not found.</p></section>
  const c = order.customer || {}
  return (
    <section className="page confirm">
      <div className="yarn" />
      <p className="kicker">Cash on delivery</p>
      <h1 className="display" style={{ fontSize: 56 }}>Order confirmed</h1>
      <p>Order {order.id}</p>
      <p className="muted">Pay ₹{Number(order.total).toFixed(0)} in cash when it arrives.</p>
      <p className="muted">Estimated delivery: 5–7 business days · India only</p>
      {(c.address || c.city) && (
        <p>
          {c.address}{c.landmark ? `, ${c.landmark}` : ''}<br />
          {c.city}{c.state ? `, ${c.state}` : ''} {c.pincode}<br />
          India{c.phone ? ` · ${c.phone}` : ''}
        </p>
      )}
      <div className="actions" style={{ justifyContent: 'center' }}>
        <Link className="pill-btn dark" to="/shop">Continue Shopping</Link>
        <Link className="pill-btn" to="/orders">View Orders</Link>
      </div>
    </section>
  )
}
