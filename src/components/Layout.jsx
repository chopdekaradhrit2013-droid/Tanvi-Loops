import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

const links = [
  ['/', 'Home'],
  ['/shop', 'Shop'],
  ['/about', 'Our Story'],
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
            <img className="brand-logo" src="/logo.png" alt="Tanvi Loops" />
            Tanvi Loops
          </Link>
          <nav className="nav-links">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>
            ))}
          </nav>
          <div className="nav-actions">
            <button className="icon-btn" onClick={() => nav('/favourites')} aria-label="Favourites">
              ♡
              {favourites.length > 0 && <span className="badge">{favourites.length}</span>}
            </button>
            <button className="icon-btn" onClick={() => nav('/cart')} aria-label="Cart">
              🛒
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </button>
            {user ? (
              <button className="pill-btn" onClick={() => (user.isAdmin ? nav('/admin') : nav('/orders'))}>{user.name}</button>
            ) : (
              <button className="pill-btn" onClick={() => nav('/signin')}>Sign in</button>
            )}
            {user && <button className="icon-btn" onClick={signOut} title="Sign out">⏍</button>}
            <button className="icon-btn menu-btn" onClick={() => setOpen(true)}>☰</button>
          </div>
        </div>
      </header>
      {open && (
        <div className="drawer" onClick={() => setOpen(false)}>
          <nav onClick={(e) => e.stopPropagation()}>
            <div className="brand"><img className="brand-logo" src="/logo.png" alt="" /> Tanvi Loops</div>
            {links.map(([to, label]) => (
              <Link key={to} to={to} onClick={() => setOpen(false)}>{label}</Link>
            ))}
            <Link to="/cart" onClick={() => setOpen(false)}>Cart</Link>
            <Link to="/favourites" onClick={() => setOpen(false)}>Favourites</Link>
            {user?.isAdmin && <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>}
          </nav>
        </div>
      )}
      <main>{children}</main>
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <strong>Tanvi Loops</strong>
            <p>Handmade with a little extra love.</p>
          </div>
          <div>
            Questions? <a href="mailto:cooltanwee@gmail.com">cooltanwee@gmail.com</a>
            <div>© 2026 Tanvi Loops</div>
          </div>
        </div>
      </footer>
      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
