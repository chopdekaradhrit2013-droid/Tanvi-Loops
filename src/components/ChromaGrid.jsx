import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import './ChromaGrid.css'

export default function ChromaGrid({
  items = [],
  className = '',
  radius = 300,
  columns = 3,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out',
  onItemClick,
}) {
  const rootRef = useRef(null)
  const fadeRef = useRef(null)
  const setX = useRef(null)
  const setY = useRef(null)
  const pos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    setX.current = gsap.quickSetter(el, '--x', 'px')
    setY.current = gsap.quickSetter(el, '--y', 'px')
    const { width, height } = el.getBoundingClientRect()
    pos.current = { x: width / 2, y: height / 2 }
    setX.current(pos.current.x)
    setY.current(pos.current.y)
  }, [])

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x, y, duration: damping, ease, overwrite: true,
      onUpdate: () => {
        setX.current?.(pos.current.x)
        setY.current?.(pos.current.y)
      },
    })
  }

  const handleMove = (e) => {
    const r = rootRef.current.getBoundingClientRect()
    moveTo(e.clientX - r.left, e.clientY - r.top)
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true })
  }

  const handleLeave = () => {
    gsap.to(fadeRef.current, { opacity: 1, duration: fadeOut, overwrite: true })
  }

  const handleCardMove = (e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  if (!items.length) return null

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={{ '--r': `${radius}px`, '--cols': columns }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {items.map((c, i) => (
        <article
          key={c.id || i}
          className="chroma-card"
          onMouseMove={handleCardMove}
          onClick={() => onItemClick ? onItemClick(c) : c.url && window.open(c.url, '_blank', 'noopener,noreferrer')}
          style={{
            '--card-border': c.borderColor || 'transparent',
            '--card-gradient': c.gradient,
            cursor: 'pointer',
          }}
        >
          <div className="chroma-img-wrapper">
            <img src={c.image} alt={c.title} loading="lazy" />
          </div>
          <footer className="chroma-info">
            <h3 className="name">{c.title}</h3>
            {c.handle && <span className={'handle' + (c.soldOut ? ' sold' : '')}>{c.handle}</span>}
            <p className="role">{c.subtitle}</p>
          </footer>
        </article>
      ))}
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />
    </div>
  )
}
