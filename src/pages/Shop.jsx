import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { CATEGORIES } from '../data/products.js'
import { useStore } from '../context/StoreContext.jsx'

export default function Shop({ featuredOnly }) {
  const { products } = useStore()
  const [params] = useSearchParams()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState(params.get('cat') || 'All Items')
  const [sort, setSort] = useState('featured')
  const list = useMemo(() => {
    let rows = products.slice()
    if (featuredOnly) rows = rows.filter((p) => p.featured)
    if (cat && cat !== 'All Items') rows = rows.filter((p) => p.category === cat)
    if (q) rows = rows.filter((p) => (p.name + p.description).toLowerCase().includes(q.toLowerCase()))
    if (sort === 'price-asc') rows.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') rows.sort((a, b) => b.price - a.price)
    if (sort === 'name') rows.sort((a, b) => a.name.localeCompare(b.name))
    return rows
  }, [products, featuredOnly, cat, q, sort])
  return (
    <section className="page">
      <div className="section-head">
        <p className="kicker">{featuredOnly ? 'Selected pieces' : 'Shop'}</p>
        <h1 className="display" style={{ fontSize: 56 }}>{featuredOnly ? 'Collections' : 'All Products'}</h1>
      </div>
      <div className="toolbar">
        <input className="search" placeholder="Search handmade pieces" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="select" value={cat} onChange={(e) => setCat(e.target.value)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="featured">Featured</option>
          <option value="price-asc">Price · Low to high</option>
          <option value="price-desc">Price · High to low</option>
          <option value="name">Name</option>
        </select>
      </div>
      <div className="grid">{list.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      {list.length === 0 && <p className="muted">No pieces match that search.</p>}
    </section>
  )
}
