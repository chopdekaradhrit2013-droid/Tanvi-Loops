import { useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { useStore } from '../context/StoreContext.jsx'

export default function Favourites() {
  const { products, favourites, addToCart } = useStore()
  const saved = products.filter((p) => favourites.includes(p.id))
  const nav = useNavigate()
  return (
    <section className="page">
      <div className="section-head"><p className="kicker">Saved</p><h1 className="display" style={{ fontSize: 56 }}>Favourites</h1></div>
      {saved.length === 0 && <p className="muted">Nothing saved yet.</p>}
      <div className="grid">{saved.map((p) => (<div key={p.id}><ProductCard product={p} /><button className="pill-btn" style={{ marginTop: 10 }} onClick={() => addToCart(p, 1)}>Move to cart</button></div>))}</div>
      <button className="pill-btn" style={{ marginTop: 24 }} onClick={() => nav('/shop')}>Continue shopping</button>
    </section>
  )
}
