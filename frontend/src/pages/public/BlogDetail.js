import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogAPI } from '../../services/api';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlog();
  }, [slug]);

  const loadBlog = async () => {
    try {
      const response = await blogAPI.getBySlug(slug);
      setBlog(response.data);
    } catch (error) {
      console.error('Error loading blog:', error);
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

  if (!blog) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Blog post not found</h2>
        <Link to="/blog" className="btn btn-primary">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <Link to="/blog" style={{ display: 'inline-block', marginBottom: '2rem' }}>
          ← Back to Blog
        </Link>

        <article style={{ maxWidth: '800px', margin: '0 auto' }}>
          <img 
            src={blog.featured_image} 
            alt={blog.title}
            style={{ 
              width: '100%', 
              borderRadius: '8px',
              marginBottom: '2rem',
              boxShadow: '0 4px 15px var(--shadow)'
            }}
          />

          <div style={{ marginBottom: '2rem' }}>
            <span className="badge badge-info">{blog.category}</span>
            {blog.tags && blog.tags.map(tag => (
              <span key={tag} className="badge badge-warning" style={{ marginLeft: '0.5rem' }}>
                {tag}
              </span>
            ))}
          </div>

          <h1 style={{ marginBottom: '1rem' }}>{blog.title}</h1>

          <div style={{ 
            display: 'flex', 
            gap: '2rem',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--wood-brown)',
            color: 'var(--text-light)',
            fontSize: '0.9rem'
          }}>
            <span>By {blog.author}</span>
            <span>📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
            <span>👁️ {blog.views} views</span>
          </div>

          <div 
            style={{ 
              fontSize: '1.1rem',
              lineHeight: '1.8',
              whiteSpace: 'pre-wrap'
            }}
          >
            {blog.content}
          </div>

          <div style={{ 
            marginTop: '3rem',
            padding: '2rem',
            background: 'var(--secondary-dark)',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3>Interested in our products?</h3>
            <p>Explore our collection or request a custom piece</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
              <Link to="/products" className="btn btn-primary">View Products</Link>
              <Link to="/custom-order" className="btn btn-secondary">Custom Order</Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
