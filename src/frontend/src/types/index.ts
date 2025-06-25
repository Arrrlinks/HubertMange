export interface User {
  id: string
  name: string
  email: string
}

export interface Restaurant {
  id: string
  name: string
  cuisine: string
  category?: string
  image: string
  rating: number
  deliveryTime: string
  deliveryFee: number
  description?: string
}

export interface MenuItem {
  id: string
  restaurantId: string
  name: string
  description: string
  price: number
  category: string
  image: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  restaurantId: string
  restaurantName: string
}

export interface Order {
  id: string
  userId: string
  items: {
    id: string
    name: string
    price: number
    quantity: number
    restaurantId: string
  }[]
  address: {
    street: string
    city: string
    postalCode: string
    phone: string
  }
  subtotal: number
  deliveryFee: number
  total: number
  status: 'pending' | 'confirmed' | 'preparing' | 'on_the_way' | 'delivered'
  createdAt: string
}