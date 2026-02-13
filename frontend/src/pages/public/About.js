import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">About Us</h1>

        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <section style={{ marginBottom: '3rem' }}>
            <h2>Our Story</h2>
            <p>
              Premium Wood Crafts was founded with a passion for preserving traditional Indian woodworking 
              techniques while creating contemporary pieces that fit modern lifestyles. For over two decades, 
              we have been crafting exceptional wooden furniture and decor that combines timeless elegance 
              with functional design.
            </p>
            <p>
              Each piece is handcrafted by skilled artisans who have inherited their craft through generations. 
              We source premium quality wood from sustainable suppliers and ensure that every product meets 
              our stringent quality standards.
            </p>
          </section>

          <section style={{ 
            background: 'var(--secondary-dark)', 
            padding: '2rem', 
            borderRadius: '8px',
            marginBottom: '3rem'
          }}>
            <h2>Our Values</h2>
            <div className="grid grid-2" style={{ marginTop: '2rem' }}>
              <div>
                <h3>🌱 Sustainability</h3>
                <p>We are committed to environmental responsibility and use only sustainably sourced wood.</p>
              </div>
              <div>
                <h3>✨ Quality</h3>
                <p>Every piece undergoes rigorous quality checks to ensure it meets our high standards.</p>
              </div>
              <div>
                <h3>🎨 Craftsmanship</h3>
                <p>Our artisans pour their skill and passion into every creation.</p>
              </div>
              <div>
                <h3>💯 Customer Satisfaction</h3>
                <p>Your happiness is our priority, from design to delivery and beyond.</p>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '3rem' }}>
            <h2>Why Choose Premium Wood Crafts?</h2>
            <ul style={{ lineHeight: '2', fontSize: '1.1rem' }}>
              <li>✓ 20+ years of expertise in woodworking</li>
              <li>✓ 100% handcrafted pieces</li>
              <li>✓ Premium quality wood from certified suppliers</li>
              <li>✓ Full customization available</li>
              <li>✓ Dedicated customer support</li>
              <li>✓ Nationwide delivery</li>
              <li>✓ After-sales service and maintenance guidance</li>
            </ul>
          </section>

          <section style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h2>Ready to Begin Your Journey?</h2>
            <p style={{ marginBottom: '2rem' }}>Let's create something beautiful together</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/products" className="btn btn-primary">Explore Products</Link>
              <Link to="/custom-order" className="btn btn-secondary">Custom Order</Link>
              <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
