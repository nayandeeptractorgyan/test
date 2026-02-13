import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { blogAPI } from '../../services/api';

const AddBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    author: 'Admin',
    tags: '',
    published: true
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    
    // Auto-generate slug from title
    if (e.target.name === 'title') {
      const slug = e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'tags') {
        data.append(key, JSON.stringify(formData.tags.split(',').map(t => t.trim()).filter(t => t)));
      } else {
        data.append(key, formData[key]);
      }
    });
    if (image) {
      data.append('featured_image', image);
    }

    try {
      await blogAPI.create(data);
      alert('Blog post created successfully');
      navigate('/admin/blog');
    } catch (error) {
      alert('Error creating blog: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Add New Blog Post">
      <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Slug (URL-friendly) *</label>
          <input
            type="text"
            name="slug"
            className="form-control"
            value={formData.slug}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Category *</label>
            <input
              type="text"
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Woodworking Tips, Design Ideas"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Author</label>
            <input
              type="text"
              name="author"
              className="form-control"
              value={formData.author}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Excerpt (Brief Summary) *</label>
          <textarea
            name="excerpt"
            className="form-control"
            rows="3"
            value={formData.excerpt}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Content *</label>
          <textarea
            name="content"
            className="form-control"
            rows="10"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            className="form-control"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., wood, furniture, design"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Featured Image *</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
            accept="image/*"
            required
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
            />
            <span>Publish immediately</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Blog Post'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate('/admin/blog')}
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AddBlog;
