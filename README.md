# Plant Marketplace

A modern MERN stack e-commerce application for buying and selling plants online, featuring user authentication, shopping cart, payment processing, and admin functionality.

## 🌿 Features

### User Features
- **User Authentication**: Secure login/register with JWT
- **Plant Browsing**: Browse and search available plants
- **Shopping Cart**: Add/remove items and manage cart
- **Checkout Process**: Complete purchases with payment integration
- **Order Management**: Track and view order history
- **Plant Care Assistant**: AI-powered plant care guidance

### Seller Features
- **Seller Dashboard**: Manage products and sales
- **Product Management**: Add/edit/delete plant listings
- **Order Tracking**: Monitor customer orders

### Admin Features
- **Admin Dashboard**: Full site management
- **User Management**: View and manage users
- **Product Management**: Moderate all products
- **Order Management**: Oversee all transactions

### Technical Features
- **Responsive Design**: Mobile-first responsive UI
- **Payment Integration**: Stripe payment processing
- **Image Upload**: Cloudinary for plant images
- **AI Integration**: Gemini API for plant care advice
- **Real-time Updates**: Live notifications and updates

## 🛠 Tech Stack

- **Frontend**: React, Vite, TailwindCSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payments**: Stripe API
- **Image Storage**: Cloudinary
- **AI Integration**: Gemini API
- **Styling**: TailwindCSS with custom themes
- **Notifications**: React Toastify

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Docker (for containerized deployment)

### Local Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd plant-marketplace
```

2. **Install dependencies**
```bash
# Backend dependencies
cd server
npm install

# Frontend dependencies
cd ../client
npm install
```

3. **Set up environment variables**

Create `.env` files in both `server/` and `client/` directories:

**Server (.env)**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/plant-marketplace
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:3000
```

**Client (.env)**
```env
VITE_REACT_APP_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. **Run the application**

**Development mode:**
```bash
# Terminal 1 - Start backend
cd server
npm start

# Terminal 2 - Start frontend
cd client
npm run dev
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)
```bash
# Build and run the entire application
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

**Access the application:**
- Frontend: http://localhost:5000
- Backend API: http://localhost:5000/api

### Individual Containers
```bash
# Build the Docker image
docker build -t plant-marketplace .

# Run the container
docker run -p 5000:5000 plant-marketplace
```

## ☁️ Cloud Deployment

### Deploy to Render.com
1. Push code to GitHub repository
2. Connect to Render.com
3. Use the `render.yaml` configuration file
4. Add environment variables in Render dashboard
5. Deploy automatically with GitHub integration

### Environment Variables Required
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `CLOUDINARY_*` - Cloudinary credentials
- `STRIPE_*` - Stripe API keys
- `GEMINI_API_KEY` - Gemini API key

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Plants
- `GET /api/plants` - Get all plants
- `GET /api/plants/:id` - Get specific plant
- `POST /api/plants` - Create new plant (seller/admin)
- `PUT /api/plants/:id` - Update plant (seller/admin)
- `DELETE /api/plants/:id` - Delete plant (seller/admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get specific order

### Payments
- `POST /api/payment/create-checkout-session` - Create Stripe checkout
- `POST /api/payment/webhook` - Stripe webhook endpoint

### Plant Care
- `POST /api/plant-care/identify` - AI plant identification
- `POST /api/plant-care/advice` - AI plant care advice

## 🎨 UI Components

### Frontend Pages
- **Home Page**: Featured plants and categories
- **Login/Register**: User authentication
- **Plant Shop**: Browse all available plants
- **Shopping Cart**: Cart management
- **Checkout**: Payment processing
- **My Orders**: Order history
- **Admin Dashboard**: Site administration
- **Seller Dashboard**: Product management
- **Plant Care Assistant**: AI-powered care guidance

### Design Features
- Dark/Light mode toggle
- Responsive layout for all devices
- Interactive plant cards with hover effects
- Smooth animations with Framer Motion
- Toast notifications for user feedback

## 🔐 Security Features

- JWT-based authentication
- Input validation and sanitization
- Password hashing with bcrypt
- CORS configuration for security
- Rate limiting protection
- Secure payment processing with Stripe
- Image upload validation

## 💳 Payment Integration

- Stripe checkout integration
- Secure payment processing
- Webhook handling for order confirmation
- Payment status tracking
- Refund management

## 🤖 AI Features

- **Plant Identification**: Upload images for AI recognition
- **Care Advice**: Personalized plant care recommendations
- **Growth Tracking**: AI-powered growth monitoring suggestions

## 📊 Database Schema

### Users Collection
- Basic user information
- Role-based access (user, seller, admin)
- Profile pictures and preferences

### Plants Collection
- Plant details and specifications
- Pricing and inventory management
- Seller information
- Images and care instructions

### Orders Collection
- Order details and status
- Payment information
- Shipping details
- Customer information

### Cart Collection
- Temporary cart items
- User-specific cart data

## 🚀 Production Features

- Optimized React build
- Express.js production server
- MongoDB connection pooling
- Environment-based configurations
- Error handling and logging
- Performance optimization

## 🛡️ Admin Capabilities

- User management and moderation
- Product approval and monitoring
- Order oversight and fulfillment
- Analytics and reporting
- Content management
- System configuration

## 📱 Mobile Responsiveness

- Fully responsive design
- Touch-friendly interface
- Optimized for all screen sizes
- Mobile-first approach
- Smooth performance on mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please contact the development team or create an issue in the GitHub repository.

---

<div align="center">

**🌱 Happy Plant Shopping! 🌱**

*A complete solution for plant enthusiasts and sellers*

</div>
