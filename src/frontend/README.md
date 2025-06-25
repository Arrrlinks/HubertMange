# HubertManges - Food Delivery Platform

A modern, full-stack food delivery application built with Next.js 14, inspired by Glovo.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Restaurant Browsing**: Filter by categories, search functionality
- **Menu Management**: View detailed menus with high-quality images
- **Cart System**: Add, remove, and modify items with real-time updates
- **User Authentication**: Mock login/register system with Google OAuth simulation
- **Order Management**: Complete checkout flow with payment options
- **Payment Methods**: Cash on delivery and credit/debit card options
- **Responsive Design**: Optimized for desktop, tablet, and mobile

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Lucide React** for icons
- **Next.js Image** for optimized images

### Data
- **Mock API** with realistic data simulation
- **Local Storage** for cart persistence and authentication
- **In-memory** order storage

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hubertmanges
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at: http://localhost:3000

### Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 🎨 Design System

### Colors
- **Primary**: Black (#000000)
- **Background**: White (#FFFFFF)
- **Text**: Gray scale (#111827, #6B7280, #9CA3AF)
- **Accent**: Success, Warning, Error states

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Components
- **Buttons**: Primary (black), Secondary (white with border)
- **Cards**: Subtle shadows with hover effects
- **Forms**: Clean inputs with focus states
- **Navigation**: Sticky header with cart indicator

## 📱 Usage

1. **Browse Restaurants**: View available restaurants by category
2. **View Menus**: Click on any restaurant to see their menu
3. **Add to Cart**: Select items and quantities
4. **Login**: Create account or login to proceed with order
5. **Choose Payment**: Select between cash on delivery or card payment
6. **Checkout**: Enter delivery address and payment details
7. **Track Order**: View order confirmation and status

## 🧪 Mock Data

The application uses a comprehensive mock API system that simulates:

- **6 Sample Restaurants** across different cuisines
- **15+ Menu Items** with realistic pricing
- **User Authentication** with mock JWT tokens
- **Order Processing** with status tracking
- **Payment Processing** with card validation
- **Realistic API Delays** for authentic UX

### Sample Restaurants
- Bella Italia (Italian)
- Dragon Palace (Chinese)
- Burger Junction (American)
- Pizza Corner (Italian)
- Green Garden (Healthy)
- Sweet Dreams (Desserts)

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
app/
├── components/          # Reusable UI components
├── contexts/           # React Context providers
├── services/           # API services and mock data
├── types/              # TypeScript type definitions
├── (pages)/            # Next.js App Router pages
│   ├── cart/
│   ├── checkout/
│   ├── login/
│   ├── restaurant/[id]/
│   └── order-confirmation/[orderId]/
├── globals.css         # Global styles
└── layout.tsx          # Root layout
```

### Code Structure

The codebase follows Next.js 14 App Router conventions:

- **Server Components**: Default for better performance
- **Client Components**: Used for interactivity ('use client')
- **Component Composition**: Reusable, modular React components
- **Type Safety**: Full TypeScript support throughout
- **State Management**: Context API for auth, Zustand for cart
- **Mock Services**: Realistic API simulation for development

## 🚀 Deployment

This Next.js application can be deployed to various platforms:

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
- **Netlify**: Static export or server-side rendering
- **Railway**: Full-stack deployment
- **DigitalOcean**: App Platform deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** for the amazing React framework
- **Pexels** for high-quality food images
- **Lucide** for beautiful icons
- **Tailwind CSS** for the utility-first CSS framework
- **Glovo** for design inspiration