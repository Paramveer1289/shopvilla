// OTP Verification Page
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VerifyOtpPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyOtp, resendOtp } = useAuth();

  const emailParam = searchParams.get('email') || '';
  const devOtpParam = searchParams.get('devOtp') || '';
  const [email, setEmail] = useState(emailParam);
  const [devOtp, setDevOtp] = useState(devOtpParam);
  const [otp, setOtp] = useState(devOtpParam || '');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (otp.length !== 6) {
      setMessage({ text: 'Please enter a valid 6-digit OTP code', type: 'danger' });
      return;
    }

    try {
      setLoading(true);
      await verifyOtp(email, otp);
      setMessage({ text: 'Email verified successfully! Redirecting...', type: 'success' });
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setMessage({ text: err.message, type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      const res = await resendOtp(email);
      setCountdown(60);
      if (res?.devOtp) {
        setDevOtp(res.devOtp);
        setOtp(res.devOtp);
      }
      setMessage({ text: res?.message || 'A fresh OTP has been generated.', type: 'info' });
    } catch (err) {
      setMessage({ text: err.message, type: 'danger' });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mx-auto" style={{ maxWidth: '440px' }}>
        <div className="text-center mb-4">
          <div className="rounded-circle bg-primary-light text-primary d-inline-flex p-3 mb-2">
            <i className="bi bi-envelope-check-fill fs-2"></i>
          </div>
          <h3 className="fw-bold mb-1">Verify Your Email</h3>
          <p className="text-muted small mb-1">
            We sent a 6-digit verification code to <strong>{email || 'your email'}</strong>.
          </p>
          <span className="badge bg-primary-light text-primary border small">
            <i className="bi bi-clock me-1"></i> Expires in 5 minutes &bull; Max 3 attempts
          </span>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type} py-2 small`} role="alert">
            {message.text}
          </div>
        )}

        {/* Demo Mode / Mock Email Notification Banner */}
        {devOtp && (
          <div className="alert alert-warning border-0 rounded-4 shadow-sm py-3 px-3 mb-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="badge bg-warning text-dark mb-1">Local Mock Mode</span>
                <p className="mb-0 small text-muted">
                  Gmail credentials not set in <code>.env</code>. Code logged to terminal:
                </p>
                <strong className="fs-5 text-primary letter-spacing-md">{devOtp}</strong>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => setOtp(devOtp)}
              >
                Auto Fill
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!emailParam && (
            <div className="mb-3">
              <label className="form-label small fw-semibold">Email Address</label>
              <input
                type="email"
                className="form-control"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          <div className="mb-4">
            <label className="form-label small fw-semibold">6-Digit Verification Code</label>
            <input
              type="text"
              maxLength={6}
              className="form-control text-center fs-4 fw-bold letter-spacing-lg"
              placeholder="••••••"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              style={{ letterSpacing: '0.4rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="btn btn-primary w-100 py-2 fw-semibold"
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status"></span>
            ) : (
              'Verify & Activate Account'
            )}
          </button>
        </form>

        <div className="mt-4 text-center small text-muted">
          Didn't receive the OTP?{' '}
          {countdown > 0 ? (
            <span className="text-secondary fw-semibold">Resend in {countdown}s</span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="btn btn-link btn-sm p-0 text-decoration-none fw-bold"
            >
              {resending ? 'Sending...' : 'Resend Code'}
            </button>
          )}
        </div>

        <div className="mt-3 text-center small">
          <Link to="/login" className="text-muted text-decoration-none">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
