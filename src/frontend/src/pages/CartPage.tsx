import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { Header } from '../components/Header'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!user) {
      navigate('/login')
      return
    }
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-black mb-2">Votre panier est vide</h1>
            <p className="text-gray-600 mb-8">
              Ajoutez des plats délicieux de nos restaurants pour commencer
            </p>
            <Link
              to="/"
              className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              Parcourir les restaurants
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const deliveryFee = 2.99
  const subtotal = getTotalPrice()
  const total = subtotal + deliveryFee

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Votre panier</h1>
          <p className="text-gray-600">Vérifiez vos articles avant de commander</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200 mb-8">
          {items.map((item) => (
            <div key={item.id} className="p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-black mb-1">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.restaurantName}</p>
                  <p className="text-lg font-bold text-black">{item.price.toFixed(2)}€</p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-medium text-lg min-w-[2rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-black mb-4">Résumé de la commande</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Sous-total</span>
              <span>{subtotal.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Frais de livraison</span>
              <span>{deliveryFee.toFixed(2)}€</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between text-lg font-bold text-black">
                <span>Total</span>
                <span>{total.toFixed(2)}€</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors font-medium"
          >
            Procéder au paiement
          </button>
        </div>
      </div>
    </div>
  )
}