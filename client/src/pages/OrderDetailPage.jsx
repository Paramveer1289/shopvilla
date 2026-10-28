// Order Detail and Visual Tracking Stepper Page
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const OrderDetailPage = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [retryingPayment, setRetryingPayment] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.order || res.data.data?.order);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCheckPaymentStatus = async () => {
    try {
      setCheckingStatus(true);
      const res = await api.get(`/orders/${id}/payment-status`);
      setOrder(res.data.order);
      if (res.data.paymentStatus === 'PAID') {
        showToast('Payment confirmed successfully!', 'success');
      } else if (res.data.paymentStatus === 'FAILED') {
        showToast('Payment failed. You can retry payment below.', 'danger');
      } else {
        showToast('Payment is still pending on gateway.', 'info');
      }
    } catch (err) {
      showToast(err.message || 'Status check failed', 'danger');
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleRetryPayment = async () => {
    try {
      setRetryingPayment(true);
      setErrorMsg('');
      const res = await api.post(`/orders/${id}/retry`);
      const { razorpayOrder, razorpayKey } = res.data;

      if (window.Razorpay && razorpayOrder) {
        const options = {
          key: razorpayKey || 'rzp_test_placeholder',
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency || 'INR',
          name: 'ShopVilla Inc.',
          description: `Retry Payment #${order._id.substring(order._id.length - 8)}`,
          order_id: razorpayOrder.id,
          theme: { color: '#ea580c' },
          handler: async function (response) {
            await api.post('/orders/verify-payment', {
              orderId: order._id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            await fetchOrder();
          },
          modal: {
            ondismiss: function () {
              setRetryingPayment(false);
              setErrorMsg("We're confirming your payment, please don't pay again. Click \"Check Payment Status\" to verify.");
            },
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        const simulateMock = window.confirm('Razorpay SDK in simulation mode. Confirm simulated payment approval?');
        if (simulateMock) {
          await api.post('/orders/verify-payment', {
            orderId: order._id,
            razorpayOrderId: razorpayOrder.id,
            razorpayPaymentId: `pay_mock_${Date.now()}`,
            razorpaySignature: 'mock_valid_signature',
          });
          await fetchOrder();
        }
      }
    } catch (err) {
      setErrorMsg(`Payment retry failed: ${err.message}`);
    } finally {
      setRetryingPayment(false);
    }
  };

  const handleCancelOrder = async () => {
    const reason = window.prompt('Please enter a cancellation reason:');
    if (!reason) return;

    try {
      setCancelling(true);
      await api.patch(`/orders/${id}/cancel`, { reason });
      await fetchOrder();
    } catch (err) {
      alert(`Cancellation failed: ${err.message}`);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading order details...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <h4>Order Not Found</h4>
        <p className="text-muted">{errorMsg || 'Unable to retrieve order details.'}</p>
        <Link to="/orders" className="btn btn-primary mt-2">
          Back to Orders
        </Link>
      </div>
    );
  }

  const canCancel = ['PENDING', 'CONFIRMED'].includes(order.orderStatus);

  // Stepper step calculations
  const steps = [
    { key: 'PENDING', label: 'Order Placed', icon: 'bi-cart-check' },
    { key: 'CONFIRMED', label: 'Confirmed', icon: 'bi-check-circle' },
    { key: 'SHIPPED', label: 'Shipped', icon: 'bi-truck' },
    { key: 'DELIVERED', label: 'Delivered', icon: 'bi-house-check' },
  ];

  const statusHierarchy = {
    PENDING: 0,
    CONFIRMED: 1,
    SHIPPED: 2,
    DELIVERED: 3,
  };

  const currentStepIndex = order.orderStatus === 'CANCELLED' ? -1 : (statusHierarchy[order.orderStatus] ?? 0);

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="badge bg-success px-3 py-2"><i className="bi bi-check-all me-1"></i> Delivered</span>;
      case 'SHIPPED':
        return <span className="badge bg-info text-dark px-3 py-2"><i className="bi bi-truck me-1"></i> Shipped</span>;
      case 'CONFIRMED':
        return <span className="badge bg-primary px-3 py-2"><i className="bi bi-bag-check me-1"></i> Confirmed</span>;
      case 'CANCELLED':
        return <span className="badge bg-danger px-3 py-2"><i className="bi bi-x-circle me-1"></i> Cancelled</span>;
      default:
        return <span className="badge bg-warning text-dark px-3 py-2"><i className="bi bi-clock-history me-1"></i> Pending Payment</span>;
    }
  };

  return (
    <div className="container py-4">
      {/* Navigation & Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-2 border-bottom">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb small mb-1">
              <li className="breadcrumb-item"><Link to="/orders" className="text-decoration-none">Orders</Link></li>
              <li className="breadcrumb-item active" aria-current="page">#{order._id}</li>
            </ol>
          </nav>
          <div className="d-flex align-items-center gap-2">
            <h3 className="fw-bold mb-0">Order #{order._id}</h3>
            {getOrderStatusBadge(order.orderStatus)}
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
          {/* Payment pending actions */}
          {order.paymentMethod === 'ONLINE' && order.paymentStatus === 'PENDING' && order.orderStatus !== 'CANCELLED' && (
            <>
              <button
                onClick={handleCheckPaymentStatus}
                disabled={checkingStatus}
                className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
              >
                <i className={`bi ${checkingStatus ? 'bi-hourglass-split' : 'bi-wifi'}`}></i>
                {checkingStatus ? 'Checking...' : 'Check Payment Status'}
              </button>
              <button
                onClick={handleRetryPayment}
                disabled={retryingPayment}
                className="btn btn-primary btn-sm d-flex align-items-center gap-1 shadow-sm"
              >
                <i className="bi bi-arrow-repeat"></i>
                {retryingPayment ? 'Starting Gateway...' : 'Retry Payment'}
              </button>
            </>
          )}

          {/* Payment failed - retry only */}
          {order.paymentMethod === 'ONLINE' && order.paymentStatus === 'FAILED' && order.orderStatus !== 'CANCELLED' && (
            <button
              onClick={handleRetryPayment}
              disabled={retryingPayment}
              className="btn btn-primary btn-sm d-flex align-items-center gap-1 shadow-sm"
            >
              <i className="bi bi-arrow-repeat"></i>
              {retryingPayment ? 'Starting Gateway...' : 'Retry Payment'}
            </button>
          )}

          {canCancel && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="btn btn-outline-danger btn-sm"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>

      {/* Visual Tracking Stepper Card */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <h5 className="fw-bold mb-4">Order Tracking Pipeline</h5>

        {/* Payment pending / failed banner with "we're confirming" message */}
        {order.paymentMethod === 'ONLINE' && order.paymentStatus === 'PENDING' && order.orderStatus !== 'CANCELLED' && (
          <div className="alert alert-warning border-0 rounded-3 mb-3 d-flex align-items-start gap-3">
            <i className="bi bi-wifi fs-4 text-warning mt-1"></i>
            <div>
              <strong className="d-block">We're confirming your payment — please don't pay again.</strong>
              <span className="small text-muted">If you already completed payment, click "Check Payment Status" to update your order instantly.</span>
            </div>
          </div>
        )}

        {order.paymentMethod === 'ONLINE' && order.paymentStatus === 'FAILED' && order.orderStatus !== 'CANCELLED' && (
          <div className="alert alert-danger border-0 rounded-3 mb-3 d-flex align-items-start gap-3">
            <i className="bi bi-exclamation-triangle-fill fs-4 text-danger mt-1"></i>
            <div>
              <strong className="d-block">Payment failed — retry to complete your order.</strong>
              <span className="small text-muted">Your cart items are reserved. Click "Retry Payment" to pay again.</span>
            </div>
          </div>
        )}

        {/* Error / status message inline */}
        {errorMsg && (
          <div className="alert alert-secondary border-0 rounded-3 small mb-3 py-2">
            <i className="bi bi-info-circle me-2"></i>{errorMsg}
          </div>
        )}

        {order.orderStatus === 'CANCELLED' ? (
          <div className="alert alert-danger py-3 mb-0 rounded-3">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-x-octagon-fill fs-4"></i>
              <div>
                <strong className="d-block">This order was cancelled.</strong>
                <span className="small">
                  {order.paymentStatus === 'REFUND_INITIATED'
                    ? 'Payment refund has been initiated to your original payment method.'
                    : 'No further fulfillment steps will be processed.'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="position-relative py-2">
            <div className="row g-2 text-center">
              {steps.map((st, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={st.key} className="col-3">
                    <div className="d-flex flex-column align-items-center">
                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center shadow-sm mb-2 ${
                          isCompleted
                            ? 'bg-primary text-white'
                            : 'bg-light text-muted border'
                        }`}
                        style={{
                          width: '48px',
                          height: '48px',
                          fontSize: '20px',
                          borderWidth: isCurrent ? '3px' : '1px',
                          borderColor: isCurrent ? 'var(--primary-color)' : undefined,
                        }}
                      >
                        <i className={`bi ${isCompleted && !isCurrent ? 'bi-check-lg' : st.icon}`}></i>
                      </div>
                      <span className={`small fw-bold ${isCompleted ? 'text-primary' : 'text-muted'}`}>
                        {st.label}
                      </span>
                      {isCurrent && (
                        <span className="badge bg-primary-light text-primary mt-1 small">Current</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="row g-4">
        {/* Left Column: Timeline & Items */}
        <div className="col-lg-8">
          {/* Detailed Status History Audit Log */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-3">Status History & Updates</h5>
            <div className="timeline ps-3 border-start border-2 border-primary ms-2">
              {order.statusHistory && order.statusHistory.length > 0 ? (
                order.statusHistory.map((step, idx) => (
                  <div key={idx} className="position-relative mb-3 ps-3">
                    <span
                      className="position-absolute translate-middle rounded-circle bg-primary"
                      style={{ width: '12px', height: '12px', left: '-1px', top: '8px' }}
                    ></span>
                    <h6 className="fw-bold mb-0">{step.status}</h6>
                    <small className="text-muted d-block">
                      {new Date(step.timestamp).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </small>
                    {step.note && <p className="small text-secondary mb-0 mt-1">{step.note}</p>}
                  </div>
                ))
              ) : (
                <p className="text-muted small">No status history available.</p>
              )}
            </div>
          </div>

          {/* Purchased Items Table */}
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-3">Items in this Order</h5>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-light small text-muted">
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th className="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="rounded-2 border"
                              style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                            />
                          )}
                          <span className="fw-semibold small">{item.name}</span>
                        </div>
                      </td>
                      <td className="small">₹{item.price.toLocaleString('en-IN')}</td>
                      <td className="small">{item.quantity}</td>
                      <td className="text-end fw-bold small text-primary">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Address & Payment Details */}
        <div className="col-lg-4">
          {/* Shipping Address Snapshot */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h6 className="fw-bold mb-3">Delivery Address</h6>
            <div className="small text-secondary">
              <strong className="text-dark d-block mb-1">{order.shippingAddress?.fullName}</strong>
              <p className="mb-1">{order.shippingAddress?.line1}</p>
              {order.shippingAddress?.line2 && <p className="mb-1">{order.shippingAddress?.line2}</p>}
              {order.shippingAddress?.landmark && <p className="mb-1 text-muted">Landmark: {order.shippingAddress?.landmark}</p>}
              <p className="mb-1">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </p>
              <p className="mb-0 fw-semibold text-dark">Phone: {order.shippingAddress?.phone}</p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h6 className="fw-bold mb-3">Payment Summary</h6>
            <div className="d-flex justify-content-between mb-2 small text-muted">
              <span>Items Subtotal</span>
              <span className="text-dark fw-semibold">₹{order.itemsTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="d-flex justify-content-between mb-2 small text-muted">
              <span>Shipping Fee</span>
              <span className="text-dark fw-semibold">
                {order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}
              </span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-3">
              <span className="fw-bold">Total Amount</span>
              <span className="fs-4 fw-bold text-primary">₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="bg-light rounded-3 p-3 small">
              <div className="mb-1">
                <span className="text-muted">Payment Method:</span>{' '}
                <strong>{order.paymentMethod}</strong>
              </div>
              <div className="mb-1">
                <span className="text-muted">Payment Status:</span>{' '}
                <span className={`badge ${order.paymentStatus === 'PAID' ? 'bg-success' : order.paymentStatus === 'REFUND_INITIATED' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                  {order.paymentStatus}
                </span>
              </div>
              {order.razorpayPaymentId && (
                <div className="text-truncate">
                  <span className="text-muted">Payment ID:</span>{' '}
                  <span className="font-monospace">{order.razorpayPaymentId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
