import teddy_pair from '../media/teddy_pair.js'
import holiday_couple from '../media/holiday_couple.js'
import heart_tote from '../media/heart_tote.js'
import ruby_bloom from '../media/ruby_bloom.js'

export const CATEGORIES = ['All', 'Plushies', 'Flowers', 'Bags', 'Home']

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
    images: [holiday_couple, holiday_couple],
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
    images: [teddy_pair, teddy_pair],
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
    images: [ruby_bloom, ruby_bloom],
    description: 'A forever flower, hand-shaped petal by petal.',
  },
  {
    id: 'heart-tote',
    name: 'Heart Tote',
    price: 3299,
    category: 'Bags',
    materials: 'Cotton yarn',
    colors: ['Red', 'Pink'],
    stock: 7,
    featured: true,
    soldOut: false,
    images: [heart_tote, heart_tote],
    description: 'A handmade tote stitched square by square.',
  },
]
