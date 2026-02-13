import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          ✦ Premium Wood Crafts
        </Link>
        <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/custom-order">Custom Order</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/reviews">Reviews</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
        <button 
          className="navbar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--gold)',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          ☰
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
