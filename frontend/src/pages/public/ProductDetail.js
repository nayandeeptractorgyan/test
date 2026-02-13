import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productAPI } from '../../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await productAPI.getById(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Product not found</h2>
        <Link to="/products" className="btn btn-primary">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <Link to="/products" style={{ display: 'inline-block', marginBottom: '2rem' }}>
          ← Back to Products
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          {/* Image Gallery */}
          <div>
            <img 
              src={product.images[selectedImage] || '/placeholder.jpg'} 
              alt={product.name}
              style={{ 
                width: '100%', 
                borderRadius: '8px',
                marginBottom: '1rem',
                boxShadow: '0 4px 15px var(--shadow)'
              }}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  onClick={() => setSelectedImage(index)}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border: selectedImage === index ? '3px solid var(--gold)' : 'none',
                    opacity: selectedImage === index ? 1 : 0.6
                  }}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <span className="badge badge-info">{product.category}</span>
            {product.featured && <span className="badge badge-warning" style={{ marginLeft: '0.5rem' }}>Featured</span>}
            
            <h1 style={{ marginTop: '1rem' }}>{product.name}</h1>
            
            <p style={{ fontSize: '2rem', color: 'var(--gold)', fontWeight: 'bold', margin: '1rem 0' }}>
              ₹{product.price.toLocaleString()}
            </p>

            <div style={{ marginBottom: '2rem' }}>
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3>Specifications</h3>
              <p><strong>Wood Type:</strong> {product.wood_type}</p>
              {product.dimensions && (
                <p>
                  <strong>Dimensions:</strong> {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height}
                </p>
              )}
              <p><strong>Availability:</strong> {product.inStock ? '✅ In Stock' : '❌ Out of Stock'}</p>
              {product.customizable && <p>🎨 Customization Available</p>}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/custom-order" className="btn btn-primary">Order Custom</Link>
              <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
