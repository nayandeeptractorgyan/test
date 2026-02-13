import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { reviewAPI } from '../../services/api';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await reviewAPI.getAll();
      setReviews(response.data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id, approved) => {
    try {
      await reviewAPI.updateStatus(id, { approved });
      loadReviews();
      alert(`Review ${approved ? 'approved' : 'disapproved'}`);
    } catch (error) {
      alert('Error updating review');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewAPI.delete(id);
        loadReviews();
        alert('Review deleted');
      } catch (error) {
        alert('Error deleting review');
      }
    }
  };

  return (
    <AdminLayout title="Reviews Management">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Product</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>No reviews found</td>
                </tr>
              ) : (
                reviews.map(review => (
                  <tr key={review._id}>
                    <td>{review.customer_name}</td>
                    <td>{review.email}</td>
                    <td style={{ color: 'var(--gold)' }}>
                      {'⭐'.repeat(review.rating)}
                    </td>
                    <td>{review.review.substring(0, 50)}...</td>
                    <td>{review.product?.name || 'General'}</td>
                    <td>
                      {review.approved ? (
                        <span className="badge badge-success">Approved</span>
                      ) : (
                        <span className="badge badge-warning">Pending</span>
                      )}
                    </td>
                    <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        {!review.approved && (
                          <button 
                            onClick={() => handleApproval(review._id, true)}
                            className="btn btn-edit btn-small"
                          >
                            Approve
                          </button>
                        )}
                        {review.approved && (
                          <button 
                            onClick={() => handleApproval(review._id, false)}
                            className="btn btn-small"
                            style={{ background: '#ffc107', color: 'var(--primary-dark)' }}
                          >
                            Unapprove
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(review._id)}
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

export default AdminReviews;
