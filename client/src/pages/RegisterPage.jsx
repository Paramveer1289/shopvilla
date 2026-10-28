// User Registration Page
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      const res = await register(
        formData.name,
        formData.email,
        formData.phone,
        formData.password
      );

      // Redirect to OTP verification page (passing devOtp if in local mock mode)
      const devParam = res?.devOtp ? `&devOtp=${res.devOtp}` : '';
      navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}${devParam}`);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mx-auto" style={{ maxWidth: '480px' }}>
        <div className="text-center mb-4">
          <div className="rounded-circle bg-primary text-white d-inline-flex p-3 mb-2">
            <i className="bi bi-person-plus-fill fs-3"></i>
          </div>
          <h3 className="fw-bold mb-1">Create Account</h3>
          <p className="text-muted small">Join ShopVilla to enjoy exclusive collections & discounts</p>
        </div>

        {errorMessage && (
          <div className="alert alert-danger py-2 small" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Full Name *</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="e.g. John Doe"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Email Address *</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="john@example.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Phone Number (Optional)</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="row g-2 mb-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Password *</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Min 6 chars"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="Repeat password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100 py-2 fw-semibold mt-2"
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status"></span>
            ) : (
              'Create My Account'
            )}
          </button>
        </form>

        <div className="mt-4 pt-3 border-top text-center small text-muted">
          Already have an account?{' '}
          <Link to="/login" className="fw-bold text-primary text-decoration-none">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
