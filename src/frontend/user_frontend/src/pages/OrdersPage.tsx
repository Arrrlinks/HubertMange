import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Clock, MapPin, Package, CheckCircle, Truck, ChefHat } from 'lucide-react'
import { Order } from '../types'
import { api } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { Header } from '../components/Header'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return
      
      try {
        const userOrders = await api.getUserOrders(user.id)
        setOrders(userOrders)
      } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'preparing':
        return <ChefHat className="w-5 h-5 text-yellow-500" />
      case 'on_the_way':
        return <Truck className="w-5 h-5 text-blue-500" />
      case 'delivered':
        return <Package className="w-5 h-5 text-green-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmée'
      case 'preparing':
        return 'En préparation'
      case 'on_the_way':
        return 'En livraison'
      case 'delivered':
        return 'Livrée'
      default:
        return 'En attente'
    }
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black mb-4">Connexion requise</h1>
            <p className="text-gray-600 mb-8">
              Vous devez être connecté pour voir vos commandes
            </p>
            <Link
              to="user//login"
              className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Mes commandes</h1>
          <p className="text-gray-600">Suivez vos commandes actuelles et consultez votre historique</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-black mb-2">Aucune commande</h2>
            <p className="text-gray-600 mb-8">
              Vous n'avez pas encore passé de commande
            </p>
            <Link
              to="/user/"
              className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              Parcourir les restaurants
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(order.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Commande #{order.id} • {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-black">{order.total.toFixed(2)}€</p>
                    <p className="text-sm text-gray-600">{order.items.length} article{order.items.length > 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-start space-x-3 mb-4">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <div className="text-sm text-gray-600">
                      <p>{order.address.street}</p>
                      <p>{order.address.city}, {order.address.postalCode}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-medium text-black">
                          {(item.price * item.quantity).toFixed(2)}€
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Sous-total: {order.subtotal.toFixed(2)}€ • Livraison: {order.deliveryFee.toFixed(2)}€
                    </div>
                    <Link
                      to={`/user/order-confirmation/${order.id}`}
                      className="text-black hover:text-gray-600 text-sm font-medium"
                    >
                      Voir les détails →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}