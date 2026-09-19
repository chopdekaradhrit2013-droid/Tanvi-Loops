import { useState } from 'react'
import { CATEGORIES } from '../data/products.js'
import { useStore } from '../context/StoreContext.jsx'

const empty = {
  id: '', name: '', price: '', oldPrice: '', category: 'Plushies', materials: '', colors: '',
  stock: 1, featured: true, soldOut: false, images: [], description: '',
}
const TABS = ['Orders', 'Product', 'Collection', 'Display']

function readFiles(files) {
  return Promise.all(Array.from(files).map((file) => new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(file)
  })))
}

function OrderCard({ o, updateOrderStatus, open, onToggle }) {
  const c = o.customer || {}
  return (
    <article className={'order-card' + (open ? ' open' : '')}>
      <button type="button" className="order-card-head" onClick={onToggle}>
        <div>
          <strong>{o.id}</strong>
          <div className="muted">{c.name || o.email} · {new Date(o.createdAt).toLocaleString()}</div>
        </div>
        <div className="order-card-meta">
          <span>₹{Number(o.total || 0).toFixed(0)}</span>
          <span className="muted">{o.status}</span>
          <span className="order-chevron">{open ? '−' : '+'}</span>
        </div>
      </button>
      {open && (
        <div className="order-card-body">
          <div className="order-grid">
            <div>
              <p className="eyebrow">Customer</p>
              <p><strong>{c.name || '—'}</strong></p>
              <p>{c.email || o.email}</p>
              <p>{c.phone || '—'}</p>
            </div>
            <div>
              <p className="eyebrow">Deliver to</p>
              <p>{c.address || 'No street given'}</p>
              {c.landmark && <p>Landmark: {c.landmark}</p>}
              <p>{[c.city, c.state, c.pincode].filter(Boolean).join(', ')}</p>
              <p>{c.country || 'India'}</p>
            </div>
            <div>
              <p className="eyebrow">Payment</p>
              <p>Cash on delivery</p>
              <p>Collect ₹{Number(o.total || 0).toFixed(0)}</p>
              <label className="muted">Status
                <select value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)}>
                  {['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </label>
            </div>
          </div>
          <p className="eyebrow" style={{ marginTop: 16 }}>Items</p>
          {(o.items || []).map((i, idx) => (
            <div className="line-item" key={idx}>
              {i.image && <img src={i.image} alt="" />}
              <div>{i.name}<div className="muted">Qty {i.qty}{i.color ? ` · ${i.color}` : ''}</div></div>
              <div>₹{Number((i.price || 0) * (i.qty || 1)).toFixed(0)}</div>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}

export default function Admin() {
  const {
    products, orders, showcase, upsertProduct, deleteProduct, updateOrderStatus,
    addGalleryImages, removeGalleryImage,
    user, supabaseEnabled, cloudReady,
  } = useStore()
  const [tab, setTab] = useState('Orders')
  const [form, setForm] = useState(empty)
  const [openOrder, setOpenOrder] = useState(null)
  const revenue = orders.reduce((s, o) => s + (o.status === 'Cancelled' ? 0 : o.total), 0)
  const low = products.filter((p) => p.stock <= 3)

  const edit = (p) => {
    setForm({
      ...p,
      colors: Array.isArray(p.colors) ? p.colors.join(', ') : p.colors,
      images: p.images || [],
      oldPrice: p.oldPrice || '',
    })
    setTab('Product')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const save = async (e) => {
    e.preventDefault()
    await upsertProduct({
      ...form,
      id: form.id || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      price: Number(form.price) || 0,
      oldPrice: Number(form.oldPrice) || 0,
      stock: Number(form.stock) || 0,
      colors: String(form.colors || '').split(',').map((s) => s.trim()).filter(Boolean),
      images: form.images || [],
    })
    setForm(empty)
  }

  const orderList = orders.length === 0
    ? <p className="muted">No customer orders yet. New COD checkouts will show up here with the full address.</p>
    : orders.map((o) => (
      <OrderCard
        key={o.id}
        o={o}
        updateOrderStatus={updateOrderStatus}
        open={openOrder === o.id}
        onToggle={() => setOpenOrder((id) => id === o.id ? null : o.id)}
      />
    ))

  return (
    <section className="page">
      <p className="kicker">Tanvi Loops</p>
      <h1 className="display" style={{ fontSize: 56 }}>Admin Dashboard</h1>
      <p className="muted">Signed in as {user?.email}.</p>
      <p className="muted" style={{ color: supabaseEnabled ? '#2f6b3f' : '#8a4b1f' }}>
        {supabaseEnabled ? (cloudReady ? 'Supabase connected — uploads sync to every customer.' : 'Connecting to Supabase…') : 'Supabase keys are missing.'}
      </p>

      <div className="admin-stats">
        <button type="button" className="stat" onClick={() => setTab('Product')}>
          <div className="muted">Total products</div><strong>{products.length}</strong>
        </button>
        <button type="button" className="stat" onClick={() => setTab('Orders')}>
          <div className="muted">Orders — tap here</div><strong>{orders.length}</strong>
        </button>
        <div className="stat"><div className="muted">Revenue</div><strong>₹{revenue.toFixed(0)}</strong></div>
        <div className="stat"><div className="muted">Low stock</div><strong>{low.length}</strong></div>
      </div>

      <div className="admin-tabs" role="tablist">
        {TABS.map((name) => (
          <button key={name} type="button" className={'admin-tab' + (tab === name ? ' on' : '')} onClick={() => setTab(name)}>
            {name}{name === 'Orders' ? ` (${orders.length})` : ''}
          </button>
        ))}
      </div>

      {tab === 'Collection' && (
        <div className="showcase-admin">
          <h2>Collection</h2>
          <p className="muted">This list is filled automatically from products.</p>
          {products.length === 0 ? <p className="muted">No products yet — Collection is empty.</p> : (
            <div className="showcase-admin-grid">
              {products.map((p) => (
                <div key={p.id} className="showcase-slot" onClick={() => edit(p)}>
                  {p.images?.[0] && <img src={p.images[0]} alt={p.name} />}
                  <strong>{p.name}</strong>
                  <span className={p.soldOut || p.stock <= 0 ? 'sold-text' : 'muted'}>
                    {p.soldOut || p.stock <= 0 ? 'Sold out' : `₹${p.price}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'Product' && (
        <>
          <h2>{form.id ? 'Edit product' : 'Add product'}</h2>
          <form className="form" onSubmit={save}>
            <input placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input type="number" step="1" placeholder="New price in rupees (e.g. 799)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <input type="number" step="1" placeholder="Old price to slash (e.g. 999) — optional" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} />
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
            <div className="actions">
              <button className="pill-btn dark" type="submit">{form.id ? 'Update product' : 'Add product'}</button>
              {form.id && <button className="pill-btn" type="button" onClick={() => setForm(empty)}>Cancel edit</button>}
            </div>
          </form>
          <h2 style={{ marginTop: 36 }}>Products</h2>
          {products.length === 0 && <p className="muted">No products yet.</p>}
          <table className="table"><thead><tr><th></th><th>Name</th><th>Price</th><th>Stock</th><th></th></tr></thead><tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.images?.[0] && <img src={p.images[0]} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 10 }} />}</td>
                <td>{p.name}</td>
                <td>{p.oldPrice > p.price ? <><s>₹{p.oldPrice}</s> ₹{p.price}</> : <>₹{p.price}</>}</td>
                <td>{p.soldOut || p.stock <= 0 ? <span className="sold-text">Sold out</span> : p.stock}</td>
                <td><button className="pill-btn" onClick={() => edit(p)}>Edit</button> <button className="pill-btn" onClick={() => deleteProduct(p.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody></table>
        </>
      )}

      {tab === 'Orders' && (
        <div>
          <h2>Orders</h2>
          <p className="muted">Tap an order to see the full address, phone, and items.</p>
          {orderList}
        </div>
      )}

      {tab === 'Display' && (
        <div className="showcase-admin">
          <h2>Landing page gallery</h2>
          <p className="muted">Photos uploaded here appear in the homepage accordion and the first three float in the hero.</p>
          <label className="showcase-slot" style={{ minHeight: 88 }}>
            <span>Add photos</span>
            <input type="file" accept="image/*" multiple onChange={async (e) => {
              if (!e.target.files?.length) return
              await addGalleryImages(await readFiles(e.target.files))
              e.target.value = ''
            }} />
          </label>
          <div className="showcase-admin-grid" style={{ marginTop: 16 }}>
            {(showcase || []).map((src, i) => (
              <div key={src + i} className="showcase-slot">
                <img src={src} alt="" />
                <button type="button" className="pill-btn" onClick={() => removeGalleryImage(i)}>Remove</button>
              </div>
            ))}
          </div>
          {!showcase?.length && <p className="muted">No display photos yet.</p>}
        </div>
      )}
    </section>
  )
}
