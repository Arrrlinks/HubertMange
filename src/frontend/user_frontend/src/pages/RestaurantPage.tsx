import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, Clock, Plus, Minus } from 'lucide-react'
import { Restaurant, MenuItem } from '../types'
import { api } from '../services/api'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { Header } from '../components/Header'

export default function RestaurantPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, updateQuantity, items } = useCart()
  const { user } = useAuth()
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return
      
      try {
        const [restaurantData, menuData] = await Promise.all([
          api.getRestaurant(id as string),
          api.getMenuItems(id as string)
        ])
        setRestaurant(restaurantData)
        setMenuItems(menuData)
      } catch (error) {
        console.error('Error fetching restaurant data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const categories = ['all', ...new Set(menuItems.map(item => item.category))]
  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory)

  const getItemQuantity = (itemId: string) => {
    const cartItem = items.find(item => item.id === itemId)
    return cartItem ? cartItem.quantity : 0
  }

  const handleAddToCart = (item: MenuItem) => {
    if (!user) {
      navigate('/user/login')
      return
    }
    
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: restaurant!.id,
      restaurantName: restaurant!.name,
      quantity: 1
    })
  }

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      updateQuantity(itemId, 0)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-xl mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Restaurant not found</h1>
            <button
              onClick={() => navigate('/user/')}
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Restaurant Header */}
        <div className="mb-8">
          <div className="relative h-64 rounded-xl overflow-hidden mb-6">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>
          
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">{restaurant.name}</h1>
              <p className="text-gray-600 mb-2">{restaurant.cuisine}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{restaurant.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{restaurant.deliveryTime} min</span>
                </div>
                <span>Delivery €{restaurant.deliveryFee}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 border-b">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 ${
                  selectedCategory === category
                    ? 'text-black border-black'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                {category === 'all' ? 'All Items' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-6">
          {filteredItems.map((item) => {
            const quantity = getItemQuantity(item.id)
            
            return (
              <div
                key={item.id}
                className="bg-white border border-gray-100 rounded-lg p-6 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-black mb-2">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                    <p className="text-lg font-bold text-black">€{item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-end">
                  {quantity === 0 ? (
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-medium text-lg min-w-[2rem] text-center">{quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, quantity + 1)}
                        className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}