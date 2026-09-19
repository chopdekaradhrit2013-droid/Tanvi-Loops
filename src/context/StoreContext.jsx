import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { PRODUCTS as SEED } from '../data/products'
import { mapProduct, supabase, supabaseEnabled, toRow, uploadDataUrl } from '../lib/supabase'
import { emailOrderStatus } from '../lib/statusEmail'

const StoreContext = createContext(null)
const KEY = 'tanvi-loops-store-v9'
const COLLECTION_BASE = 1000
const ADMIN_EMAIL = 'cooltanwee@gmail.com'
const ADMIN_PASSWORD = 'bobbokoyande17101997'

function load() {
  try {
    const raw = localStorage.getItem(KEY) || localStorage.getItem('tanvi-loops-store-v8')
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function asUser(u) {
  if (!u?.email) return null
  const email = String(u.email).trim().toLowerCase()
  return { name: u.name || '', email, isAdmin: email === ADMIN_EMAIL }
}

function withAdminPassword(list = []) {
  const others = list.filter((u) => String(u.email || '').toLowerCase() !== ADMIN_EMAIL)
  return [{ name: 'Tanvi', email: ADMIN_EMAIL, password: ADMIN_PASSWORD, isAdmin: true }, ...others]
}

async function persistSlots(urls, base) {
  if (!supabaseEnabled) return
  const rows = urls.map((image_url, i) => ({ slot: base + i, image_url }))
  if (rows.length) await supabase.from('showcase').upsert(rows)
  const { data } = await supabase.from('showcase').select('slot')
  const extra = (data || [])
    .map((r) => r.slot)
    .filter((slot) => slot >= base && slot < base + 1000 && slot >= base + urls.length)
  if (extra.length) await supabase.from('showcase').delete().in('slot', extra)
}

export function StoreProvider({ children }) {
  const saved = load()
  const [products, setProducts] = useState(saved?.products || SEED)
  const [showcase, setShowcase] = useState(Array.isArray(saved?.showcase) ? saved.showcase.filter(Boolean) : [])
  const [collection, setCollection] = useState(Array.isArray(saved?.collection) ? saved.collection.filter(Boolean) : [])
  const [cart, setCart] = useState(saved?.cart || [])
  const [favourites, setFavourites] = useState(saved?.favourites || [])
  const [user, setUser] = useState(() => asUser(saved?.user))
  const [users, setUsers] = useState(() => withAdminPassword(saved?.users))
  const [orders, setOrders] = useState(saved?.orders || [])
  const [toast, setToast] = useState(null)
  const [cloudReady, setCloudReady] = useState(false)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify({ products, showcase, collection, cart, favourites, user, users, orders }))
  }, [products, showcase, collection, cart, favourites, user, users, orders])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  useEffect(() => {
    if (!supabaseEnabled) return
    let alive = true
    async function boot() {
      const [{ data: productRows }, { data: showRows }, { data: orderRows }] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('showcase').select('*').order('slot'),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
      ])
      if (!alive) return
      if (productRows) setProducts(productRows.map(mapProduct))
      if (showRows) {
        setShowcase(showRows.filter((r) => r.slot < COLLECTION_BASE).map((r) => r.image_url).filter(Boolean))
        setCollection(showRows.filter((r) => r.slot >= COLLECTION_BASE).map((r) => r.image_url).filter(Boolean))
      }
      if (orderRows) {
        setOrders(orderRows.map((o) => ({
          id: o.id, createdAt: o.created_at, status: o.status, customer: o.customer, items: o.items,
          subtotal: Number(o.subtotal) || 0, shipping: Number(o.shipping) || 0, total: Number(o.total) || 0, email: o.email,
        })))
      }
      setCloudReady(true)
    }
    boot()
    const ch = supabase.channel('store-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => boot())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'showcase' }, () => boot())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => boot())
      .subscribe()
    return () => { alive = false; supabase.removeChannel(ch) }
  }, [])

  const notify = (message) => setToast(message)

  const addGalleryImages = async (dataUrls) => {
    try {
      const uploaded = await Promise.all(dataUrls.map((url) => uploadDataUrl(url, 'showcase')))
      const next = [...showcase, ...uploaded.filter(Boolean)]
      setShowcase(next)
      await persistSlots(next, 0)
      notify('Landing page gallery updated')
    } catch (err) {
      notify(err.message || 'Could not upload gallery photos')
    }
  }
  const removeGalleryImage = async (index) => {
    const next = showcase.filter((_, i) => i !== index)
    setShowcase(next)
    await persistSlots(next, 0)
    notify('Photo removed from gallery')
  }
  const addCollectionImages = async (dataUrls) => {
    try {
      const uploaded = await Promise.all(dataUrls.map((url) => uploadDataUrl(url, 'collection')))
      const next = [...collection, ...uploaded.filter(Boolean)]
      setCollection(next)
      await persistSlots(next, COLLECTION_BASE)
      notify('Collection photos updated')
    } catch (err) {
      notify(err.message || 'Could not upload collection photos')
    }
  }
  const removeCollectionImage = async (index) => {
    const next = collection.filter((_, i) => i !== index)
    setCollection(next)
    await persistSlots(next, COLLECTION_BASE)
    notify('Photo removed from collection')
  }

  const addToCart = (product, qty = 1, color) => {
    if (product.soldOut || product.stock <= 0) { notify('This piece is currently sold out'); return }
    setCart((prev) => {
      const i = prev.findIndex((x) => x.id === product.id && x.color === color)
      if (i >= 0) { const n = [...prev]; n[i] = { ...n[i], qty: n[i].qty + qty }; return n }
      return [...prev, { id: product.id, qty, color: color || product.colors?.[0] }]
    })
    notify('Added to bag')
  }
  const updateQty = (id, color, qty) => setCart((prev) => prev.map((x) => (x.id === id && x.color === color ? { ...x, qty } : x)).filter((x) => x.qty > 0))
  const removeFromCart = (id, color) => setCart((prev) => prev.filter((x) => !(x.id === id && x.color === color)))
  const toggleFavourite = (id) => setFavourites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  const signUp = ({ name, email, password }) => {
    const clean = String(email || '').trim().toLowerCase()
    if (clean === ADMIN_EMAIL) return { ok: false, error: 'This email is reserved for the store admin.' }
    if (users.some((u) => u.email === clean)) return { ok: false, error: 'Email already registered' }
    setUsers((u) => [...u, { name, email: clean, password, isAdmin: false }])
    setUser({ name, email: clean, isAdmin: false })
    return { ok: true }
  }
  const signIn = ({ email, password }) => {
    const clean = String(email || '').trim().toLowerCase()
    const found = users.find((u) => String(u.email).toLowerCase() === clean && u.password === password)
    if (!found) return { ok: false, error: 'Invalid email or password' }
    setUser(asUser(found))
    return { ok: true }
  }
  const signOut = () => setUser(null)
  const placeOrder = async (details) => {
    const items = cart.map((c) => {
      const p = products.find((x) => x.id === c.id)
      return { id: c.id, name: p?.name, price: p?.price, qty: c.qty, color: c.color, image: p?.images?.[0] }
    })
    const sub = items.reduce((s, i) => s + i.price * i.qty, 0)
    const shipping = sub > 2000 ? 0 : 80
    const order = { id: 'TL-' + Math.random().toString(36).slice(2, 8).toUpperCase(), createdAt: new Date().toISOString(), status: 'Pending', customer: details, items, subtotal: sub, shipping, total: sub + shipping, email: user?.email || details.email }
    setOrders((o) => [order, ...o])
    setCart([])
    if (supabaseEnabled) {
      await supabase.from('orders').insert({
        id: order.id, status: order.status, customer: order.customer, items: order.items,
        subtotal: order.subtotal, shipping: order.shipping, total: order.total, email: order.email,
      })
    }
    return order
  }
  const updateOrderStatus = async (id, status) => {
    const current = orders.find((o) => o.id === id)
    const next = current ? { ...current, status } : null
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    if (supabaseEnabled) await supabase.from('orders').update({ status }).eq('id', id)
    if (next) {
      try {
        const sent = await emailOrderStatus(next, status)
        if (sent.ok) notify(`Status updated. Email sent to ${sent.to}`)
        else notify(sent.error || 'Status updated')
      } catch {
        notify('Status updated, but the email could not be sent yet')
      }
    } else {
      notify('Status updated')
    }
  }
  const upsertProduct = async (product) => {
    let nextProduct = { ...product }
    try {
      nextProduct.images = await Promise.all((product.images || []).map((img) => uploadDataUrl(img, 'products')))
    } catch (err) {
      notify(err.message || 'Could not upload product photo')
      return
    }
    setProducts((prev) => {
      const i = prev.findIndex((p) => p.id === nextProduct.id)
      if (i >= 0) { const next = [...prev]; next[i] = nextProduct; return next }
      return [nextProduct, ...prev]
    })
    if (supabaseEnabled) await supabase.from('products').upsert(toRow(nextProduct))
    notify('Product saved for all customers')
  }
  const deleteProduct = async (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    if (supabaseEnabled) await supabase.from('products').delete().eq('id', id)
  }
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartItems = cart.map((c) => ({ ...c, product: products.find((p) => p.id === c.id) })).filter((x) => x.product)
  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0)
  const value = useMemo(() => ({
    products, showcase, collection, cart, cartItems, cartCount, subtotal, favourites, user, orders, toast,
    cloudReady, supabaseEnabled,
    addToCart, updateQty, removeFromCart, toggleFavourite, signUp, signIn, signOut,
    placeOrder, updateOrderStatus, upsertProduct, deleteProduct,
    addGalleryImages, removeGalleryImage, addCollectionImages, removeCollectionImage, notify,
  }), [products, showcase, collection, cart, cartItems, cartCount, subtotal, favourites, user, orders, toast, cloudReady])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
