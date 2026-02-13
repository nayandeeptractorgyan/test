import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { orderAPI } from '../../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await orderAPI.updateStatus(id, { status });
      loadOrders();
      alert('Order status updated');
    } catch (error) {
      alert('Error updating status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await orderAPI.delete(id);
        loadOrders();
        alert('Order deleted');
      } catch (error) {
        alert('Error deleting order');
      }
    }
  };

  return (
    <AdminLayout title="Custom Orders">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Product Type</th>
                <th>Wood</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>No orders found</td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order._id}>
                    <td>{order.customer_name}</td>
                    <td>
                      {order.email}<br/>
                      {order.phone}
                    </td>
                    <td>{order.product_type}</td>
                    <td>{order.wood_preference}</td>
                    <td>{order.budget}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="form-control"
                        style={{ padding: '0.5rem' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="btn btn-edit btn-small"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleDelete(order._id)}
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal active" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <span className="modal-close" onClick={() => setSelectedOrder(null)}>&times;</span>
            <h2>Order Details</h2>
            <div style={{ marginTop: '1.5rem' }}>
              <p><strong>Customer:</strong> {selectedOrder.customer_name}</p>
              <p><strong>Email:</strong> {selectedOrder.email}</p>
              <p><strong>Phone:</strong> {selectedOrder.phone}</p>
              <p><strong>Product Type:</strong> {selectedOrder.product_type}</p>
              <p><strong>Wood Preference:</strong> {selectedOrder.wood_preference}</p>
              <p><strong>Dimensions:</strong> {selectedOrder.dimensions}</p>
              <p><strong>Budget:</strong> {selectedOrder.budget}</p>
              <p><strong>Description:</strong></p>
              <p style={{ background: 'var(--primary-dark)', padding: '1rem', borderRadius: '4px' }}>
                {selectedOrder.description}
              </p>
              <p><strong>Status:</strong> <span className={`badge badge-${
                selectedOrder.status === 'Pending' ? 'warning' :
                selectedOrder.status === 'In Progress' ? 'info' :
                selectedOrder.status === 'Completed' ? 'success' : 'danger'
              }`}>{selectedOrder.status}</span></p>
              <p><strong>Submitted:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
