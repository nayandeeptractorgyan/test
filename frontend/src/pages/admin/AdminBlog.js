import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { blogAPI } from '../../services/api';

const AdminBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const response = await blogAPI.getAll();
      setBlogs(response.data);
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await blogAPI.delete(id);
        loadBlogs();
        alert('Blog deleted successfully');
      } catch (error) {
        alert('Error deleting blog');
      }
    }
  };

  return (
    <AdminLayout title="Blog Management">
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/admin/add-blog" className="btn btn-primary">+ Add New Blog Post</Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Featured Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Views</th>
                <th>Published</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>No blog posts found</td>
                </tr>
              ) : (
                blogs.map(blog => (
                  <tr key={blog._id}>
                    <td>
                      <img 
                        src={blog.featured_image} 
                        alt={blog.title}
                        style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </td>
                    <td>{blog.title}</td>
                    <td><span className="badge badge-info">{blog.category}</span></td>
                    <td>{blog.author}</td>
                    <td>{blog.views}</td>
                    <td>
                      {blog.published ? (
                        <span className="badge badge-success">Published</span>
                      ) : (
                        <span className="badge badge-warning">Draft</span>
                      )}
                    </td>
                    <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/admin/edit-blog/${blog._id}`} className="btn btn-edit btn-small">
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(blog._id)}
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

export default AdminBlog;
