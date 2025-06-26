import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import HomePage from './pages/HomePage'
import RestaurantPage from './pages/RestaurantPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import LoginPage from './pages/LoginPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import OrdersPage from './pages/OrdersPage'
import GoogleSuccess from "./pages/GoogleSuccess.tsx";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/user" element={<HomePage />} />
          <Route path="/user/restaurant/:id" element={<RestaurantPage />} />
          <Route path="/user/cart" element={<CartPage />} />
          <Route path="/user/checkout" element={<CheckoutPage />} />
          <Route path="/user/login" element={<LoginPage />} />
          <Route path="/user/orders" element={<OrdersPage />} />
          <Route path="/user/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/user/google/success" element={<GoogleSuccess />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}

export default App