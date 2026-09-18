export default function Price({ price, oldPrice, size = 'card' }) {
  const current = Number(price) || 0
  const was = Number(oldPrice) || 0
  const onSale = was > current && current > 0
  return (
    <span className={`price-tag ${size}`}>
      {onSale && <s className="old-price">₹{was.toLocaleString('en-IN')}</s>}
      <strong className={onSale ? 'sale-price' : ''}>₹{current.toLocaleString('en-IN')}</strong>
    </span>
  )
}
