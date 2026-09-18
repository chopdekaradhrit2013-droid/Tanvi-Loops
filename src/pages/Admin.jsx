import { useState } from 'react'
import { CATEGORIES } from '../data/products.js'
import { useStore } from '../context/StoreContext.jsx'

const empty = {
  id: '', name: '', price: '', category: 'Plushies', materials: '', colors: '',
  stock: 1, featured: true, soldOut: false, images: [], description: '',
}

function readFiles(files) {
  return Promise.all(Array.from(files).map((file) => new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(file)
  })))
}

function PhotoSection({ title, help, photos, onAdd, onRemove }) {
  return (
    <div className="showcase-admin">
      <h2>{title}</h2>
      <p className="muted">{help}</p>
      <label className="showcase-slot" style={{ minHeight: 88 }}>
        <span>Add photos</span>
        <input type="file" accept="image/*" multiple onChange={async (e) => {
          if (!e.target.files?.length) return
          await onAdd(await readFiles(e.target.files))
          e.target.value = ''
        }} />
      </label>
      <div className="showcase-admin-grid" style={{ marginTop: 16 }}>
        {(photos || []).map((src, i) => (
          <div key={src + i} className="showcase-slot">
            <img src={src} alt="" />
            <button type="button" className="pill-btn" onClick={() => onRemove(i)}>Remove</button>
          </div>
        ))}
      </div>
      {!photos?.length && <p className="muted">No photos yet.</p>}
    </div>
  )
}

export default function Admin() {
  const {
    products, orders, showcase, collection, upsertProduct, deleteProduct, updateOrderStatus,
    addGalleryImages, removeGalleryImage, addCollectionImages, removeCollectionImage,
    user, supabaseEnabled, cloudReady,
  } = useStore()
  const [form, setForm] = useState(empty)
  const revenue = orders.reduce((s, o) => s + (o.status === 'Cancelled' ? 0 : o.total), 0)
  const low = products.filter((p) => p.stock <= 3)
  const edit = (p) => setForm({ ...p, colors: Array.isArray(p.colors) ? p.colors.join(', ') : p.colors, images: p.images || [] })
  const save = async (e) => {
    e.preventDefault()
    await upsertProduct({
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
      <p className="muted" style={{ color: supabaseEnabled ? '#2f6b3f' : '#8a4b1f' }}>
        {supabaseEnabled ? (cloudReady ? 'Supabase connected — uploads sync to every customer.' : 'Connecting to Supabase…') : 'Supabase keys are missing.'}
      </p>

      <PhotoSection
        title="Landing page gallery"
        help="These photos appear in the homepage accordion and the first three float in the hero."
        photos={showcase}
        onAdd={addGalleryImages}
        onRemove={removeGalleryImage}
      />
      <PhotoSection
        title="Collection"
        help="These photos appear in the Collection section on the homepage."
        photos={collection}
        onAdd={addCollectionImages}
        onRemove={removeCollectionImage}
      />

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
        <label className="muted">Product photos<input type="file" accept="image/*" multiple onChange={async (e) => {
          const urls = await readFiles(e.target.files)
          setForm((f) => ({ ...f, images: [...(f.images || []), ...urls] }))
          e.target.value = ''
        }} /></label>
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
      {products.length === 0 && <p className="muted">No products yet.</p>}
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
          <tr key={o.id}><td>{o.id}</td><td>{o.customer?.name} · {o.email}</td><td>₹{Number(o.total || 0).toFixed(0)}</td><td>
            <select value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)}>{['Pending','Confirmed','Shipped','Delivered','Cancelled'].map((s) => <option key={s}>{s}</option>)}</select>
          </td></tr>
        ))}
      </tbody></table>
    </section>
  )
}
