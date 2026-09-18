import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { useStore } from '../context/StoreContext.jsx'

export default function Home() {
  const { products } = useStore()
  const nav = useNavigate()
  const [cat, setCat] = useState('All')
  const cats = ['All', 'Plushies', 'Flowers', 'Bags', 'Home']
  const list = products.filter((p) => cat === 'All' || p.category === cat)
  const heroL = products.find((p) => p.id === 'cuddle-bear-duo') || products[1]
  const heroR = products.find((p) => p.id === 'holiday-couple') || products[0]

  return (
    <>
      <section className="studio-hero">
        <p className="crumb">Tanvi Loops / Handmade studio</p>
        <p className="eyebrow">Small-batch crochet goods</p>
        <h1 className="studio-title">
          Crafted with <span>Care</span>
        </h1>
        <p className="studio-sub">Built to Delight</p>
        {heroL && (
          <div className="studio-float left">
            <img src={heroL.images[0]} alt={heroL.name} />
          </div>
        )}
        {heroR && (
          <div className="studio-float right">
            <img src={heroR.images[0]} alt={heroR.name} />
          </div>
        )}
        <button className="ghost-btn" onClick={() => nav('/shop')}>Explore the collection →</button>
      </section>

      <section className="page studio-collection">
        <div className="cat-row">
          {cats.map((c) => (
            <button key={c} className={'cat-pill' + (cat === c ? ' on' : '')} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
        <div className="studio-head">
          <div>
            <p className="eyebrow">The collection / 01</p>
            <h2>Little handmade<br />joys</h2>
          </div>
          <p className="muted">Thoughtful crochet pieces for gifting, collecting, and making everyday corners feel warmer.</p>
        </div>
        <div className="grid studio-grid">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="note-band">
        <p className="eyebrow light">A note from the studio</p>
        <h2>A little love, delivered.</h2>
        <p>Sign up for new drops, behind-the-scenes stitches, and occasional good things in your inbox.</p>
        <form className="note-form" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Your email address" required />
          <button className="pill-btn light" type="submit">Join the list</button>
        </form>
      </section>
    </>
  )
}
