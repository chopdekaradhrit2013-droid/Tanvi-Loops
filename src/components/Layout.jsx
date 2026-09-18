import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

const links = [
  ['/', 'Home'],
  ['/shop', 'Shop'],
  ['/collections', 'Collections'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
]

export default function Layout({ children }) {
  const { cartCount, favourites, user, toast, signOut } = useStore()
  const [open, setOpen] = useState(false)
  const nav = useNavigate()

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <Link to="/" className="brand">
            <span className="brand-mark" />
            Tanvi Loops
          </Link>
          <nav className="nav-links">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>
            ))}
          </nav>
          <div className="nav-actions">
            <button className="icon-btn" onClick={() => nav('/shop')} aria-label="Search">⌕</button>
            <button className="icon-btn" onClick={() => nav('/favourites')} aria-label="Favourites">
              ♡
              {favourites.length > 0 && <span className="badge">{favourites.length}</span>}
            </button>
            <button className="icon-btn" onClick={() => nav('/cart')} aria-label="Cart">
              Bag
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </button>
            {user ? (
              <button className="pill-btn" onClick={() => (user.isAdmin ? nav('/admin') : nav('/orders'))}>{user.name}</button>
            ) : (
              <button className="pill-btn" onClick={() => nav('/signin')}>Sign in</button>
            )}
            {user && <button className="icon-btn" onClick={signOut} title="Sign out">⎋</button>}
            <button className="icon-btn menu-btn" onClick={() => setOpen(true)}>☰</button>
          </div>
        </div>
      </header>
      {open && (
        <div className="drawer" onClick={() => setOpen(false)}>
          <nav onClick={(e) => e.stopPropagation()}>
            <div className="brand"><span className="brand-mark" /> Tanvi Loops</div>
            {links.map(([to, label]) => (
              <Link key={to} to={to} onClick={() => setOpen(false)}>{label}</Link>
            ))}
            <Link to="/cart" onClick={() => setOpen(false)}>Cart</Link>
            <Link to="/favourites" onClick={() => setOpen(false)}>Favourites</Link>
            <Link to="/orders" onClick={() => setOpen(false)}>Orders</Link>
            {user?.isAdmin && <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>}
          </nav>
        </div>
      )}
      <main>{children}</main>
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="brand"><span className="brand-mark" /> Tanvi Loops</div>
            <p>Handmade with a little extra love.</p>
          </div>
          <div>
            <div>Bags · Flowers · Plushies</div>
            <div>Accessories · Home Decor</div>
          </div>
          <div>
            <Link to="/contact">Contact</Link> · <Link to="/about">Our story</Link>
            <div>hello@tanviloops.com</div>
          </div>
        </div>
      </footer>
      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
