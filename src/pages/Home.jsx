import { Link, useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { useStore } from '../context/StoreContext.jsx'

const flower =
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80'
const teddies =
  'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80'
const tote =
  'https://images.unsplash.com/photo-1590874103328-eac38a94180d?auto=format&fit=crop&w=600&q=80'

export default function Home() {
  const { products } = useStore()
  const featured = products.filter((p) => p.featured)
  const showcase = featured.length ? featured : products
  const nav = useNavigate()
  return (
    <>
      <section className="hero">
        <div className="float-card" style={{ width: 180, height: 180, left: '12%', top: '8%', transform: 'rotate(-8deg)' }}>
          <img src={flower} alt="Crochet flower" />
        </div>
        <div className="float-card" style={{ width: 220, height: 220, right: '10%', top: '10%', transform: 'rotate(7deg)' }}>
          <img src={teddies} alt="Crochet teddies" />
        </div>
        <div className="float-card" style={{ width: 210, height: 210, left: '38%', bottom: '8%', transform: 'rotate(4deg)' }}>
          <img src={tote} alt="Handmade tote" />
        </div>
        <span className="sq" style={{ left: '8%', bottom: '28%' }} />
        <span className="sq" style={{ right: '18%', top: '22%' }} />
        <div className="hero-copy">
          <p className="kicker">Handmade with a</p>
          <h1 className="display">Little Extra Love</h1>
          <div style={{ marginTop: 28 }}>
            <button className="pill-btn dark" onClick={() => nav('/shop')}>Explore Collection</button>
          </div>
        </div>
        <div className="hero-note">
          <div className="pill">Unique crochet pieces, carefully handwoven by hand. — Explore Collection</div>
        </div>
        <div className="hero-cats">Bags · Flowers · Plushies<br />Accessories · Home Decor</div>
      </section>
      <section className="page">
        <div className="section-head">
          <p className="kicker">Browse the Collection</p>
          <h2 className="display" style={{ fontSize: 56 }}>Handmade Finds</h2>
        </div>
        <div className="toolbar">
          {['All Items', 'Bags & Totes', 'Plushies', 'Flowers & Bouquets', 'Home Decor'].map((c) => (
            <Link key={c} className="pill-btn" to={`/shop?cat=${encodeURIComponent(c)}`}>{c}</Link>
          ))}
        </div>
        <div className="grid">
          {showcase.map((p) => <ProductCard key={p.id} product={p} />)}
          {showcase.length === 0 && <p className="muted">New pieces will appear here as soon as they are added.</p>}
        </div>
      </section>
    </>
  )
}
