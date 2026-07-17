const demoProducts = [
  {
    id: 1001,
    title: 'Classic Men Shirt',
    price: 49.99,
    oldPrice: 69.99,
    category: 'Men',
    image: '/placeholder-product.svg',
    description: 'A clean everyday shirt for casual and semi-formal wear.',
    rating: { rate: 4.6, count: 84 }
  },
  {
    id: 1002,
    title: 'Women Elegant Dress',
    price: 89.99,
    oldPrice: 119.99,
    category: 'Women',
    image: '/placeholder-product.svg',
    description: 'Soft fabric dress designed for comfort and a polished look.',
    rating: { rate: 4.7, count: 112 }
  },
  {
    id: 1003,
    title: 'Diamond Style Necklace',
    price: 129.0,
    oldPrice: 159.0,
    category: 'Jewellery',
    image: '/placeholder-product.svg',
    description: 'Statement necklace with a bright finish for special occasions.',
    rating: { rate: 4.8, count: 67 }
  },
  {
    id: 1004,
    title: 'Wireless Bluetooth Headphones',
    price: 79.5,
    oldPrice: 99.0,
    category: 'Electronics',
    image: '/placeholder-product.svg',
    description: 'Comfortable over-ear headphones with clear sound and solid battery life.',
    rating: { rate: 4.5, count: 143 }
  },
  {
    id: 1005,
    title: 'Women Beauty Serum',
    price: 35.0,
    oldPrice: null,
    category: 'Beauty',
    image: '/placeholder-product.svg',
    description: 'Lightweight serum intended for daily skin care routines.',
    rating: { rate: 4.4, count: 58 }
  },
  {
    id: 1006,
    title: 'Men Casual Sneakers',
    price: 64.99,
    oldPrice: 84.99,
    category: 'Men',
    image: '/placeholder-product.svg',
    description: 'Versatile sneakers that work for daily wear and travel.',
    rating: { rate: 4.3, count: 96 }
  }
]

export function getDemoProducts() {
  return demoProducts
}

export function getDemoProductById(id) {
  const normalizedId = Number(id)
  return demoProducts.find((product) => product.id === normalizedId) || null
}
