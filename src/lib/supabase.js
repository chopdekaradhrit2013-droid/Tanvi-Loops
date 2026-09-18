import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseEnabled = Boolean(url && key)
export const supabase = supabaseEnabled ? createClient(url, key) : null

function extFromDataUrl(dataUrl) {
  const m = /^data:(image\/[a-zA-Z0-9+.-]+);/.exec(dataUrl || '')
  if (!m) return 'jpg'
  const type = m[1].replace('image/', '')
  if (type === 'jpeg') return 'jpg'
  return type.split('+')[0] || 'jpg'
}

export async function uploadDataUrl(dataUrl, folder = 'uploads') {
  if (!supabaseEnabled || !dataUrl) return dataUrl
  if (!String(dataUrl).startsWith('data:')) return dataUrl
  const res = await fetch(dataUrl)
  const blob = await res.blob()
  const ext = extFromDataUrl(dataUrl)
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('product-images').upload(path, blob, {
    contentType: blob.type || 'image/jpeg',
    upsert: true,
  })
  if (error) throw error
  const { data } = supabase.storage.from('product-images').getPublicUrl(path)
  return data.publicUrl
}

export function mapProduct(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price) || 0,
    category: row.category || 'Plushies',
    materials: row.materials || '',
    colors: row.colors || [],
    stock: Number(row.stock) || 0,
    featured: !!row.featured,
    soldOut: !!row.sold_out,
    images: row.images || [],
    description: row.description || '',
  }
}

export function toRow(product) {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    category: product.category,
    materials: product.materials,
    colors: product.colors || [],
    stock: product.stock,
    featured: !!product.featured,
    sold_out: !!product.soldOut,
    images: product.images || [],
    description: product.description || '',
  }
}
