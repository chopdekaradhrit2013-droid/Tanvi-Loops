import { useState } from 'react'
import { CATEGORIES } from '../data/products.js'
import { useStore } from '../context/StoreContext.jsx'

const empty = {
  id: '', name: '', price: '', category: 'Plushies', materials: '', colors: '',
  stock: 1, featured: true, soldOut: false, images: [], description: '',
}

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(file)
  })
}

function readFiles(files) {
  return Promise.all(Array.from(files).map(readFile))
}

export default function Admin() {
  const { products, orders, showcase, upsertProduct, deleteProduct, updateOrderStatus, setShowcaseImage, user } = useStore()
  const [form, setForm] = useState(empty)
  const revenue = orders.reduce((s, o) => s + (o.status === 'Cancelled' ? 0 : o.total), 0)
  const low = products.filter((p) => p.stock <= 3)
  const edit = (p) => setForm({ ...p, colors: Array.isArray(p.colors) ? p.colors.join(', ') : p.colors, images: p.images || [] })
  const onImages = async (e) => {
    const urls = await readFiles(e.target.files)
    setForm((f) => ({ ...f, images: [...(f.images || []), ...urls] }))
    e.target.value = ''
  }
  const onShowcase = async (index, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await readFile(file)
    setShowcaseImage(index, url)
    e.target.value = ''
  }
  const save = (e) => {
    e.preventDefault()
    upsertProduct({
      ...form,
      id: form.id || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      colors: String(form.colors || '').split(',').map((s) => s.trim()).filter(Boolean),
      images: form.images || [],
    })
    setForm(empty)
  }
  return (
    <section className="page">
      <p className="kicker">Tanvi Loops</p>
      <h1 className="display" style={{ fontSize: 56 }}>Admin Dashboard</h1>
      <p className="muted">Signed in as {user?.email}.</p>

      <div className="showcase-admin">
        <h2>Homepage photos</h2>
        <p className="muted">Upload exactly these 3 pictures. They appear on the customer homepage (hero + studio strip).</p>
        <div className="showcase-admin-grid">
          {[0, 1, 2].map((i) => (
            <label key={i} className="showcase-slot">
              {showcase?.[i] ? (
                <img src={showcase[i]} alt={`Slot ${i + 1}`} />
              ) : (
                <span>Photo {i + 1}</span>
              )}
              <input type="file" accept="image/*" onChange={(e) => onShowcase(i, e)} />
              {showcase?.[i] && (
                <button type="button" className="pill-btn" onClick={(e) => { e.preventDefault(); setShowcaseImage(i, '') }}>Remove</button>
              )}
            </label>
          ))}
        </div>
      </div>

      <div className="admin-stats">
        <div className="stat"><div className="muted">Total products</div><strong>{products.length}</strong></div>
        <div className="stat"><div className="muted">Orders</div><strong>{orders.length}</strong></div>
        <div className="stat"><div className="muted">Revenue</div><strong>₹{revenue.toFixed(0)}</strong></div>
        <div className="stat"><div className="muted">Low stock</div><strong>{low.length}</strong></div>
      </div>
      <h2>Add product</h2>
      <form className="form" onSubmit={save}>
        <input placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input type="number" step="1" placeholder="Price in rupees" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {CATEGORIES.filter((c) => c !== 'All').map((c) => <option key={c}>{c}</option>)}
        </select>
        <input placeholder="Materials" value={form.materials} onChange={(e) => setForm({ ...form, materials: e.target.value })} />
        <input placeholder="Colors, comma separated" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} />
        <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <label className="muted">Product photos<input type="file" accept="image/*" multiple onChange={onImages} /></label>
        {form.images?.length > 0 && (
          <div className="thumbs">
            {form.images.map((src, i) => (
              <img key={i} src={src} alt="" className="on" onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })} title="Click to remove" />
            ))}
          </div>
        )}
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
        <label><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
        <label><input type="checkbox" checked={form.soldOut} onChange={(e) => setForm({ ...form, soldOut: e.target.checked })} /> Sold out</label>
        <button className="pill-btn dark" type="submit">{form.id ? 'Update product' : 'Add product'}</button>
      </form>
      <h2 style={{ marginTop: 36 }}>Products</h2>
      {products.length === 0 && <p className="muted">No products yet. Upload photos and details above.</p>}
      <table className="table"><thead><tr><th></th><th>Name</th><th>Price</th><th>Stock</th><th></th></tr></thead><tbody>
        {products.map((p) => (
          <tr key={p.id}>
            <td>{p.images?.[0] && <img src={p.images[0]} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 10 }} />}</td>
            <td>{p.name}</td><td>₹{p.price}</td><td>{p.soldOut ? 'Sold out' : p.stock}</td>
            <td><button className="pill-btn" onClick={() => edit(p)}>Edit</button> <button className="pill-btn" onClick={() => deleteProduct(p.id)}>Delete</button></td>
          </tr>
        ))}
      </tbody></table>
      <h2 style={{ marginTop: 36 }}>Orders</h2>
      <table className="table"><thead><tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead><tbody>
        {orders.map((o) => (
          <tr key={o.id}><td>{o.id}</td><td>{o.customer?.name} · {o.email}</td><td>₹{o.total.toFixed(0)}</td><td>
            <select value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)}>{['Pending','Confirmed','Shipped','Delivered','Cancelled'].map((s) => <option key={s}>{s}</option>)}</select>
          </td></tr>
        ))}
      </tbody></table>
    </section>
  )
}
