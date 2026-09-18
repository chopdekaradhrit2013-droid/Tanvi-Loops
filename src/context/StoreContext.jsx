import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { PRODUCTS as SEED } from '../data/products'

const StoreContext = createContext(null)
const KEY = 'tanvi-loops-store-v5'

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
    Array.isArray(saved?.showcase) && saved.showcase.length === 3
      ? saved.showcase
      : ['', '', '']
  )
  const [cart, setCart] = useState(saved?.cart || [])
  const [favourites, setFavourites] = useState(saved?.favourites || [])
  const [user, setUser] = useState(saved?.user || null)
  const [users, setUsers] = useState(saved?.users || [
    { name: 'Tanvi', email: 'cooltanwee@gmail.com', password: 'admin123', isAdmin: true },
  ])
  const [orders, setOrders] = useState(saved?.orders || [])
  const [toast, setToast] = useState(null)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify({ products, showcase, cart, favourites, user, users, orders }))
  }, [products, showcase, cart, favourites, user, users, orders])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  const notify = (message) => setToast(message)
  const setShowcaseImage = (index, dataUrl) => {
    setShowcase((prev) => {
      const next = [...prev]
      next[index] = dataUrl || ''
      return next
    })
    notify(dataUrl ? 'Homepage photo updated' : 'Homepage photo removed')
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
  const placeOrder = (details) => {
    const items = cart.map((c) => {
      const p = products.find((x) => x.id === c.id)
      return { id: c.id, name: p?.name, price: p?.price, qty: c.qty, color: c.color, image: p?.images?.[0] }
    })
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
    const shipping = subtotal > 2000 ? 0 : 80
    const order = { id: 'TL-' + Math.random().toString(36).slice(2, 8).toUpperCase(), createdAt: new Date().toISOString(), status: 'Pending', customer: details, items, subtotal, shipping, total: subtotal + shipping, email: user?.email || details.email }
    setOrders((o) => [order, ...o])
    setCart([])
    return order
  }
  const updateOrderStatus = (id, status) => setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
  const upsertProduct = (product) => {
    setProducts((prev) => {
      const i = prev.findIndex((p) => p.id === product.id)
      if (i >= 0) { const next = [...prev]; next[i] = product; return next }
      return [product, ...prev]
    })
  }
  const deleteProduct = (id) => setProducts((prev) => prev.filter((p) => p.id !== id))
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartItems = cart.map((c) => ({ ...c, product: products.find((p) => p.id === c.id) })).filter((x) => x.product)
  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0)
  const value = useMemo(() => ({
    products, showcase, cart, cartItems, cartCount, subtotal, favourites, user, orders, toast,
    addToCart, updateQty, removeFromCart, toggleFavourite, signUp, signIn, signOut,
    placeOrder, updateOrderStatus, upsertProduct, deleteProduct, setShowcaseImage, notify,
  }), [products, showcase, cart, cartItems, cartCount, subtotal, favourites, user, orders, toast])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
