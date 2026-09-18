export const CATEGORIES = [
  'All',
  'Plushies',
  'Flowers',
  'Bags',
  'Home',
]

const teddy =
  'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80'
const flower =
  'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?auto=format&fit=crop&w=900&q=80'
const holiday =
  'https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&w=900&q=80'

export const PRODUCTS = [
  {
    id: 'holiday-couple',
    name: 'Holiday Couple',
    price: 5699,
    category: 'Plushies',
    materials: 'Cotton yarn',
    colors: ['Red', 'White'],
    stock: 6,
    featured: true,
    soldOut: false,
    images: [holiday, holiday],
    description: 'A cheerful pair, crocheted for cozy holiday memories.',
  },
  {
    id: 'cuddle-bear-duo',
    name: 'Cuddle Bear Duo',
    price: 4499,
    category: 'Plushies',
    materials: 'Cotton yarn, satin bows',
    colors: ['Brown'],
    stock: 8,
    featured: true,
    soldOut: false,
    images: [teddy, teddy],
    description: 'Soft, thoughtful companions finished with satin bows.',
  },
  {
    id: 'ruby-bloom',
    name: 'Ruby Bloom',
    price: 1999,
    category: 'Flowers',
    materials: 'Cotton yarn',
    colors: ['Red'],
    stock: 12,
    featured: true,
    soldOut: false,
    images: [flower, flower],
    description: 'A forever flower, hand-shaped petal by petal.',
  },
  {
    id: 'handmade-keepsake',
    name: 'Handmade Keepsake',
    price: 3499,
    category: 'Home',
    materials: 'Cotton yarn',
    colors: ['Brown', 'Cream'],
    stock: 5,
    featured: true,
    soldOut: false,
    images: [teddy, teddy],
    description: 'A joyful little accent for shelves, desks, and nurseries.',
  },
]
