import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { PRODUCTS as SEED } from '../data/products'
import { mapProduct, supabase, supabaseEnabled, toRow, uploadDataUrl } from '../lib/supabase'

const StoreContext = createContext(null)
const KEY = 'tanvi-loops-store-v6'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function StoreProvider({ children }) {
  const saved = load()
  const [products, setProducts] = useState(saved?.products || SEED)
  const [showcase, setShowcase] = useState(
    Array.isArray(saved?.showcase) && saved.showcase.length === 3 ? saved.showcase : ['', '', '']
  )
  const [cart, setCart] = useState(saved?.cart || [])
  const [favourites, setFavourites] = useState(saved?.favourites || [])
  const [user, setUser] = useState(saved?.user || null)
  const [users, setUsers] = useState(saved?.users || [
    { name: 'Tanvi', email: 'cooltanwee@gmail.com', password: 'admin123', isAdmin: true },
  ])
  const [orders, setOrders] = useState(saved?.orders || [])
  const [toast, setToast] = useState(null)
  const [cloudReady, setCloudReady] = useState(false)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify({ products, showcase, cart, favourites, user, users, orders }))
  }, [products, showcase, cart, favourites, user, users, orders])

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
        const next = ['', '', '']
        showRows.forEach((r) => { if (r.slot >= 0 && r.slot < 3) next[r.slot] = r.image_url || '' })
        setShowcase(next)
      }
      if (orderRows) {
        setOrders(orderRows.map((o) => ({
          id: o.id,
          createdAt: o.created_at,
          status: o.status,
          customer: o.customer,
          items: o.items,
          subtotal: Number(o.subtotal) || 0,
          shipping: Number(o.shipping) || 0,
          total: Number(o.total) || 0,
          email: o.email,
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

  const setShowcaseImage = async (index, dataUrl) => {
    let url = dataUrl || ''
    try {
      if (url) url = await uploadDataUrl(url, 'showcase')
    } catch (err) {
      notify(err.message || 'Could not upload photo')
      return
    }
    setShowcase((prev) => {
      const next = [...prev]
      next[index] = url
      return next
    })
    if (supabaseEnabled) {
      await supabase.from('showcase').upsert({ slot: index, image_url: url })
    }
    notify(url ? 'Homepage photo updated for all customers' : 'Homepage photo removed')
  }

  const addToCart = (product, qty = 1, color) => {
    if (product.soldOut || product.stock <= 0) { notify('This piece is currently sold out'); return }
    setCart((prev) => {
      const i = prev.findIndex((x) => x.id === product.id && x.color === color)
      if (i >= 0) { const next = [...prev]; next[i] = { ...next[i], qty: next[i].qty + qty }; return next }
      return [...prev, { id: product.id, qty, color: color || product.colors?.[0] }]
    })
    notify('Added to bag')
  }
  const updateQty = (id, color, qty) => setCart((prev) => prev.map((x) => (x.id === id && x.color === color ? { ...x, qty } : x)).filter((x) => x.qty > 0))
  const removeFromCart = (id, color) => setCart((prev) => prev.filter((x) => !(x.id === id && x.color === color)))
  const toggleFavourite = (id) => {
    setFavourites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }
  const signUp = ({ name, email, password }) => {
    if (users.some((u) => u.email === email)) return { ok: false, error: 'Email already registered' }
    setUsers((u) => [...u, { name, email, password, isAdmin: false }])
    setUser({ name, email, isAdmin: false })
    return { ok: true }
  }
  const signIn = ({ email, password }) => {
    const found = users.find((u) => u.email === email && u.password === password)
    if (!found) return { ok: false, error: 'Invalid email or password' }
    setUser({ name: found.name, email: found.email, isAdmin: !!found.isAdmin })
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
        id: order.id,
        status: order.status,
        customer: order.customer,
        items: order.items,
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
        email: order.email,
      })
    }
    return order
  }
  const updateOrderStatus = async (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    if (supabaseEnabled) await supabase.from('orders').update({ status }).eq('id', id)
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
    products, showcase, cart, cartItems, cartCount, subtotal, favourites, user, orders, toast,
    cloudReady, supabaseEnabled,
    addToCart, updateQty, removeFromCart, toggleFavourite, signUp, signIn, signOut,
    placeOrder, updateOrderStatus, upsertProduct, deleteProduct, setShowcaseImage, notify,
  }), [products, showcase, cart, cartItems, cartCount, subtotal, favourites, user, orders, toast, cloudReady])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
