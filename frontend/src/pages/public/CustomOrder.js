import React, { useState } from 'react';
import { orderAPI } from '../../services/api';

const CustomOrder = () => {
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    product_type: '',
    wood_preference: '',
    dimensions: '',
    description: '',
    budget: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await orderAPI.create(formData);
      setSuccess(true);
      setFormData({
        customer_name: '',
        email: '',
        phone: '',
        product_type: '',
        wood_preference: '',
        dimensions: '',
        description: '',
        budget: ''
      });
      window.scrollTo(0, 0);
    } catch (error) {
      alert('Error submitting order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">Custom Order</h1>
        
        {success && (
          <div style={{
            background: '#28a745',
            color: 'white',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <h3>Order Submitted Successfully!</h3>
            <p>We'll contact you within 24 hours to discuss your requirements.</p>
          </div>
        )}

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ 
            background: 'var(--secondary-dark)', 
            padding: '2rem', 
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <h3>Bring Your Vision to Life</h3>
            <p>Tell us about your dream piece, and our artisans will craft it to perfection. Every detail is customizable to match your exact specifications.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="customer_name"
                className="form-control"
                value={formData.customer_name}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Email *</label>
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
                <label className="form-label">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Product Type *</label>
              <select
                name="product_type"
                className="form-control"
                value={formData.product_type}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="Furniture">Furniture</option>
                <option value="Door">Door</option>
                <option value="Table">Table</option>
                <option value="Chair">Chair</option>
                <option value="Cabinet">Cabinet</option>
                <option value="Decor">Decor</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Wood Preference *</label>
              <select
                name="wood_preference"
                className="form-control"
                value={formData.wood_preference}
                onChange={handleChange}
                required
              >
                <option value="">Select Wood</option>
                <option value="Teak">Teak</option>
                <option value="Sheesham">Sheesham</option>
                <option value="Oak">Oak</option>
                <option value="Mahogany">Mahogany</option>
                <option value="Walnut">Walnut</option>
                <option value="Rosewood">Rosewood</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Dimensions (L x W x H) *</label>
              <input
                type="text"
                name="dimensions"
                className="form-control"
                placeholder="e.g., 6ft x 3ft x 3ft"
                value={formData.dimensions}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Budget Range *</label>
              <select
                name="budget"
                className="form-control"
                value={formData.budget}
                onChange={handleChange}
                required
              >
                <option value="">Select Budget</option>
                <option value="Under ₹25,000">Under ₹25,000</option>
                <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                <option value="₹1,00,000 - ₹2,00,000">₹1,00,000 - ₹2,00,000</option>
                <option value="Above ₹2,00,000">Above ₹2,00,000</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description *</label>
              <textarea
                name="description"
                className="form-control"
                rows="5"
                placeholder="Describe your requirements, design preferences, any special features, etc."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Custom Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomOrder;
