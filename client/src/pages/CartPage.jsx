// Shopping Cart Page
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const {
    items,
    itemCount,
    subtotal,
    shippingFee,
    totalAmount,
    cartChanges,
    updateQuantity,
    removeFromCart,
    clearCart,
    loading,
  } = useCart();

  const navigate = useNavigate();

  if (loading && items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading shopping bag...</span>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="py-5 bg-white rounded-4 shadow-sm border p-4 max-w-md mx-auto" style={{ maxWidth: '480px' }}>
          <div className="rounded-circle bg-light d-inline-flex p-4 mb-3 text-primary">
            <i className="bi bi-cart-x fs-1"></i>
          </div>
          <h4 className="fw-bold mb-2">Your Shopping Bag is Empty</h4>
          <p className="text-muted small mb-4">
            Looks like you haven't added anything to your cart yet. Explore our latest electronics, fashion, and kitchen collections!
          </p>
          <Link to="/products" className="btn btn-primary px-4">
            Start Shopping Now <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-0">Shopping Cart</h2>
          <p className="text-muted small mb-0">{itemCount} item(s) currently in your bag</p>
        </div>
        <button
          onClick={clearCart}
          className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
        >
          <i className="bi bi-trash"></i> Clear Bag
        </button>
      </div>

      {/* Real-time Inventory & Price Re-validation Notices */}
      {cartChanges && cartChanges.length > 0 && (
        <div className="alert alert-warning border-0 rounded-4 shadow-sm mb-4">
          <div className="d-flex align-items-center gap-2 fw-semibold mb-1 text-dark">
            <i className="bi bi-exclamation-triangle-fill text-warning"></i> Bag Updated Based on Real-Time Inventory & Prices
          </div>
          <ul className="mb-0 small ps-3 text-muted">
            {cartChanges.map((change, idx) => (
              <li key={idx}>{change}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="row g-4">
        {/* Left Column: Cart Items List */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light text-muted small text-uppercase">
                  <tr>
                    <th style={{ width: '45%' }}>Product</th>
                    <th style={{ width: '20%' }}>Price</th>
                    <th style={{ width: '20%' }}>Quantity</th>
                    <th style={{ width: '15%' }} className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const prod = item.product;
                    if (!prod) return null;

                    const itemTotal = prod.price * item.quantity;
                    const img = prod.images?.[0] || 'https://via.placeholder.com/100';

                    return (
                      <tr key={prod._id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={img}
                              alt={prod.name}
                              className="rounded-3 border"
                              style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                            />
                            <div>
                              <Link
                                to={`/product/${prod._id}`}
                                className="fw-bold text-dark text-decoration-none small d-block mb-1 text-truncate"
                                style={{ maxWidth: '240px' }}
                              >
                                {prod.name}
                              </Link>
                              <span className="badge-category me-2">{prod.category}</span>
                              {prod.deliveryCharge > 0 ? (
                                <span className="badge bg-light text-secondary border small">
                                  <i className="bi bi-truck me-1"></i>Delivery: ₹{prod.deliveryCharge}
                                </span>
                              ) : (
                                <span className="badge bg-success-subtle text-success small">
                                  <i className="bi bi-truck me-1"></i>FREE Delivery
                                </span>
                              )}
                              <button
                                onClick={() => removeFromCart(prod._id)}
                                className="btn btn-link btn-sm text-danger text-decoration-none p-0 d-block mt-1 small"
                              >
                                <i className="bi bi-trash3 me-1"></i> Remove
                              </button>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="fw-semibold">₹{prod.price.toLocaleString('en-IN')}</span>
                        </td>

                        <td>
                          <div className="d-flex align-items-center border rounded-3 bg-white p-1" style={{ width: '110px' }}>
                            <button
                              className="btn btn-sm btn-link text-dark text-decoration-none px-1"
                              onClick={() => updateQuantity(prod._id, item.quantity - 1)}
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <span className="flex-grow-1 text-center small fw-bold">
                              {item.quantity}
                            </span>
                            <button
                              className="btn btn-sm btn-link text-dark text-decoration-none px-1"
                              onClick={() => updateQuantity(prod._id, item.quantity + 1)}
                              disabled={item.quantity >= prod.stock}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                        </td>

                        <td className="text-end">
                          <span className="fw-bold text-primary">
                            ₹{itemTotal.toLocaleString('en-IN')}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <Link to="/products" className="text-decoration-none fw-semibold small">
              <i className="bi bi-arrow-left me-1"></i> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right Column: Order Pricing Summary */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '80px' }}>
            <h5 className="fw-bold mb-3">Order Summary</h5>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Items Subtotal</span>
              <span className="fw-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Delivery Charges</span>
              <span>
                {shippingFee === 0 ? (
                  <span className="text-success fw-semibold">FREE</span>
                ) : (
                  `₹${shippingFee}`
                )}
              </span>
            </div>

            {shippingFee > 0 && items.some((i) => (i.product?.deliveryCharge || 0) > 0) ? (
              <div className="alert alert-light border py-2 small mb-3 text-secondary">
                <i className="bi bi-info-circle text-primary me-1"></i> Includes item-specific delivery charges for selected items in your bag.
              </div>
            ) : shippingFee > 0 ? (
              <div className="alert alert-info py-2 small mb-3">
                <i className="bi bi-info-circle me-1"></i> Add ₹{(500 - subtotal).toLocaleString('en-IN')} more to unlock <strong>FREE Delivery</strong>!
              </div>
            ) : null}

            <hr />

            <div className="d-flex justify-content-between align-items-baseline mb-4">
              <span className="fs-5 fw-bold">Grand Total</span>
              <span className="fs-4 fw-bold text-primary">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-lg w-100 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
            >
              Proceed to Checkout <i className="bi bi-arrow-right"></i>
            </button>

            <div className="mt-4 pt-3 border-top text-muted small text-center">
              <i className="bi bi-shield-lock-fill text-success me-1"></i> Guaranteed safe & encrypted checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
