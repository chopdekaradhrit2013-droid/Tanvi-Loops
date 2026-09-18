import { useStore } from '../context/StoreContext.jsx'

export default function Orders() {
  const { orders, user } = useStore()
  const mine = user ? orders.filter((o) => o.email === user.email) : orders
  return (
    <section className="page">
      <div className="section-head"><p className="kicker">Your pieces</p><h1 className="display" style={{ fontSize: 56 }}>My Orders</h1></div>
      {mine.length === 0 && <p className="muted">No orders yet.</p>}
      {mine.map((o) => (
        <article key={o.id} className="line-item" style={{ gridTemplateColumns: '1fr auto' }}>
          <div>
            <strong>{o.id}</strong>
            <div className="muted">{new Date(o.createdAt).toLocaleDateString()} · {o.status}</div>
            <div>{o.items.map((i) => `${i.name} ×${i.qty}`).join(', ')}</div>
          </div>
          <div>${o.total.toFixed(2)}</div>
        </article>
      ))}
    </section>
  )
}
