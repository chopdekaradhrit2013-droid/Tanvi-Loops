import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

export default function Cart() {
  const { cartItems, subtotal, updateQty, removeFromCart } = useStore()
  const nav = useNavigate()
  const shipping = subtotal === 0 || subtotal > 80 ? 0 : 4
  return (
    <section className="page cart-wrap">
      <div>
        <p className="kicker">Your</p>
        <h1 className="display" style={{ fontSize: 64 }}>Cart</h1>
        {cartItems.length === 0 && <p className="muted">Your bag is empty. <button className="pill-btn" onClick={() => nav('/shop')}>Shop the collection</button></p>}
        {cartItems.map((item) => (
          <div className="line-item" key={item.id + item.color}>
            <img src={item.product.images[0]} alt="" />
            <div>
              <strong>{item.product.name}</strong>
              <div className="muted">{item.color}</div>
              <div className="qty" style={{ marginTop: 8 }}>
                <button onClick={() => updateQty(item.id, item.color, item.qty - 1)}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.color, item.qty + 1)}>+</button>
              </div>
            </div>
            <div>
              <div>${(item.product.price * item.qty).toFixed(2)}</div>
              <button className="icon-btn" onClick={() => removeFromCart(item.id, item.color)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="totals">
          <div className="row"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
          <div className="row"><span>Estimated delivery</span><span>5–7 business days</span></div>
          <div className="row"><span>Shipping</span><span>{shipping ? `$${shipping.toFixed(2)}` : 'Complimentary'}</span></div>
          <div className="row"><span>Total</span><strong>${(subtotal + shipping).toFixed(2)}</strong></div>
        </div>
        <button className="pill-btn dark" style={{ marginTop: 20 }} disabled={!cartItems.length} onClick={() => nav('/checkout')}>→ Proceed to Checkout</button>
      </div>
    </section>
  )
}
