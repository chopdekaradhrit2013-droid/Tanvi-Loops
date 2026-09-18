import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import ParticleText from '../components/ParticleText.jsx'
import AccordionGallery from '../components/AccordionGallery.jsx'
import { useStore } from '../context/StoreContext.jsx'

const LABELS = ['Ruby Bloom', 'Cuddle Bears', 'Heart Tote']

export default function Home() {
  const { products, showcase, collection } = useStore()
  const nav = useNavigate()
  const [cat, setCat] = useState('All')
  const cats = ['All', 'Plushies', 'Flowers', 'Bags', 'Home']
  const list = products.filter((p) => cat === 'All' || p.category === cat)
  const photos = (showcase || []).filter(Boolean)
  const collectionPhotos = (collection || []).filter(Boolean)
  const galleryItems = photos.map((image, i) => ({
    image,
    label: LABELS[i] || `Piece ${i + 1}`,
    alt: LABELS[i] || `Studio piece ${i + 1}`,
  }))

  return (
    <>
      <section className="studio-hero">
        <p className="crumb">Handmade studio</p>
        <p className="eyebrow">Small-batch crochet goods</p>
        <div className="hero-title-wrap">
          <ParticleText
            text="Tanvi Loops"
            particleSize={2}
            density={4}
            color="#2b241c"
            highlightColor="#8a4b1f"
            scatter={180}
            gatherDuration={1600}
            stagger={420}
            pointerRepel={40}
            repelRadius={120}
            idleDrift={0.7}
            trigger="hover"
            fontSize="clamp(3rem, 12vw, 8rem)"
            fontWeight={800}
            fontFamily="inherit"
            glow
          />
        </div>
        <p className="studio-sub">Crafted with Care. Built to Delight.</p>
        {photos[0] && <div className="studio-float left"><img src={photos[0]} alt="" /></div>}
        {photos[1] && <div className="studio-float mid"><img src={photos[1]} alt="" /></div>}
        {photos[2] && <div className="studio-float right"><img src={photos[2]} alt="" /></div>}
        <button className="ghost-btn" onClick={() => nav('/shop')}>Explore the collection →</button>
      </section>

      {galleryItems.length > 0 && (
        <section className="page showcase-strip">
          <p className="eyebrow">From the studio</p>
          <AccordionGallery
            items={galleryItems}
            defaultIndex={0}
            expandRatio={0.52}
            trigger="hover"
            height={420}
            radius={22}
            accentColor="#f6ead7"
            overlayColor="#3a2416"
            textColor="#fff8ef"
          />
        </section>
      )}

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
        {collectionPhotos.length > 0 && (
          <div className="grid studio-grid" style={{ marginBottom: 28 }}>
            {collectionPhotos.map((src, i) => (
              <article key={src + i} className="card studio-card">
                <div className="card-media">
                  <img src={src} alt={`Collection ${i + 1}`} />
                </div>
              </article>
            ))}
          </div>
        )}
        <div className="grid studio-grid">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        {list.length === 0 && collectionPhotos.length === 0 && (
          <p className="muted" style={{ textAlign: 'center' }}>New pieces will appear here once they are added.</p>
        )}
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
