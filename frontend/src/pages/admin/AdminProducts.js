import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { productAPI } from '../../services/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id);
        loadProducts();
        alert('Product deleted successfully');
      } catch (error) {
        alert('Error deleting product');
      }
    }
  };

  return (
    <AdminLayout title="Products Management">
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/admin/add-product" className="btn btn-primary">+ Add New Product</Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Wood Type</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>No products found</td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product._id}>
                    <td>
                      <img 
                        src={product.images[0] || '/placeholder.jpg'} 
                        alt={product.name}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </td>
                    <td>{product.name}</td>
                    <td><span className="badge badge-info">{product.category}</span></td>
                    <td>₹{product.price.toLocaleString()}</td>
                    <td>{product.wood_type}</td>
                    <td>
                      {product.inStock ? 
                        <span className="badge badge-success">In Stock</span> : 
                        <span className="badge badge-danger">Out of Stock</span>
                      }
                    </td>
                    <td>
                      {product.featured && <span className="badge badge-warning">Featured</span>}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/admin/edit-product/${product._id}`} className="btn btn-edit btn-small">
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="btn btn-delete btn-small"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
