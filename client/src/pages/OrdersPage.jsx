// Order History Page
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        setOrders(res.data.orders);
      } catch (err) {
        console.error('Failed to load orders:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (orderStatus, paymentStatus, paymentMethod) => {
    if (orderStatus === 'DELIVERED')
      return <span className="badge bg-success"><i className="bi bi-check-all me-1"></i>Delivered</span>;
    if (orderStatus === 'SHIPPED')
      return <span className="badge bg-info text-dark"><i className="bi bi-truck me-1"></i>Shipped</span>;
    if (orderStatus === 'CONFIRMED')
      return <span className="badge bg-primary"><i className="bi bi-bag-check me-1"></i>Confirmed</span>;
    if (orderStatus === 'CANCELLED')
      return <span className="badge bg-danger"><i className="bi bi-x-circle me-1"></i>Cancelled</span>;
    // PENDING order
    if (paymentMethod === 'ONLINE') {
      if (paymentStatus === 'PAID')
        return <span className="badge bg-primary"><i className="bi bi-bag-check me-1"></i>Payment Confirmed</span>;
      if (paymentStatus === 'FAILED')
        return <span className="badge bg-danger"><i className="bi bi-exclamation-triangle me-1"></i>Payment Failed — Retry</span>;
      return <span className="badge bg-warning text-dark"><i className="bi bi-clock-history me-1"></i>Payment Pending</span>;
    }
    return <span className="badge bg-warning text-dark"><i className="bi bi-clock-history me-1"></i>Pending</span>;
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading your order history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="mb-4 pb-2 border-bottom">
        <h2 className="fw-bold mb-1">My Orders</h2>
        <p className="text-muted small mb-0">Track and review your past purchases</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm border p-4 max-w-md mx-auto" style={{ maxWidth: '480px' }}>
          <i className="bi bi-box-seam fs-1 text-muted d-block mb-3"></i>
          <h4 className="fw-bold">No Orders Placed Yet</h4>
          <p className="text-muted small mb-4">
            You haven't made any purchases with ShopVilla yet. Check out our catalog for trending products!
          </p>
          <Link to="/products" className="btn btn-primary px-4">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {orders.map((order) => (
            <div key={order._id} className="card border-0 shadow-sm rounded-4 p-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 pb-3 mb-3 border-bottom small">
                <div>
                  <span className="text-muted d-block">Order Placed</span>
                  <strong>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </strong>
                </div>

                <div>
                  <span className="text-muted d-block">Order Reference</span>
                  <span className="font-monospace">#{order._id}</span>
                </div>

                <div>
                  <span className="text-muted d-block">Total Paid</span>
                  <span className="fw-bold text-primary">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                </div>

                <div>
                  <span className="text-muted d-block">Fulfillment Status</span>
                  {getStatusBadge(order.orderStatus, order.paymentStatus, order.paymentMethod)}
                </div>
              </div>

              {/* Items row */}
              <div className="row align-items-center g-3">
                <div className="col-md-9">
                  <div className="d-flex flex-wrap gap-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="d-flex align-items-center gap-2 border rounded-3 p-2 bg-light"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="rounded-2"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                        )}
                        <div className="small">
                          <p className="mb-0 fw-semibold text-truncate" style={{ maxWidth: '200px' }}>
                            {item.name}
                          </p>
                          <span className="text-muted">Qty: {item.quantity} &times; ₹{item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-md-3 text-md-end">
                  {order.paymentMethod === 'ONLINE' && order.paymentStatus !== 'PAID' && order.orderStatus !== 'CANCELLED' && (
                    <Link
                      to={`/orders/${order._id}`}
                      className="btn btn-primary btn-sm px-3 mb-2 d-inline-flex align-items-center gap-1"
                    >
                      <i className="bi bi-arrow-repeat"></i> Retry Payment
                    </Link>
                  )}
                  <Link
                    to={`/orders/${order._id}`}
                    className="btn btn-outline-primary btn-sm px-3 d-inline-flex align-items-center"
                  >
                    View Details <i className="bi bi-chevron-right ms-1"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
