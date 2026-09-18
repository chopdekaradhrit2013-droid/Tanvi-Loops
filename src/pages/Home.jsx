import { Link, useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { flower_red, teddy_pair, bag_hearts } from '../heroImages.js'

export default function Home() {
  const { products } = useStore()
  const featured = products.filter((p) => p.featured)
  const showcase = featured.length ? featured : products
  const nav = useNavigate()
  return (
    <>
      <section className="hero">
        <div className="float-card" style={{ width: 180, height: 180, left: '12%', top: '8%', transform: 'rotate(-8deg)' }}>
          <img src={flower_red} alt="Crochet flower" />
        </div>
        <div className="float-card" style={{ width: 220, height: 220, right: '10%', top: '10%', transform: 'rotate(7deg)' }}>
          <img src={teddy_pair} alt="Crochet teddies" />
        </div>
        <div className="float-card" style={{ width: 210, height: 210, left: '38%', bottom: '8%', transform: 'rotate(4deg)' }}>
          <img src={bag_hearts} alt="Heart tote" />
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
