// Navigation Bar Component
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm py-2">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4" to="/">
          <span className="bg-primary text-white rounded-3 px-2 py-1 fs-5">
            <i className="bi bi-bag-heart-fill"></i>
          </span>
          <span>Shop<span className="text-primary">Villa</span></span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#shopvillaNav"
          aria-controls="shopvillaNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Navbar Items */}
        <div className="collapse navbar-collapse" id="shopvillaNav">
          {/* Global Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="d-flex mx-lg-auto my-2 my-lg-0 w-100"
            style={{ maxWidth: '450px' }}
          >
            <div className="input-group">
              <input
                type="text"
                className="form-control border-end-0 bg-dark text-white border-secondary"
                placeholder="Search products, brands, electronics..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                style={{ borderRadius: '8px 0 0 8px' }}
              />
              <button
                className="btn btn-primary border-start-0 px-3"
                type="submit"
                style={{ borderRadius: '0 8px 8px 0' }}
              >
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>

          {/* Navigation Links & User Menu */}
          <ul className="navbar-nav ms-auto align-items-lg-center gap-2">
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/products' ? 'active text-primary fw-bold' : ''}`}
                to="/products"
              >
                <i className="bi bi-grid me-1"></i> Catalog
              </Link>
            </li>

            {/* Cart Icon with Live Badge */}
            <li className="nav-item">
              <Link
                className="nav-link position-relative d-inline-flex align-items-center px-2"
                to="/cart"
              >
                <i className="bi bi-cart3 fs-5"></i>
                <span className="d-lg-none ms-2">Shopping Bag</span>
                {itemCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {itemCount}
                  </span>
                )}
              </Link>
            </li>

            {/* Authenticated User Menu */}
            {isAuthenticated ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center gap-2 text-white"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: '32px', height: '32px', fontSize: '14px' }}
                  >
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="d-none d-lg-inline">{user?.name?.split(' ')[0]}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                  <li className="px-3 py-2 border-bottom">
                    <p className="mb-0 fw-bold small">{user?.name}</p>
                    <p className="mb-0 text-muted small text-truncate" style={{ maxWidth: '180px' }}>
                      {user?.email}
                    </p>
                    {isAdmin && (
                      <span className="badge bg-warning text-dark mt-1">Administrator</span>
                    )}
                  </li>

                  {/* Customer Links */}
                  <li>
                    <Link className="dropdown-item py-2" to="/profile">
                      <i className="bi bi-person me-2 text-primary"></i> My Profile & Addresses
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2" to="/orders">
                      <i className="bi bi-box-seam me-2 text-primary"></i> Order History
                    </Link>
                  </li>

                  {/* Admin Specific Links */}
                  {isAdmin && (
                    <>
                      <li><hr className="dropdown-divider" /></li>
                      <li className="dropdown-header text-uppercase small fw-bold">Admin Management</li>
                      <li>
                        <Link className="dropdown-item py-2" to="/admin/dashboard">
                          <i className="bi bi-speedometer2 me-2 text-warning"></i> Dashboard Analytics
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2" to="/admin/products">
                          <i className="bi bi-tags me-2 text-warning"></i> Manage Products
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2" to="/admin/orders">
                          <i className="bi bi-receipt me-2 text-warning"></i> Manage All Orders
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2" to="/admin/customers">
                          <i className="bi bi-people me-2 text-warning"></i> Manage Customers
                        </Link>
                      </li>
                    </>
                  )}

                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item py-2 text-danger d-flex align-items-center"
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
                <Link to="/login" className="btn btn-outline-light btn-sm px-3">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm px-3">
                  Sign Up
                </Link>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
