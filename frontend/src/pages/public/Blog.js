import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../../services/api';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const response = await blogAPI.getAll({ published: true });
      setBlogs(response.data);
    } catch (error) {
      console.error('Error loading blogs:', error);
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

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">Our Blog</h1>
        
        {blogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>No blog posts yet</h3>
            <p>Check back soon for articles about woodworking, design tips, and more!</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {blogs.map(blog => (
              <div key={blog._id} className="card">
                <img 
                  src={blog.featured_image || '/placeholder.jpg'} 
                  alt={blog.title} 
                  className="card-img"
                />
                <div className="card-body">
                  <span className="badge badge-info">{blog.category}</span>
                  <h3 className="card-title">{blog.title}</h3>
                  <p className="card-text">{blog.excerpt}</p>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginTop: '1rem',
                    fontSize: '0.9rem',
                    color: 'var(--text-light)'
                  }}>
                    <span>By {blog.author}</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                  <Link 
                    to={`/blog/${blog.slug}`} 
                    className="btn btn-primary" 
                    style={{ width: '100%', marginTop: '1rem' }}
                  >
                    Read More
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

export default Blog;
