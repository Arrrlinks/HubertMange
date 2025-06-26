import { User, Restaurant, MenuItem, Order } from '../types'
import axios from "axios";

// Mock data
const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: "Bella Italia",
    cuisine: "Italien",
    category: "pasta",
    rating: 4.5,
    deliveryTime: "30-45",
    deliveryFee: 2.99,
    image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
    description: "Cuisine italienne authentique avec des ingrédients frais"
  },
  {
    id: '2',
    name: "Dragon Palace",
    cuisine: "Chinois",
    category: "sushi",
    rating: 4.3,
    deliveryTime: "25-40",
    deliveryFee: 3.49,
    image: "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg",
    description: "Plats chinois traditionnels avec une présentation moderne"
  },
  {
    id: '3',
    name: "Burger Junction",
    cuisine: "Américain",
    category: "burger",
    rating: 4.2,
    deliveryTime: "20-35",
    deliveryFee: 2.49,
    image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
    description: "Burgers gastronomiques et comfort food américain classique"
  },
  {
    id: '4',
    name: "Pizza Corner",
    cuisine: "Italien",
    category: "pizza",
    rating: 4.6,
    deliveryTime: "25-35",
    deliveryFee: 2.99,
    image: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg",
    description: "Pizzas au feu de bois avec des saveurs italiennes authentiques"
  },
  {
    id: '5',
    name: "Green Garden",
    cuisine: "Healthy",
    category: "salad",
    rating: 4.4,
    deliveryTime: "15-25",
    deliveryFee: 1.99,
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    description: "Salades fraîches et bowls sains préparés quotidiennement"
  },
  {
    id: '6',
    name: "Sweet Dreams",
    cuisine: "Desserts",
    category: "dessert",
    rating: 4.7,
    deliveryTime: "20-30",
    deliveryFee: 2.49,
    image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg",
    description: "Desserts artisanaux et douceurs sucrées"
  }
]

const mockMenuItems: { [restaurantId: string]: MenuItem[] } = {
  '1': [
    {
      id: 'item-1',
      restaurantId: '1',
      name: "Pizza Margherita",
      description: "Tomates fraîches, mozzarella et basilic",
      price: 14.99,
      category: "Pizza",
      image: "https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg"
    },
    {
      id: 'item-2',
      restaurantId: '1',
      name: "Spaghetti Carbonara",
      description: "Pâtes classiques aux œufs, fromage et pancetta",
      price: 16.99,
      category: "Pâtes",
      image: "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg"
    },
    {
      id: 'item-3',
      restaurantId: '1',
      name: "Tiramisu",
      description: "Dessert italien traditionnel au café et mascarpone",
      price: 7.99,
      category: "Dessert",
      image: "https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg"
    }
  ],
  '2': [
    {
      id: 'item-4',
      restaurantId: '2',
      name: "Poulet aigre-doux",
      description: "Poulet croustillant à l'ananas et poivrons",
      price: 13.99,
      category: "Plat principal",
      image: "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg"
    },
    {
      id: 'item-5',
      restaurantId: '2',
      name: "Bœuf Lo Mein",
      description: "Nouilles sautées au bœuf tendre et légumes",
      price: 15.99,
      category: "Nouilles",
      image: "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg"
    },
    {
      id: 'item-6',
      restaurantId: '2',
      name: "Nems aux légumes",
      description: "Nems croustillants aux légumes avec sauce chili douce",
      price: 8.99,
      category: "Entrées",
      image: "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg"
    }
  ],
  '3': [
    {
      id: 'item-7',
      restaurantId: '3',
      name: "Cheeseburger classique",
      description: "Steak de bœuf avec fromage, salade, tomate et cornichons",
      price: 12.99,
      category: "Burgers",
      image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg"
    },
    {
      id: 'item-8',
      restaurantId: '3',
      name: "Ailes de poulet croustillantes",
      description: "Ailes style Buffalo avec sauce ranch",
      price: 10.99,
      category: "Entrées",
      image: "https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg"
    },
    {
      id: 'item-9',
      restaurantId: '3',
      name: "Frites garnies",
      description: "Frites croustillantes garnies de fromage, bacon et oignons verts",
      price: 8.99,
      category: "Accompagnements",
      image: "https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg"
    }
  ],
  '4': [
    {
      id: 'item-10',
      restaurantId: '4',
      name: "Pizza Pepperoni",
      description: "Pizza classique au pepperoni et mozzarella",
      price: 16.99,
      category: "Pizza",
      image: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg"
    },
    {
      id: 'item-11',
      restaurantId: '4',
      name: "Pizza quatre fromages",
      description: "Mozzarella, parmesan, gorgonzola et ricotta",
      price: 18.99,
      category: "Pizza",
      image: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg"
    }
  ],
  '5': [
    {
      id: 'item-12',
      restaurantId: '5',
      name: "Salade César",
      description: "Laitue romaine, parmesan, croûtons et sauce César",
      price: 11.99,
      category: "Salades",
      image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
    },
    {
      id: 'item-13',
      restaurantId: '5',
      name: "Bowl de quinoa",
      description: "Quinoa aux légumes grillés et sauce tahini",
      price: 13.99,
      category: "Bowls",
      image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
    }
  ],
  '6': [
    {
      id: 'item-14',
      restaurantId: '6',
      name: "Gâteau au chocolat",
      description: "Gâteau au chocolat riche avec ganache au chocolat",
      price: 6.99,
      category: "Gâteaux",
      image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg"
    },
    {
      id: 'item-15',
      restaurantId: '6',
      name: "Cheesecake",
      description: "Cheesecake style New York avec compote de fruits rouges",
      price: 7.99,
      category: "Gâteaux",
      image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg"
    }
  ]
}

// Mock storage for orders
let mockOrders: Order[] = []
let orderIdCounter = 1

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockApi = {
  // Auth endpoints
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    try {
      const options = {
        method: 'POST',
        url: 'http://localhost:3000/user/login',
        params: {'': ''},
        headers: {
          'Content-Type': 'application/json'
        },
        data: { username: email, password: password }
      };

      const response = await axios.request(options);

      return {
        token: response.data.accessToken,
        user: {
          id: response.data.user.id,
          name: response.data.user.username,
          email: response.data.user.email
        }
      };
    } catch (error) {
      console.error(`Error during login:`, error);
      throw error;
    }
  },


  register: async (name: string, email: string, password: string): Promise<{ token: string; user: User }> => {
    await delay(1000)

    const options = {
      method: 'POST',
      url: 'http://localhost:3000/user/register',
      params: {'': ''},
      headers: {
        'Content-Type': 'application/json'
      },
      data: { username: name, email: email, password: password }
    };

    const response = await axios.request(options);

    return {
      token: response.data.accessToken,
      user: {
        id: response.data.user.id,
        name: response.data.user.username,
        email: response.data.user.email
      }
    };
  },

  // Restaurant endpoints
  getRestaurants: async (): Promise<Restaurant[]> => {
    await delay(500)
    return mockRestaurants
  },

  getRestaurant: async (id: string): Promise<Restaurant> => {
    await delay(300)
    const restaurant = mockRestaurants.find(r => r.id === id)
    if (!restaurant) {
      throw new Error('Restaurant non trouvé')
    }
    return restaurant
  },

  getMenuItems: async (restaurantId: string): Promise<MenuItem[]> => {
    await delay(400)
    return mockMenuItems[restaurantId] || []
  },

  // Order endpoints
  createOrder: async (orderData: any): Promise<Order> => {
    await delay(800)
    
    const order: Order = {
      id: `order-${orderIdCounter++}`,
      userId: orderData.userId,
      items: orderData.items,
      address: orderData.address,
      subtotal: orderData.subtotal,
      deliveryFee: orderData.deliveryFee,
      total: orderData.total,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }
    
    mockOrders.push(order)
    return order
  },

  getOrder: async (orderId: string): Promise<Order> => {
    await delay(300)
    const order = mockOrders.find(o => o.id === orderId)
    if (!order) {
      throw new Error('Commande non trouvée')
    }
    return order
  },

  getUserOrders: async (userId: string): Promise<Order[]> => {
    await delay(500)
    return mockOrders
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },
}