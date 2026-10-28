// Forgot & Reset Password Page
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ForgotPasswordPage = () => {
  const { forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP & New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    try {
      setLoading(true);
      await forgotPassword(email);
      setStep(2);
      setMessage({
        text: 'A reset OTP has been dispatched to your email address.',
        type: 'info',
      });
    } catch (err) {
      setMessage({ text: err.message, type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Passwords do not match.', type: 'danger' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters.', type: 'danger' });
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email, otp, newPassword);
      setMessage({
        text: 'Password updated successfully! Redirecting...',
        type: 'success',
      });
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setMessage({ text: err.message, type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mx-auto" style={{ maxWidth: '440px' }}>
        <div className="text-center mb-4">
          <div className="rounded-circle bg-danger-subtle text-danger d-inline-flex p-3 mb-2">
            <i className="bi bi-shield-lock-fill fs-2"></i>
          </div>
          <h3 className="fw-bold mb-1">
            {step === 1 ? 'Forgot Password?' : 'Reset Your Password'}
          </h3>
          <p className="text-muted small">
            {step === 1
              ? 'Enter your registered email address to receive an OTP reset code'
              : 'Enter the code sent to your email and choose a new password'}
          </p>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type} py-2 small`} role="alert">
            {message.text}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
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
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 py-2 fw-semibold"
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status"></span>
              ) : (
                'Send Reset OTP'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">6-Digit OTP Code</label>
              <input
                type="text"
                maxLength={6}
                className="form-control text-center fs-5 fw-bold"
                placeholder="••••••"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Min 6 characters"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Repeat password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 py-2 fw-semibold"
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status"></span>
              ) : (
                'Save & Log In'
              )}
            </button>
          </form>
        )}

        <div className="mt-4 text-center small">
          <Link to="/login" className="text-decoration-none">
            <i className="bi bi-arrow-left me-1"></i> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
