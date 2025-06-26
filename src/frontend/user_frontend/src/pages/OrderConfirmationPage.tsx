import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, Clock, MapPin, Phone } from 'lucide-react'
import { Order } from '../types'
import { api } from '../services/api'
import { Header } from '../components/Header'

export default function OrderConfirmationPage() {
  const { orderId } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return
      
      try {
        const orderData = await api.getOrder(orderId as string)
        setOrder(orderData)
      } catch (error) {
        console.error('Erreur lors du chargement de la commande:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Commande introuvable</h1>
            <Link
              to="/user/"
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50'
      case 'preparing':
        return 'text-yellow-600 bg-yellow-50'
      case 'on_the_way':
        return 'text-blue-600 bg-blue-50'
      case 'delivered':
        return 'text-green-600 bg-green-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Commande confirmée'
      case 'preparing':
        return 'En préparation'
      case 'on_the_way':
        return 'En livraison'
      case 'delivered':
        return 'Livrée'
      default:
        return 'En traitement'
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-black mb-2">Commande confirmée !</h1>
          <p className="text-gray-600">
            Votre commande a été passée avec succès
          </p>
        </div>

        {/* Order Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-black">Statut de la commande</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">ID de commande</p>
              <p className="font-medium text-black">{order.id}</p>
            </div>
            <div>
              <p className="text-gray-600">Livraison estimée</p>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <p className="font-medium text-black">25-35 minutes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <MapPin className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-black">Adresse de livraison</h2>
          </div>
          
          <div className="text-gray-600">
            <p>{order.address.street}</p>
            <p>{order.address.city}, {order.address.postalCode}</p>
            <div className="flex items-center space-x-1 mt-2">
              <Phone className="w-4 h-4" />
              <span>{order.address.phone}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-black mb-4">Articles commandés</h2>
          
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 font-medium">{item.quantity}x</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-black">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.price.toFixed(2)}€ chacun</p>
                </div>
                <p className="font-medium text-black">
                  {(item.price * item.quantity).toFixed(2)}€
                </p>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Sous-total</span>
              <span>{order.subtotal.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Frais de livraison</span>
              <span>{order.deliveryFee.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-black border-t pt-2">
              <span>Total</span>
              <span>{order.total.toFixed(2)}€</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center space-y-4">
          <Link
            to="/user/orders"
            className="block bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Voir mes commandes
          </Link>
          <Link
            to="/user/"
            className="block text-black hover:text-gray-600 transition-colors"
          >
            Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  )
}