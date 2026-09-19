import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import Price from './Price.jsx'
import ImageSwipe from './ImageSwipe.jsx'

export default function ProductCard({ product }) {
  const nav = useNavigate()
  const { favourites, toggleFavourite, addToCart } = useStore()
  const loved = favourites.includes(product.id)
  const soldOut = product.soldOut || product.stock <= 0
  return (
    <article className="card studio-card">
      <div className="card-media">
        <ImageSwipe
          images={product.images}
          alt={product.name}
          soldOut={soldOut}
          onOpen={() => nav(`/product/${product.id}`)}
        />
        <button className="heart" onClick={(e) => { e.stopPropagation(); toggleFavourite(product.id) }} aria-label="Favourite">{loved ? '♥' : '♡'}</button>
      </div>
      <div className="card-body">
        <div className="row">
          <h3 onClick={() => nav(`/product/${product.id}`)}>{product.name}</h3>
          <Price price={product.price} oldPrice={product.oldPrice} />
        </div>
        {soldOut ? <p className="sold-text">Sold out</p> : <p className="muted">{product.description}</p>}
        <button className="ghost-btn wide" disabled={soldOut} onClick={() => addToCart(product, 1, product.colors?.[0])}>{soldOut ? 'Sold out' : 'Add to bag'}</button>
      </div>
    </article>
  )
}
