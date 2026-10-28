// Product Card Component
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RatingStars from './RatingStars';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please log in to add items to your shopping bag.', 'warning');
      navigate('/login');
      return;
    }
    try {
      setAdding(true);
      await addToCart(product._id, 1, product);
      setSuccess(true);
      showToast(`Added ${product.name} to your shopping bag!`, 'success');
      setTimeout(() => setSuccess(false), 1500);
    } catch (err) {
      showToast(err.message || 'Failed to add item', 'danger');
    } finally {
      setAdding(false);
    }
  };

  const imageSrc =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="product-card shadow-sm h-100">
      <Link
        to={`/product/${product._id}`}
        className="product-img-wrapper text-decoration-none"
      >
        <img
          src={imageSrc}
          alt={product.name}
          className="product-img"
          loading="lazy"
        />
        {isOutOfStock && (
          <span className="position-absolute top-0 start-0 m-2 badge bg-danger">
            Out of Stock
          </span>
        )}
      </Link>

      <div className="p-3 d-flex flex-column flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="badge-category">{product.category}</span>
          <RatingStars
            rating={product.ratingAverage}
            count={product.ratingCount}
          />
        </div>

        <h6 className="card-title mt-2 mb-1 text-truncate-2" title={product.name}>
          <Link
            to={`/product/${product._id}`}
            className="text-decoration-none text-dark fw-bold"
          >
            {product.name}
          </Link>
        </h6>

        <div className="mt-auto pt-3 border-top">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span className="text-muted small d-block">Price</span>
              <span className="fs-5 fw-bold text-primary">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || adding}
              className={`btn btn-sm ${
                success ? 'btn-success' : 'btn-outline-primary'
              } px-3 d-flex align-items-center gap-1`}
            >
              {adding ? (
                <span className="spinner-border spinner-border-sm" role="status"></span>
              ) : success ? (
                <>
                  <i className="bi bi-check2"></i> Added
                </>
              ) : (
                <>
                  <i className="bi bi-cart-plus"></i> Add
                </>
              )}
            </button>
          </div>

          <div className="mt-2 pt-2 border-top border-light-subtle d-flex align-items-center justify-content-between">
            {product.deliveryCharge > 0 ? (
              <span className="badge bg-light text-secondary border small fw-normal d-inline-flex align-items-center gap-1">
                <i className="bi bi-truck text-muted"></i> Delivery: ₹{product.deliveryCharge}
              </span>
            ) : (
              <span className="badge bg-success-subtle text-success small fw-semibold d-inline-flex align-items-center gap-1">
                <i className="bi bi-truck"></i> FREE Delivery
              </span>
            )}
            <span className="text-muted" style={{ fontSize: '11px' }}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Unavailable'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
