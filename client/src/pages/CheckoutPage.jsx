// Checkout Page
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const CheckoutPage = () => {
  const { items, subtotal, shippingFee, totalAmount, clearCart } = useCart();
  const { user, addAddress } = useAuth();
  const navigate = useNavigate();

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('ONLINE');
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pendingOrderId, setPendingOrderId] = useState(null);
  const [pollingPayment, setPollingPayment] = useState(false);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    line1: '',
    line2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  const addresses = user?.addresses || [];
  const selectedAddress = addresses[selectedAddressIndex] || null;

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(newAddr.phone.trim())) {
      setErrorMessage('Please enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9.');
      return;
    }

    const pincodeRegex = /^[1-9][0-9]{5}$/;
    if (!pincodeRegex.test(newAddr.pincode.trim())) {
      setErrorMessage('Please enter a valid 6-digit Indian postal pincode.');
      return;
    }

    try {
      await addAddress(newAddr);
      setShowAddressForm(false);
      setSelectedAddressIndex(addresses.length);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // Poll payment-status endpoint with exponential backoff after popup dismiss
  const pollPaymentStatus = async (orderId, attempts = 5) => {
    setPollingPayment(true);
    setErrorMessage("We're confirming your payment — please don't pay again. Checking status...");

    const delays = [3000, 5000, 8000, 12000, 20000];
    for (let i = 0; i < attempts; i++) {
      await new Promise((r) => setTimeout(r, delays[i] || 20000));
      try {
        const res = await api.get(`/orders/${orderId}/payment-status`);
        if (res.data.paymentStatus === 'PAID') {
          navigate(`/order-success/${orderId}`, { state: { method: 'ONLINE', order: res.data.order } });
          return;
        }
        if (res.data.paymentStatus === 'FAILED' || res.data.orderStatus === 'CANCELLED') {
          break;
        }
      } catch (e) {
        console.warn('[Poll attempt error]:', e.message);
      }
    }

    setPollingPayment(false);
    setErrorMessage('Payment not confirmed yet. You can retry payment or check status on the order page.');
    setProcessing(false);
  };

  const handlePlaceOrder = async () => {
    setErrorMessage('');

    if (!selectedAddress) {
      setErrorMessage('Please select or add a delivery address to proceed.');
      return;
    }

    if (
      !selectedAddress.fullName ||
      !selectedAddress.phone ||
      !selectedAddress.line1 ||
      !selectedAddress.city ||
      !selectedAddress.state ||
      !selectedAddress.pincode
    ) {
      setErrorMessage('Selected shipping address is incomplete. Please ensure full name, 10-digit phone, address line 1, city, state, and 6-digit pincode are provided.');
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(selectedAddress.phone.trim())) {
      setErrorMessage('The delivery address phone number must be a valid 10-digit Indian mobile number.');
      return;
    }

    const pincodeRegex = /^[1-9][0-9]{5}$/;
    if (!pincodeRegex.test(selectedAddress.pincode.trim())) {
      setErrorMessage('The delivery address pincode must be a valid 6-digit Indian postal code.');
      return;
    }

    try {
      setProcessing(true);

      // Backend creates order (stock deducted, razorpayOrderId set) BEFORE opening checkout
      const res = await api.post('/orders/create', {
        shippingAddress: selectedAddress,
        paymentMethod,
      });

      const { order, razorpayOrder, razorpayKey } = res.data;

      if (paymentMethod === 'COD') {
        navigate(`/order-success/${order._id}`, {
          state: { order, method: 'COD' },
        });
        return;
      }

      if (paymentMethod === 'ONLINE') {
        if (window.Razorpay && razorpayOrder) {
          const options = {
            key: razorpayKey || 'rzp_test_placeholder',
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency || 'INR',
            name: 'ShopVilla Inc.',
            description: `Order #${order._id.substring(order._id.length - 8)}`,
            order_id: razorpayOrder.id,
            prefill: {
              name: user?.name,
              email: user?.email,
              contact: user?.phone || selectedAddress.phone,
            },
            theme: {
              color: '#ea580c',
            },
            handler: async function (response) {
              try {
                const verifyRes = await api.post('/orders/verify-payment', {
                  orderId: order._id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                });

                navigate(`/order-success/${order._id}`, {
                  state: { order: verifyRes.data.order, method: 'ONLINE' },
                });
              } catch (verifyErr) {
                setErrorMessage(`Verification Failed: ${verifyErr.message}`);
                setProcessing(false);
              }
            },
            modal: {
              ondismiss: function () {
                // User closed popup — poll silently in background (handles browser-close scenario)
                setPendingOrderId(order._id);
                pollPaymentStatus(order._id);
              },
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (response) {
            setErrorMessage(`Payment Failed: ${response.error.description}`);
            setProcessing(false);
          });
          rzp.open();
        } else {
          // Mock simulation fallback
          const simulateMock = window.confirm(
            'Razorpay SDK script is running in offline test simulation mode. Confirm simulated payment approval?'
          );
          if (simulateMock) {
            const verifyRes = await api.post('/orders/verify-payment', {
              orderId: order._id,
              razorpayOrderId: razorpayOrder.id,
              razorpayPaymentId: `pay_mock_${Date.now()}`,
              razorpaySignature: 'mock_valid_signature',
            });
            navigate(`/order-success/${order._id}`, {
              state: { order: verifyRes.data.order, method: 'ONLINE' },
            });
          } else {
            setProcessing(false);
          }
        }
      }
    } catch (err) {
      setErrorMessage(err.message);
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h4>No items to checkout</h4>
        <Link to="/products" className="btn btn-primary mt-3">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 pb-2 border-bottom">Checkout &amp; Order Placement</h2>

      {/* Payment polling banner shown after Razorpay modal is dismissed */}
      {pollingPayment && (
        <div className="alert alert-warning border-0 rounded-4 shadow-sm mb-4 d-flex align-items-center gap-3">
          <div className="spinner-border spinner-border-sm text-warning" role="status"></div>
          <div>
            <strong>We're confirming your payment — please don't pay again.</strong>
            <span className="d-block small text-muted">Checking with the payment gateway. This usually takes a few seconds.</span>
          </div>
          {pendingOrderId && (
            <Link to={'/orders/' + pendingOrderId} className="btn btn-sm btn-outline-warning ms-auto">
              View Order
            </Link>
          )}
        </div>
      )}

      {errorMessage && !pollingPayment && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {errorMessage}
          {pendingOrderId && (
            <Link to={'/orders/' + pendingOrderId} className="btn btn-sm btn-outline-danger ms-3">
              Check Order Status
            </Link>
          )}
        </div>
      )}

      <div className="row g-4">
        {/* Left Column: Address Selection & Payment Selection */}
        <div className="col-lg-8">
          {/* Section 1: Delivery Address */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <span className="badge bg-primary rounded-circle">1</span>
                Shipping Address
              </h5>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => setShowAddressForm(!showAddressForm)}
              >
                {showAddressForm ? 'Cancel' : '+ Add New Address'}
              </button>
            </div>

            {/* Address List */}
            {addresses.length === 0 && !showAddressForm ? (
              <div className="p-3 bg-light rounded-3 text-center">
                <p className="text-muted small mb-2">No saved address found.</p>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => setShowAddressForm(true)}
                >
                  Create Shipping Address
                </button>
              </div>
            ) : (
              <div className="row g-3">
                {addresses.map((addr, idx) => (
                  <div key={addr._id || idx} className="col-md-6">
                    <div
                      className={`card p-3 rounded-3 cursor-pointer h-100 ${
                        selectedAddressIndex === idx
                          ? 'border-primary bg-primary-light shadow-sm'
                          : 'border'
                      }`}
                      onClick={() => setSelectedAddressIndex(idx)}
                    >
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="addressRadio"
                          id={`addr-${idx}`}
                          checked={selectedAddressIndex === idx}
                          onChange={() => setSelectedAddressIndex(idx)}
                        />
                        <label className="form-check-label fw-bold d-block" htmlFor={`addr-${idx}`}>
                          {addr.fullName}
                          {addr.isDefault && (
                            <span className="badge bg-secondary ms-2 small">Default</span>
                          )}
                        </label>
                      </div>
                      <div className="small text-muted ps-4 mt-1">
                        <p className="mb-1">{addr.line1}, {addr.line2}</p>
                        <p className="mb-1">{addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="mb-0 fw-semibold text-dark">Phone: {addr.phone}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Inline Add Address Form */}
            {showAddressForm && (
              <form onSubmit={handleSaveAddress} className="mt-4 p-3 bg-light rounded-3 border">
                <h6 className="fw-bold mb-3">Add New Delivery Address</h6>
                <div className="row g-2">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Full Name *"
                      required
                      value={newAddr.fullName}
                      onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="tel"
                      className="form-control form-control-sm"
                      placeholder="10-digit Phone Number (e.g. 9876543210) *"
                      required
                      pattern="[6-9][0-9]{9}"
                      maxLength="10"
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value.replace(/\D/g, '') })}
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="House / Flat No., Building, Street Line 1 *"
                      required
                      value={newAddr.line1}
                      onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Area / Sector Line 2"
                      value={newAddr.line2}
                      onChange={(e) => setNewAddr({ ...newAddr, line2: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Landmark (Optional)"
                      value={newAddr.landmark}
                      onChange={(e) => setNewAddr({ ...newAddr, landmark: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="City *"
                      required
                      value={newAddr.city}
                      onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="State *"
                      required
                      value={newAddr.state}
                      onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="6-digit Pincode (e.g. 560038) *"
                      required
                      pattern="[1-9][0-9]{5}"
                      maxLength="6"
                      value={newAddr.pincode}
                      onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value.replace(/\D/g, '') })}
                    />
                  </div>
                  <div className="col-12 mt-2">
                    <button type="submit" className="btn btn-primary btn-sm px-3">
                      Save & Select Address
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Section 2: Payment Method */}
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <span className="badge bg-primary rounded-circle">2</span>
              Payment Method
            </h5>

            <div className="d-flex flex-column gap-3">
              {/* Razorpay Online */}
              <div
                className={`card p-3 rounded-3 cursor-pointer ${
                  paymentMethod === 'ONLINE' ? 'border-primary bg-primary-light shadow-sm' : 'border'
                }`}
                onClick={() => setPaymentMethod('ONLINE')}
              >
                <div className="form-check d-flex align-items-center">
                  <input
                    className="form-check-input me-3"
                    type="radio"
                    name="paymentMethodRadio"
                    id="onlinePay"
                    checked={paymentMethod === 'ONLINE'}
                    onChange={() => setPaymentMethod('ONLINE')}
                  />
                  <label className="form-check-label flex-grow-1" htmlFor="onlinePay">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong className="d-block">Razorpay Online Gateway (Recommended)</strong>
                        <span className="small text-muted">
                          Pay instantly via UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, or Netbanking.
                        </span>
                      </div>
                      <span className="badge bg-success p-2">Instant Confirmation</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Cash On Delivery */}
              <div
                className={`card p-3 rounded-3 cursor-pointer ${
                  paymentMethod === 'COD' ? 'border-primary bg-primary-light shadow-sm' : 'border'
                }`}
                onClick={() => setPaymentMethod('COD')}
              >
                <div className="form-check d-flex align-items-center">
                  <input
                    className="form-check-input me-3"
                    type="radio"
                    name="paymentMethodRadio"
                    id="codPay"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                  />
                  <label className="form-check-label flex-grow-1" htmlFor="codPay">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong className="d-block">Cash on Delivery (COD)</strong>
                        <span className="small text-muted">
                          Pay cash or scan QR code when your order arrives at your doorstep.
                        </span>
                      </div>
                      <span className="badge bg-secondary p-2">Pay on Arrival</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Review Summary */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '80px' }}>
            <h5 className="fw-bold mb-3">Order Review</h5>

            {/* Items mini list */}
            <div className="mb-3 max-h-48 overflow-auto">
              {items.map((item) => (
                <div key={item.product?._id} className="mb-2 pb-1 border-bottom border-light">
                  <div className="d-flex justify-content-between small">
                    <span className="text-truncate me-2" style={{ maxWidth: '200px' }}>
                      {item.quantity}x {item.product?.name}
                    </span>
                    <span className="fw-semibold">
                      ₹{((item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                  {item.product?.deliveryCharge > 0 && (
                    <div className="text-muted" style={{ fontSize: '11px' }}>
                      <i className="bi bi-truck me-1"></i>Delivery: ₹{item.product.deliveryCharge}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <hr />

            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-muted">Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-muted">Delivery</span>
              <span className={shippingFee === 0 ? 'text-success fw-bold' : ''}>
                {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
              </span>
            </div>

            <hr />

            <div className="d-flex justify-content-between align-items-baseline mb-4">
              <span className="fw-bold">Total Payable</span>
              <span className="fs-4 fw-bold text-primary">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={processing || !selectedAddress}
              className="btn btn-primary btn-lg w-100 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
            >
              {processing ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                  Processing...
                </>
              ) : (
                <>
                  <i className="bi bi-shield-check"></i>
                  {paymentMethod === 'ONLINE' ? 'Pay Now via Razorpay' : 'Confirm COD Order'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
