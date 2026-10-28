// Order Success Page
import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { fetchCart } = useCart();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    // Refresh user cart context
    fetchCart();

    if (!order) {
      const getOrder = async () => {
        try {
          const res = await api.get(`/orders/${id}`);
          setOrder(res.data.order);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      getOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Fetching order confirmation...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mx-auto" style={{ maxWidth: '680px' }}>
        <div className="text-center mb-4">
          <div
            className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-3 shadow"
            style={{ width: '80px', height: '80px' }}
          >
            <i className="bi bi-check-lg display-4"></i>
          </div>
          <h2 className="fw-bold text-success mb-1">Order Confirmed!</h2>
          <p className="text-muted">
            Thank you for shopping with ShopVilla. A confirmation email has been dispatched to your registered address.
          </p>
          <div className="badge bg-light text-dark border p-2 fs-6">
            Order Reference: <strong>#{id}</strong>
          </div>
        </div>

        {order && (
          <div className="bg-light rounded-3 p-3 mb-4 small">
            <div className="row g-2 mb-2">
              <div className="col-sm-6">
                <span className="text-muted d-block">Payment Method:</span>
                <strong>{order.paymentMethod} ({order.paymentStatus})</strong>
              </div>
              <div className="col-sm-6">
                <span className="text-muted d-block">Order Status:</span>
                <span className="badge bg-primary">{order.orderStatus}</span>
              </div>
            </div>

            <div className="border-top pt-2 mt-2">
              <span className="text-muted d-block">Delivery Address:</span>
              <strong>{order.shippingAddress?.fullName}</strong> ({order.shippingAddress?.phone})<br />
              {order.shippingAddress?.line1}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
            </div>

            <div className="border-top pt-2 mt-2 d-flex justify-content-between align-items-center">
              <span className="text-muted">Total Paid:</span>
              <span className="fs-5 fw-bold text-primary">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
          <Link to={`/orders/${id}`} className="btn btn-primary px-4">
            <i className="bi bi-box-seam me-1"></i> Track Order Status
          </Link>
          <Link to="/products" className="btn btn-outline-secondary px-4">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
