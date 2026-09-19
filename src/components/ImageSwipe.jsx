import { useRef, useState } from 'react'
import './ImageSwipe.css'

export default function ImageSwipe({ images = [], alt = '', soldOut = false, className = '', onOpen }) {
  const shots = (images || []).filter(Boolean)
  const [i, setI] = useState(0)
  const start = useRef(null)
  const moved = useRef(false)
  if (!shots.length) return <div className={'swipe ' + className} />
  const go = (dir, e) => {
    e?.stopPropagation()
    e?.preventDefault()
    setI((n) => (n + dir + shots.length) % shots.length)
  }
  const onStart = (e) => {
    const t = e.touches ? e.touches[0] : e
    start.current = { x: t.clientX, y: t.clientY }
    moved.current = false
  }
  const onMove = (e) => {
    if (!start.current) return
    const t = e.touches ? e.touches[0] : e
    if (Math.abs(t.clientX - start.current.x) > 12) moved.current = true
  }
  const onEnd = (e) => {
    if (!start.current) return
    const t = e.changedTouches ? e.changedTouches[0] : e
    const dx = t.clientX - start.current.x
    const dy = t.clientY - start.current.y
    start.current = null
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      e.stopPropagation()
      setI((n) => (dx < 0 ? (n + 1) % shots.length : (n - 1 + shots.length) % shots.length))
      return
    }
    if (!moved.current && onOpen) onOpen()
  }
  return (
    <div
      className={'swipe ' + className}
      onTouchStart={onStart}
      onTouchMove={onMove}
      onTouchEnd={onEnd}
      onMouseDown={onStart}
      onMouseUp={onEnd}
    >
      <img src={shots[i]} alt={alt} draggable="false" />
      {soldOut && <span className="sold-badge">Sold out</span>}
      {shots.length > 1 && (
        <>
          <button type="button" className="swipe-btn prev" aria-label="Previous photo" onClick={(e) => go(-1, e)}>‹</button>
          <button type="button" className="swipe-btn next" aria-label="Next photo" onClick={(e) => go(1, e)}>›</button>
          <div className="swipe-dots">
            {shots.map((_, n) => (
              <button key={n} type="button" className={n === i ? 'on' : ''} aria-label={`Photo ${n + 1}`} onClick={(e) => { e.stopPropagation(); setI(n) }} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
