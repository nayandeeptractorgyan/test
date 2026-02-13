import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Furniture', 'Decor', 'Custom', 'Doors', 'Tables', 'Chairs', 'Cabinets', 'Others'];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, products]);

  const loadProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (selectedCategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Loading products...</h2>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">Our Products</h1>

        {/* Category Filter */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '3rem', 
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {categories.map(category => (
            <button
              key={category}
              className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>No products found in this category</h3>
          </div>
        ) : (
          <div className="grid grid-3">
            {filteredProducts.map(product => (
              <div key={product._id} className="card">
                <img 
                  src={product.images[0] || '/placeholder.jpg'} 
                  alt={product.name} 
                  className="card-img"
                />
                <div className="card-body">
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <span className="badge badge-info">{product.category}</span>
                    {product.featured && <span className="badge badge-warning">Featured</span>}
                  </div>
                  <h3 className="card-title">{product.name}</h3>
                  <p className="card-text">{product.description.substring(0, 100)}...</p>
                  <p style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                    Wood: {product.wood_type}
                  </p>
                  <p style={{ color: 'var(--gold)', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    ₹{product.price.toLocaleString()}
                  </p>
                  <Link to={`/products/${product._id}`} className="btn btn-primary" style={{ width: '100%' }}>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
