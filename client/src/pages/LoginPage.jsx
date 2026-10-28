// User Login Page
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      // Check if unverified email
      if (err.message.includes('not verified') || err.message.includes('OTP')) {
        navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
      } else {
        setErrorMessage(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mx-auto" style={{ maxWidth: '440px' }}>
        <div className="text-center mb-4">
          <div className="rounded-circle bg-primary text-white d-inline-flex p-3 mb-2">
            <i className="bi bi-box-arrow-in-right fs-3"></i>
          </div>
          <h3 className="fw-bold mb-1">Welcome Back</h3>
          <p className="text-muted small">Log in to your ShopVilla customer account</p>
        </div>

        {errorMessage && (
          <div className="alert alert-danger py-2 small" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <div className="d-flex justify-content-between">
              <label className="form-label small fw-semibold">Password</label>
              <Link to="/forgot-password" className="small text-decoration-none text-primary">
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100 py-2 fw-semibold mt-2"
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status"></span>
            ) : (
              'Sign In to Account'
            )}
          </button>
        </form>

        <div className="mt-4 pt-3 border-top text-center small text-muted">
          Don't have an account yet?{' '}
          <Link to="/register" className="fw-bold text-primary text-decoration-none">
            Sign Up
          </Link>
        </div>

        {/* Demo Credentials Quick-Fill for Reviewers */}
        <div className="mt-4 p-3 bg-light rounded-3 small">
          <p className="fw-bold mb-1 text-secondary">Demo Interview Credentials:</p>
          <div className="d-flex justify-content-between mb-1">
            <span className="text-muted">Customer:</span>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 text-decoration-none"
              onClick={() => {
                setEmail('user@shopvilla.com');
                setPassword('User@123456');
              }}
            >
              user@shopvilla.com
            </button>
          </div>
          <div className="d-flex justify-content-between">
            <span className="text-muted">Admin:</span>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 text-decoration-none"
              onClick={() => {
                setEmail('admin@shopvilla.com');
                setPassword('Admin@123456');
              }}
            >
              admin@shopvilla.com
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
