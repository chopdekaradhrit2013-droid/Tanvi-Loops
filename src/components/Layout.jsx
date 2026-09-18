import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import BubbleMenu from './BubbleMenu.jsx'

export default function Layout({ children }) {
  const { user, toast, signOut } = useStore()
  const nav = useNavigate()
  const items = [
    { label: 'home', href: '/', ariaLabel: 'Home', rotation: -8, hoverStyles: { bgColor: '#8a4b1f', textColor: '#fff' } },
    { label: 'shop', href: '/shop', ariaLabel: 'Shop', rotation: 8, hoverStyles: { bgColor: '#9a3a45', textColor: '#fff' } },
    { label: 'story', href: '/about', ariaLabel: 'Our Story', rotation: -6, hoverStyles: { bgColor: '#6b7a6a', textColor: '#fff' } },
    { label: 'cart', href: '/cart', ariaLabel: 'Cart', rotation: 8, hoverStyles: { bgColor: '#c45c2c', textColor: '#fff' } },
    { label: 'saved', href: '/favourites', ariaLabel: 'Favourites', rotation: -8, hoverStyles: { bgColor: '#5c3014', textColor: '#fff' } },
    { label: 'contact', href: '/contact', ariaLabel: 'Contact', rotation: 6, hoverStyles: { bgColor: '#8a4b1f', textColor: '#fff' } },
    { label: user ? (user.isAdmin ? 'admin' : 'orders') : 'sign in', href: user ? (user.isAdmin ? '/admin' : '/orders') : '/signin', ariaLabel: user ? 'Account' : 'Sign in', rotation: -4, hoverStyles: { bgColor: '#2b241c', textColor: '#fff' } },
  ]

  return (
    <>
      <BubbleMenu
        logo={
          <>
            <img src="/logo.svg" alt="" className="bubble-logo" />
            <span>Tanvi Loops</span>
          </>
        }
        items={items}
        menuAriaLabel="Toggle navigation"
        menuBg="#fff8ef"
        menuContentColor="#2b241c"
        useFixedPosition
        animationEase="back.out(1.5)"
        animationDuration={0.5}
        staggerDelay={0.1}
      />
      <main className="site-with-bubbles">{children}</main>
      {user && (
        <button className="pill-btn" style={{ position: 'fixed', right: 18, bottom: 18, zIndex: 40 }} onClick={() => { signOut(); nav('/') }}>
          Sign out
        </button>
      )}
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
