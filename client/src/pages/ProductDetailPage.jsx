// Product Detail Page
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import RatingStars from '../components/RatingStars';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  // Review Form State
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      setProduct(res.data.product);
    } catch (err) {
      console.error('Failed to load product:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showToast('Please log in to add items to your shopping bag.', 'warning');
      navigate('/login');
      return;
    }
    try {
      setAddingToCart(true);
      await addToCart(product._id, quantity, product);
      setCartSuccess(true);
      showToast(`Added ${quantity} item(s) to your shopping bag!`, 'success');
      setTimeout(() => setCartSuccess(false), 2000);
    } catch (err) {
      showToast(err.message || 'Failed to add item', 'danger');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!commentInput.trim()) {
      setReviewError('Please provide a comment for your review');
      return;
    }

    try {
      setSubmittingReview(true);
      await api.post(`/reviews/${product._id}`, {
        rating: Number(ratingInput),
        comment: commentInput.trim(),
      });

      setReviewSuccess('Thank you! Your review has been published.');
      setCommentInput('');
      setRatingInput(5);
      // Reload product to update reviews list and recalculate average rating
      await fetchProduct();
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading product specifications...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h4>Product Not Found</h4>
        <p className="text-muted">The product you are looking for does not exist or was removed.</p>
        <Link to="/products" className="btn btn-primary mt-2">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const currentImg =
    product.images && product.images.length > 0
      ? product.images[selectedImage] || product.images[0]
      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="container py-4">
      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
          <li className="breadcrumb-item">
            <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="text-decoration-none">
              {product.category}
            </Link>
          </li>
          <li className="breadcrumb-item active text-truncate" style={{ maxWidth: '300px' }} aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="row g-5">
        {/* Left Column: Image Gallery */}
        <div className="col-lg-6">
          <div className="bg-white rounded-4 p-3 shadow-sm border text-center mb-3">
            <img
              src={currentImg}
              alt={product.name}
              className="img-fluid rounded-3"
              style={{ maxHeight: '420px', objectFit: 'contain' }}
            />
          </div>

          {/* Multiple Image Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="d-flex gap-2 justify-content-center">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`border rounded-3 p-1 cursor-pointer ${
                    selectedImage === idx ? 'border-primary border-2' : 'border-light'
                  }`}
                  style={{ width: '70px', height: '70px' }}
                >
                  <img
                    src={img}
                    alt="thumbnail"
                    className="w-100 h-100 object-fit-cover rounded-2"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Pricing & Purchase Call to Action */}
        <div className="col-lg-6">
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="badge-category">{product.category}</span>
            <span className={`badge ${isOutOfStock ? 'bg-danger' : 'bg-success'}`}>
              {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} available)`}
            </span>
          </div>

          <h2 className="fw-bold mb-2">{product.name}</h2>

          <div className="d-flex align-items-center gap-3 mb-3">
            <RatingStars
              rating={product.ratingAverage}
              count={product.ratingCount}
            />
            <span className="text-muted small">| Verified Customer Reviews</span>
          </div>

          <div className="p-3 bg-light rounded-3 my-3">
            <div className="d-flex align-items-baseline gap-2">
              <span className="display-6 fw-bold text-primary">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-muted small">Inclusive of all taxes</span>
            </div>

            <div className="mt-3 pt-2 border-top border-secondary-subtle d-flex align-items-center gap-2">
              <i className="bi bi-truck fs-5 text-primary"></i>
              <div>
                {product.deliveryCharge > 0 ? (
                  <>
                    <span className="fw-semibold text-dark">Delivery Charge: ₹{product.deliveryCharge}</span>
                    <span className="text-muted d-block small">Special item shipping & logistics handling</span>
                  </>
                ) : (
                  <>
                    <span className="fw-semibold text-success">FREE Delivery</span>
                    <span className="text-muted d-block small">Eligible for fast complimentary delivery across India</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <p className="text-secondary mb-4 leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
            {product.description}
          </p>

          {/* Quantity Controls & Add to Cart */}
          <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3 mb-4">
            <div className="d-flex align-items-center border rounded-3 bg-white p-1" style={{ width: '130px' }}>
              <button
                className="btn btn-sm btn-link text-dark text-decoration-none px-2"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || isOutOfStock}
              >
                <i className="bi bi-dash fs-5"></i>
              </button>
              <span className="flex-grow-1 text-center fw-bold">{quantity}</span>
              <button
                className="btn btn-sm btn-link text-dark text-decoration-none px-2"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock || isOutOfStock}
              >
                <i className="bi bi-plus fs-5"></i>
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || addingToCart}
              className={`btn btn-lg ${
                cartSuccess ? 'btn-success' : 'btn-primary'
              } flex-grow-1 d-flex align-items-center justify-content-center gap-2`}
            >
              {addingToCart ? (
                <span className="spinner-border spinner-border-sm" role="status"></span>
              ) : cartSuccess ? (
                <>
                  <i className="bi bi-check-circle-fill"></i> Added to Bag!
                </>
              ) : (
                <>
                  <i className="bi bi-cart-fill"></i> Add to Cart
                </>
              )}
            </button>
          </div>

          {/* Value Props Box */}
          <div className="border-top pt-3">
            <div className="row g-2 small text-muted">
              <div className="col-6">
                <i className="bi bi-truck text-primary me-2"></i> Fast Doorstep Dispatch
              </div>
              <div className="col-6">
                <i className="bi bi-arrow-counterclockwise text-primary me-2"></i> 7-Day Replacement
              </div>
              <div className="col-6">
                <i className="bi bi-shield-check text-primary me-2"></i> 100% Genuine Guarantee
              </div>
              <div className="col-6">
                <i className="bi bi-cash-coin text-primary me-2"></i> Pay Online or COD
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="mt-5 pt-4 border-top">
        <h4 className="fw-bold mb-4">Customer Reviews & Ratings</h4>

        <div className="row g-4">
          {/* Left: Reviews List */}
          <div className="col-lg-7">
            {(!product.reviews || product.reviews.length === 0) ? (
              <div className="p-4 bg-light rounded-3 text-center text-muted">
                <i className="bi bi-chat-square-text fs-2 d-block mb-2"></i>
                <p className="mb-0">No reviews yet for this product. Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {product.reviews.map((rev) => (
                  <div key={rev._id} className="card border-0 shadow-sm rounded-3 p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle bg-light text-primary fw-bold d-flex align-items-center justify-content-center"
                          style={{ width: '36px', height: '36px' }}
                        >
                          {rev.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold">{rev.user?.name || 'Verified Buyer'}</h6>
                          <small className="text-muted">
                            {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </small>
                        </div>
                      </div>
                      <RatingStars rating={rev.rating} showText={false} />
                    </div>
                    <p className="text-secondary mb-0 small">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Write Review Form */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-3 p-4">
              <h5 className="fw-bold mb-3">Leave a Review</h5>

              {!isAuthenticated ? (
                <div className="text-center py-3">
                  <p className="text-muted small mb-3">Please sign in to rate this product</p>
                  <Link to="/login" className="btn btn-outline-primary btn-sm">
                    Log In to Review
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit}>
                  {reviewError && (
                    <div className="alert alert-danger py-2 small" role="alert">
                      {reviewError}
                    </div>
                  )}
                  {reviewSuccess && (
                    <div className="alert alert-success py-2 small" role="alert">
                      {reviewSuccess}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Your Rating</label>
                    <select
                      className="form-select"
                      value={ratingInput}
                      onChange={(e) => setRatingInput(e.target.value)}
                    >
                      <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                      <option value="4">⭐⭐⭐⭐ 4 - Good</option>
                      <option value="3">⭐⭐⭐ 3 - Average</option>
                      <option value="2">⭐⭐ 2 - Poor</option>
                      <option value="1">⭐ 1 - Terrible</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Your Comment</label>
                    <textarea
                      rows="4"
                      className="form-control"
                      placeholder="Write your honest opinion about build quality, performance, or usability..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      maxLength={1000}
                    ></textarea>
                    <div className="form-text small text-end">Max 1000 characters</div>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="btn btn-primary w-100"
                  >
                    {submittingReview ? (
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                    ) : (
                      'Submit Review'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;
