import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, CreditCard, Banknote, Lock } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import { Header } from '../components/Header'

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash')
  const [address, setAddress] = useState({
    street: '',
    city: 'Paris',
    postalCode: '',
    phone: ''
  })
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })

  const deliveryFee = 2.99
  const subtotal = getTotalPrice()
  const total = subtotal + deliveryFee

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    if (formatted.length <= 19) {
      setCardDetails(prev => ({ ...prev, cardNumber: formatted }))
    }
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    if (formatted.length <= 5) {
      setCardDetails(prev => ({ ...prev, expiryDate: formatted }))
    }
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    if (value.length <= 4) {
      setCardDetails(prev => ({ ...prev, cvv: value }))
    }
  }

  const validateCardDetails = () => {
    if (paymentMethod === 'cash') return true
    
    const { cardNumber, expiryDate, cvv, cardholderName } = cardDetails
    return (
      cardNumber.replace(/\s/g, '').length === 16 &&
      expiryDate.length === 5 &&
      cvv.length >= 3 &&
      cardholderName.trim().length > 0
    )
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!validateCardDetails()) {
      alert('Veuillez remplir tous les détails de paiement requis')
      return
    }

    setLoading(true)
    try {
      const orderData = {
        userId: user.id,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          restaurantId: item.restaurantId
        })),
        address,
        subtotal,
        deliveryFee,
        total,
        paymentMethod,
        ...(paymentMethod === 'card' && { cardDetails })
      }

      const order = await api.createOrder(orderData)
      clearCart()
      navigate(`/user/order-confirmation/${order.id}`)
    } catch (error) {
      console.error('Erreur lors de la commande:', error)
      alert('Échec de la commande. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    navigate('/user/cart')
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Commande</h1>
          <p className="text-gray-600">Complétez les détails de votre commande</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-8">
            {/* Delivery Address */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-black">Adresse de livraison</h2>
              </div>
              
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <input
                    type="text"
                    required
                    value={address.street}
                    onChange={(e) => setAddress(prev => ({ ...prev, street: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="123 Rue de Rivoli"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ville
                    </label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code postal
                    </label>
                    <input
                      type="text"
                      required
                      value={address.postalCode}
                      onChange={(e) => setAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="75001"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-black">Mode de paiement</h2>
              </div>
              
              {/* Payment Method Selection */}
              <div className="space-y-3 mb-6">
                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'card')}
                    className="w-4 h-4 text-black focus:ring-black"
                  />
                  <Banknote className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-black">Paiement à la livraison</p>
                    <p className="text-sm text-gray-600">Payez quand votre commande arrive</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'card')}
                    className="w-4 h-4 text-black focus:ring-black"
                  />
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-black">Carte de crédit/débit</p>
                    <p className="text-sm text-gray-600">Payez en sécurité avec votre carte</p>
                  </div>
                </label>
              </div>

              {/* Card Details Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Lock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Vos informations de paiement sont sécurisées</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom du titulaire
                    </label>
                    <input
                      type="text"
                      required={paymentMethod === 'card'}
                      value={cardDetails.cardholderName}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, cardholderName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Jean Dupont"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro de carte
                    </label>
                    <input
                      type="text"
                      required={paymentMethod === 'card'}
                      value={cardDetails.cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date d'expiration
                      </label>
                      <input
                        type="text"
                        required={paymentMethod === 'card'}
                        value={cardDetails.expiryDate}
                        onChange={handleExpiryDateChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="MM/AA"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        required={paymentMethod === 'card'}
                        value={cardDetails.cvv}
                        onChange={handleCvvChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Lock className="w-3 h-3" />
                    <span>Nous utilisons le cryptage SSL pour protéger vos informations de paiement</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 h-fit">
            <h2 className="text-lg font-semibold text-black mb-4">Résumé de la commande</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">{item.name}</p>
                    <p className="text-xs text-gray-600">{item.restaurantName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-black">
                      {item.quantity}x {item.price.toFixed(2)}€
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2 mb-6">
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
              onClick={handlePlaceOrder}
              disabled={loading || (paymentMethod === 'card' && !validateCardDetails())}
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Commande en cours...' : `Commander - ${total.toFixed(2)}€`}
            </button>

            {paymentMethod === 'card' && (
              <p className="text-xs text-gray-500 text-center mt-2">
                En passant cette commande, vous acceptez nos conditions générales
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}