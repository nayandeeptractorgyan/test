import React, { useState, useEffect } from 'react';
import { reviewAPI, productAPI } from '../../services/api';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    rating: 5,
    review: '',
    product: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadReviews();
    loadProducts();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await reviewAPI.getAll({ approved: true });
      setReviews(response.data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await reviewAPI.create(formData);
      setSuccess(true);
      setFormData({
        customer_name: '',
        email: '',
        rating: 5,
        review: '',
        product: ''
      });
      setTimeout(() => {
        setSuccess(false);
        setShowForm(false);
      }, 3000);
    } catch (error) {
      alert('Error submitting review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">Customer Reviews</h1>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Hide Form' : 'Write a Review'}
          </button>
        </div>

        {showForm && (
          <div style={{ 
            maxWidth: '600px', 
            margin: '0 auto 3rem', 
            background: 'var(--secondary-dark)',
            padding: '2rem',
            borderRadius: '8px'
          }}>
            {success && (
              <div style={{
                background: '#28a745',
                color: 'white',
                padding: '1rem',
                borderRadius: '4px',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                Thank you! Your review will be published after approval.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="customer_name"
                  className="form-control"
                  value={formData.customer_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Product (Optional)</label>
                <select
                  name="product"
                  className="form-control"
                  value={formData.product}
                  onChange={handleChange}
                >
                  <option value="">General Review</option>
                  {products.map(product => (
                    <option key={product._id} value={product._id}>{product.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Rating</label>
                <select
                  name="rating"
                  className="form-control"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                >
                  <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                  <option value="4">⭐⭐⭐⭐ Very Good</option>
                  <option value="3">⭐⭐⭐ Good</option>
                  <option value="2">⭐⭐ Fair</option>
                  <option value="1">⭐ Poor</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Your Review</label>
                <textarea
                  name="review"
                  className="form-control"
                  rows="4"
                  value={formData.review}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {/* Reviews Display */}
        <div className="grid grid-3">
          {reviews.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
              <h3>No reviews yet</h3>
              <p>Be the first to share your experience!</p>
            </div>
          ) : (
            reviews.map(review => (
              <div key={review._id} className="card">
                <div className="card-body">
                  <div style={{ color: 'var(--gold)', marginBottom: '1rem', fontSize: '1.2rem' }}>
                    {'⭐'.repeat(review.rating)}
                  </div>
                  <p className="card-text">"{review.review}"</p>
                  <p style={{ color: 'var(--gold)', fontWeight: 'bold', marginTop: '1rem' }}>
                    - {review.customer_name}
                  </p>
                  {review.product && (
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                      Product: {review.product.name}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
