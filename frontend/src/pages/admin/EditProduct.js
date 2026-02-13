import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { productAPI } from '../../services/api';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    wood_type: '',
    length: '',
    width: '',
    height: '',
    featured: false,
    inStock: true,
    customizable: false
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await productAPI.getById(id);
      const product = response.data;
      setFormData({
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price,
        wood_type: product.wood_type,
        length: product.dimensions?.length || '',
        width: product.dimensions?.width || '',
        height: product.dimensions?.height || '',
        featured: product.featured,
        inStock: product.inStock,
        customizable: product.customizable
      });
    } catch (error) {
      alert('Error loading product');
      navigate('/admin/products');
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    images.forEach(image => {
      data.append('images', image);
    });

    try {
      await productAPI.update(id, data);
      alert('Product updated successfully');
      navigate('/admin/products');
    } catch (error) {
      alert('Error updating product: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Edit Product">
      <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
        <div className="form-group">
          <label className="form-label">Product Name *</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Furniture">Furniture</option>
              <option value="Decor">Decor</option>
              <option value="Custom">Custom</option>
              <option value="Doors">Doors</option>
              <option value="Tables">Tables</option>
              <option value="Chairs">Chairs</option>
              <option value="Cabinets">Cabinets</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Price (₹) *</label>
            <input
              type="number"
              name="price"
              className="form-control"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea
            name="description"
            className="form-control"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Wood Type *</label>
          <input
            type="text"
            name="wood_type"
            className="form-control"
            value={formData.wood_type}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Length</label>
            <input
              type="text"
              name="length"
              className="form-control"
              value={formData.length}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Width</label>
            <input
              type="text"
              name="width"
              className="form-control"
              value={formData.width}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Height</label>
            <input
              type="text"
              name="height"
              className="form-control"
              value={formData.height}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Update Images (Optional)</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
            accept="image/*"
            multiple
          />
          <small style={{ color: 'var(--text-light)' }}>
            Leave empty to keep existing images. Upload new images to replace all.
          </small>
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
            />
            <span>Featured Product</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
            />
            <span>In Stock</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="customizable"
              checked={formData.customizable}
              onChange={handleChange}
            />
            <span>Customizable</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Product'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate('/admin/products')}
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default EditProduct;
