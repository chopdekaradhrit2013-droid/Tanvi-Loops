import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import Price from './Price.jsx'

export default function ProductCard({ product }) {
  const nav = useNavigate()
  const { favourites, toggleFavourite, addToCart } = useStore()
  const loved = favourites.includes(product.id)
  return (
    <article className="card studio-card">
      <div className="card-media" onClick={() => nav(`/product/${product.id}`)}>
        <img src={product.images[0]} alt={product.name} />
        <button className="heart" onClick={(e) => { e.stopPropagation(); toggleFavourite(product.id) }} aria-label="Favourite">{loved ? '♥' : '♡'}</button>
      </div>
      <div className="card-body">
        <div className="row">
          <h3 onClick={() => nav(`/product/${product.id}`)}>{product.name}</h3>
          <Price price={product.price} oldPrice={product.oldPrice} />
        </div>
        <p className="muted">{product.description}</p>
        <button className="ghost-btn wide" onClick={() => addToCart(product, 1, product.colors?.[0])}>Add to bag</button>
      </div>
    </article>
  )
}
