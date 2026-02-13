import React, { useState } from 'react';
import { leadAPI } from '../../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
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
      await leadAPI.create(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      alert('Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">Contact Us</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          {/* Contact Form */}
          <div>
            <h2>Send Us a Message</h2>
            
            {success && (
              <div style={{
                background: '#28a745',
                color: 'white',
                padding: '1rem',
                borderRadius: '4px',
                marginBottom: '1rem'
              }}>
                Thank you for contacting us! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
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
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  name="message"
                  className="form-control"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2>Get in Touch</h2>
            <p>We'd love to hear from you. Reach out to us through any of the following channels:</p>

            <div style={{ 
              background: 'var(--secondary-dark)', 
              padding: '2rem', 
              borderRadius: '8px',
              marginTop: '2rem'
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3>📍 Address</h3>
                <p>123 Woodcraft Lane<br/>Mumbai, Maharashtra 400001<br/>India</p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3>📞 Phone</h3>
                <p>+91 98765 43210</p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3>✉️ Email</h3>
                <p>info@premiumwood.com</p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3>🕐 Business Hours</h3>
                <p>Monday - Saturday: 9:00 AM - 6:00 PM<br/>Sunday: Closed</p>
              </div>
            </div>

            <div style={{ 
              background: 'var(--wood-brown)', 
              padding: '2rem', 
              borderRadius: '8px',
              marginTop: '2rem',
              textAlign: 'center'
            }}>
              <h3>WhatsApp Us</h3>
              <p>Get instant assistance on WhatsApp</p>
              <button 
                className="btn btn-primary"
                onClick={() => window.open('https://wa.me/919876543210', '_blank')}
              >
                💬 Chat Now
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section style={{ marginTop: '4rem' }}>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ background: 'var(--secondary-dark)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <h3>Do you ship nationwide?</h3>
              <p>Yes, we ship to all major cities across India. Delivery time varies based on location.</p>
            </div>
            <div style={{ background: 'var(--secondary-dark)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <h3>Can I customize existing designs?</h3>
              <p>Absolutely! We can customize dimensions, wood type, finish, and other features to match your requirements.</p>
            </div>
            <div style={{ background: 'var(--secondary-dark)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <h3>What is the typical lead time?</h3>
              <p>Standard products ship within 7-10 days. Custom orders typically take 3-6 weeks depending on complexity.</p>
            </div>
            <div style={{ background: 'var(--secondary-dark)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <h3>Do you provide installation services?</h3>
              <p>Yes, we offer professional installation services in select cities. Please contact us for details.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
