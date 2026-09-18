import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

export default function ProductCard({ product }) {
  const nav = useNavigate()
  const { favourites, toggleFavourite } = useStore()
  const loved = favourites.includes(product.id)
  return (
    <article className="card" onClick={() => nav(`/product/${product.id}`)}>
      <div className="card-media">
        <img src={product.images[0]} alt={product.name} />
        <button className="heart" onClick={(e) => { e.stopPropagation(); toggleFavourite(product.id) }} aria-label="Favourite">{loved ? '♥' : '♡'}</button>
      </div>
      <div className="card-body">
        <div className="row">
          <h3>{product.name}</h3>
          <strong>₹{Number(product.price).toFixed(0)}</strong>
        </div>
        <div className="muted">{product.category}{product.soldOut ? ' · Sold out' : ''}</div>
      </div>
    </article>
  )
}
