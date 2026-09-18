import { useState } from 'react'
import { CATEGORIES } from '../data/products.js'
import { useStore } from '../context/StoreContext.jsx'

const empty = { id: '', name: '', price: 0, category: 'Bags & Totes', materials: '100% cotton yarn', colors: 'Cream', stock: 1, featured: false, soldOut: false, images: '/products/bag-hearts.jpg', description: '' }

export default function Admin() {
  const { products, orders, upsertProduct, deleteProduct, updateOrderStatus } = useStore()
  const [form, setForm] = useState(empty)
  const revenue = orders.reduce((s, o) => s + (o.status === 'Cancelled' ? 0 : o.total), 0)
  const low = products.filter((p) => p.stock <= 3)
  const edit = (p) => setForm({ ...p, colors: p.colors.join(', '), images: p.images.join(', ') })
  const save = (e) => {
    e.preventDefault()
    upsertProduct({
      ...form,
      id: form.id || form.name.toLowerCase().replace(/\s+/g, '-'),
      price: Number(form.price),
      stock: Number(form.stock),
      colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
      images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
    })
    setForm(empty)
  }
  return (
    <section className="page">
      <p className="kicker">Stitch & Co.</p>
      <h1 className="display" style={{ fontSize: 56 }}>Admin Dashboard</h1>
      <div className="admin-stats">
        <div className="stat"><div className="muted">Total products</div><strong>{products.length}</strong></div>
        <div className="stat"><div className="muted">Orders</div><strong>{orders.length}</strong></div>
        <div className="stat"><div className="muted">Revenue</div><strong>${revenue.toFixed(0)}</strong></div>
        <div className="stat"><div className="muted">Low stock</div><strong>{low.length}</strong></div>
      </div>
      <h2>Add / edit product</h2>
      <form className="form" onSubmit={save}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{CATEGORIES.filter((c) => c !== 'All Items').map((c) => <option key={c}>{c}</option>)}</select>
        <input placeholder="Materials" value={form.materials} onChange={(e) => setForm({ ...form, materials: e.target.value })} />
        <input placeholder="Colors, comma separated" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} />
        <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <input placeholder="Image paths, comma separated" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <label><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
        <label><input type="checkbox" checked={form.soldOut} onChange={(e) => setForm({ ...form, soldOut: e.target.checked })} /> Sold out</label>
        <button className="pill-btn dark" type="submit">Save product</button>
      </form>
      <h2 style={{ marginTop: 36 }}>Products</h2>
      <table className="table"><thead><tr><th>Name</th><th>Price</th><th>Stock</th><th></th></tr></thead><tbody>
        {products.map((p) => (
          <tr key={p.id}><td>{p.name}</td><td>${p.price}</td><td>{p.soldOut ? 'Sold out' : p.stock}</td><td><button className="pill-btn" onClick={() => edit(p)}>Edit</button> <button className="pill-btn" onClick={() => deleteProduct(p.id)}>Delete</button></td></tr>
        ))}
      </tbody></table>
      <h2 style={{ marginTop: 36 }}>Orders</h2>
      <table className="table"><thead><tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead><tbody>
        {orders.map((o) => (
          <tr key={o.id}><td>{o.id}</td><td>{o.customer?.name} · {o.email}</td><td>${o.total.toFixed(2)}</td><td>
            <select value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)}>{['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((s) => <option key={s}>{s}</option>)}</select>
          </td></tr>
        ))}
      </tbody></table>
    </section>
  )
}
