import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';

// Public Components
import Navbar from './components/public/Navbar';
import Footer from './components/public/Footer';
import WhatsAppButton from './components/public/WhatsAppButton';

// Public Pages
import Home from './pages/public/Home';
import Products from './pages/public/Products';
import ProductDetail from './pages/public/ProductDetail';
import CustomOrder from './pages/public/CustomOrder';
import Reviews from './pages/public/Reviews';
import Blog from './pages/public/Blog';
import BlogDetail from './pages/public/BlogDetail';
import About from './pages/public/About';
import Contact from './pages/public/Contact';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import AdminOrders from './pages/admin/AdminOrders';
import AdminLeads from './pages/admin/AdminLeads';
import AdminReviews from './pages/admin/AdminReviews';
import AdminBlog from './pages/admin/AdminBlog';
import AddBlog from './pages/admin/AddBlog';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Navbar />
              <Home />
              <Footer />
              <WhatsAppButton />
            </>
          } />
          <Route path="/products" element={
            <>
              <Navbar />
              <Products />
              <Footer />
              <WhatsAppButton />
            </>
          } />
          <Route path="/products/:id" element={
            <>
              <Navbar />
              <ProductDetail />
              <Footer />
              <WhatsAppButton />
            </>
          } />
          <Route path="/custom-order" element={
            <>
              <Navbar />
              <CustomOrder />
              <Footer />
              <WhatsAppButton />
            </>
          } />
          <Route path="/reviews" element={
            <>
              <Navbar />
              <Reviews />
              <Footer />
              <WhatsAppButton />
            </>
          } />
          <Route path="/blog" element={
            <>
              <Navbar />
              <Blog />
              <Footer />
              <WhatsAppButton />
            </>
          } />
          <Route path="/blog/:slug" element={
            <>
              <Navbar />
              <BlogDetail />
              <Footer />
              <WhatsAppButton />
            </>
          } />
          <Route path="/about" element={
            <>
              <Navbar />
              <About />
              <Footer />
              <WhatsAppButton />
            </>
          } />
          <Route path="/contact" element={
            <>
              <Navbar />
              <Contact />
              <Footer />
              <WhatsAppButton />
            </>
          } />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/products" element={<PrivateRoute><AdminProducts /></PrivateRoute>} />
          <Route path="/admin/add-product" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
          <Route path="/admin/edit-product/:id" element={<PrivateRoute><EditProduct /></PrivateRoute>} />
          <Route path="/admin/orders" element={<PrivateRoute><AdminOrders /></PrivateRoute>} />
          <Route path="/admin/leads" element={<PrivateRoute><AdminLeads /></PrivateRoute>} />
          <Route path="/admin/reviews" element={<PrivateRoute><AdminReviews /></PrivateRoute>} />
          <Route path="/admin/blog" element={<PrivateRoute><AdminBlog /></PrivateRoute>} />
          <Route path="/admin/add-blog" element={<PrivateRoute><AddBlog /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
