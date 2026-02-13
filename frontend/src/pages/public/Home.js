import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, reviewAPI } from '../../services/api';
import LeadModal from '../../components/public/LeadModal';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadFeaturedProducts();
    loadReviews();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const response = await productAPI.getAll({ featured: true });
      setFeaturedProducts(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await reviewAPI.getAll({ approved: true });
      setReviews(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Handcrafted Wooden Excellence</h1>
          <p>Traditional Indian craftsmanship meets modern design</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <Link to="/products" className="btn btn-primary">Explore Products</Link>
            <button className="btn btn-secondary" onClick={() => setModalOpen(true)}>
              Get a Quote
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <div className="grid grid-3">
            {featuredProducts.map(product => (
              <div key={product._id} className="card">
                <img 
                  src={product.images[0] || '/placeholder.jpg'} 
                  alt={product.name} 
                  className="card-img"
                />
                <div className="card-body">
                  <h3 className="card-title">{product.name}</h3>
                  <p className="card-text">{product.description.substring(0, 100)}...</p>
                  <p style={{ color: 'var(--gold)', fontSize: '1.3rem', fontWeight: 'bold' }}>
                    ₹{product.price.toLocaleString()}
                  </p>
                  <Link to={`/products/${product._id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/products" className="btn btn-secondary">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section" style={{ background: 'var(--secondary-dark)' }}>
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="grid grid-3">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌳</div>
              <h3>Premium Quality Wood</h3>
              <p>We use only the finest quality wood sourced sustainably from certified suppliers.</p>
            </div>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍🎨</div>
              <h3>Expert Craftsmanship</h3>
              <p>Our artisans have decades of experience in traditional Indian woodworking techniques.</p>
            </div>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
              <h3>Custom Solutions</h3>
              <p>Every piece can be customized to perfectly match your vision and space requirements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="grid grid-3">
            {reviews.map(review => (
              <div key={review._id} className="card">
                <div className="card-body">
                  <div style={{ color: 'var(--gold)', marginBottom: '1rem' }}>
                    {'⭐'.repeat(review.rating)}
                  </div>
                  <p className="card-text">"{review.review}"</p>
                  <p style={{ color: 'var(--gold)', fontWeight: 'bold' }}>- {review.customer_name}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/reviews" className="btn btn-secondary">Read More Reviews</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ background: 'var(--secondary-dark)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ marginBottom: '1rem' }}>Ready to Transform Your Space?</h2>
          <p style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>
            Let us create something beautiful for you
          </p>
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            Request a Custom Quote
          </button>
        </div>
      </section>

      <LeadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Home;
