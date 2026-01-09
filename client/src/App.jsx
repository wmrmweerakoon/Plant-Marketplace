import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/Footer';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BuyPlants from './pages/BuyPlants';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';

function App() {
  return (
    <div className="min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/buy-plants" element={<BuyPlants />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-orders" element={<MyOrders />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
