import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Premium Wood Crafts</h3>
            <p>Handcrafted excellence in every piece. We bring traditional Indian craftsmanship to modern living spaces.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <Link to="/products">Products</Link>
            <Link to="/custom-order">Custom Order</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/reviews">Reviews</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-section">
            <h3>Contact Info</h3>
            <p>📍 Mumbai, India</p>
            <p>📞 +91 98765 43210</p>
            <p>✉️ info@premiumwood.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Premium Wood Crafts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
