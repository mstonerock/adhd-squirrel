import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import ThankYou from './pages/ThankYou';
import Manifesto from './pages/Manifesto';
import Bundles from './pages/Bundles';
import ShippingPolicy from './pages/ShippingPolicy';
import ReturnsPolicy from './pages/ReturnsPolicy';
import Contact from './pages/Contact';
import Cart from './components/Cart';
import { CartProvider } from './lib/CartContext';
import ScrollToTop from './components/ScrollToTop';
import ShopifyReturnHandler from './components/ShopifyReturnHandler';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <ShopifyReturnHandler />
        <div className="min-h-screen flex flex-col bg-surface text-white selection:bg-primary selection:text-black">
          <Navbar />
          <Cart />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/category/:category" element={<Home />} />
              <Route path="/bundles" element={<Bundles />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/manifesto" element={<Manifesto />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/returns" element={<ReturnsPolicy />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}
