import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

export default function Product() {
  const { id } = useParams()
  const { products, addToCart, toggleFavourite, favourites } = useStore()
  const product = products.find((p) => p.id === id)
  const [qty, setQty] = useState(1)
  const [color, setColor] = useState(product?.colors?.[0])
  const [shot, setShot] = useState(0)
  const nav = useNavigate()
  if (!product) return <section className="page"><p>Piece not found.</p></section>
  return (
    <section className="page product-layout">
      <div>
        <div className="gallery-main"><img src={product.images[shot] || product.images[0]} alt={product.name} /></div>
        {product.images.length > 1 && (
          <div className="thumbs">
            {product.images.map((src, i) => (
              <img key={src + i} src={src} className={i === shot ? 'on' : ''} onClick={() => setShot(i)} alt="" />
            ))}
          </div>
        )}
      </div>
      <div>
        <p className="kicker" style={{ fontSize: 28 }}>{product.category}</p>
        <h1 className="display" style={{ fontSize: 52 }}>{product.name}</h1>
        <p className="price">₹{Number(product.price).toFixed(0)}</p>
        <p>{product.description}</p>
        <p className="muted">{product.materials}</p>
        <p>{product.soldOut || product.stock <= 0 ? 'Sold out' : `In stock · ${product.stock} remaining`}</p>
        <div className="row" style={{ justifyContent: 'flex-start', margin: '12px 0' }}>
          {product.colors.map((c) => (
            <button key={c} className={'swatch' + (color === c ? ' on' : '')} title={c} onClick={() => setColor(c)} style={{ background: '#efe6d8' }} />
          ))}
          <span className="muted">{color}</span>
        </div>
        <div className="qty">
          <button onClick={() => setQty((n) => Math.max(1, n - 1))}>−</button>
          <span>{qty}</span>
          <button onClick={() => setQty((n) => n + 1)}>+</button>
        </div>
        <div className="actions">
          <button className="pill-btn dark" onClick={() => addToCart(product, qty, color)}>Add to Cart</button>
          <button className="pill-btn" onClick={() => { addToCart(product, qty, color); nav('/checkout') }}>Buy Now</button>
          <button className="pill-btn" onClick={() => toggleFavourite(product.id)}>{favourites.includes(product.id) ? 'Saved' : 'Save favourite'}</button>
        </div>
      </div>
    </section>
  )
}
