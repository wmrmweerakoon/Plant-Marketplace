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
