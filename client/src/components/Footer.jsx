// Footer Component
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-4 mt-auto border-top border-secondary">
      <div className="container">
        <div className="row g-4">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="bg-primary text-white rounded-3 px-2 py-1 fs-5">
                <i className="bi bi-bag-heart-fill"></i>
              </span>
              <span className="fs-4 fw-bold">Shop<span className="text-primary">Villa</span></span>
            </div>
            <p className="text-muted small">
              ShopVilla is a next-generation MERN e-commerce application crafted for seamless digital shopping experiences. Features verified payments, fast order fulfillment, and premium curated electronics, fashion, and home goods.
            </p>
            <div className="d-flex gap-3 text-muted">
              <a href="#" className="text-muted fs-5"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-muted fs-5"><i className="bi bi-twitter-x"></i></a>
              <a href="#" className="text-muted fs-5"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-muted fs-5"><i className="bi bi-github"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-white fw-bold mb-3">Shop Categories</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/products?category=Electronics" className="text-muted text-decoration-none">Electronics</Link></li>
              <li className="mb-2"><Link to="/products?category=Fashion" className="text-muted text-decoration-none">Fashion & Apparel</Link></li>
              <li className="mb-2"><Link to="/products?category=Home & Kitchen" className="text-muted text-decoration-none">Home & Kitchen</Link></li>
              <li className="mb-2"><Link to="/products?category=Sports & Fitness" className="text-muted text-decoration-none">Sports & Fitness</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-white fw-bold mb-3">Customer Service</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/orders" className="text-muted text-decoration-none">Track Orders</Link></li>
              <li className="mb-2"><Link to="/cart" className="text-muted text-decoration-none">Shopping Cart</Link></li>
              <li className="mb-2"><Link to="/profile" className="text-muted text-muted text-decoration-none">Delivery Addresses</Link></li>
              <li className="mb-2"><span className="text-muted">Return Policy (7 Days)</span></li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div className="col-lg-4 col-md-6">
            <h6 className="text-white fw-bold mb-3">Secure Payments & Trust</h6>
            <p className="text-muted small">
              We process online transactions securely through Razorpay with 256-bit encryption. Cash on Delivery (COD) also supported across all pin codes.
            </p>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span className="badge bg-secondary p-2"><i className="bi bi-shield-check me-1"></i> 256-bit SSL</span>
              <span className="badge bg-secondary p-2"><i className="bi bi-credit-card me-1"></i> Razorpay Verified</span>
              <span className="badge bg-secondary p-2"><i className="bi bi-truck me-1"></i> Fast Delivery</span>
            </div>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-muted">
          <p className="mb-0">&copy; {new Date().getFullYear()} ShopVilla E-Commerce Platform. Built for Capstone / Job Portfolio Demonstration.</p>
          <div className="d-flex gap-3 mt-2 mt-md-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
