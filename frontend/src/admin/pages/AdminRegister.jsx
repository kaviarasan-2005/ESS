import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminRegister } from '../../services/api';

const LOGO_SRC =
  'https://res.cloudinary.com/dfu9u7nlz/image/upload/e_trim/v1789119900/WhatsApp_Image_2026-08-28_at_5.21.24_PM_kyxtdy.jpg';
const COMPANY_NAME = 'Essential Industrial Services';
const LOGIN_PATH = '/admin/login';
const DASHBOARD_PATH = '/admin/dashboard';
const REDIRECT_DELAY_MS = 2500;
const NETWORK_ERROR_MESSAGE = 'Cannot reach the server. Check that the backend is running on http://127.0.0.1:8000.';
const DEFAULT_REGISTER_ERROR = 'Registration failed.';

/* ── Turns any API error into a readable message ── */
const getErrorMessage = (err, fallback) => {
  if (!err.response) return NETWORK_ERROR_MESSAGE;
  const detail = err.response.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail) && detail.length > 0) return detail[0].msg;
  return `${fallback} (status ${err.response.status})`;
};

/* ── Eye icon SVG ── */
const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const AdminRegister = () => {
  const navigate = useNavigate();
  const [logoError, setLogoError] = useState(false);

  /* register state */
  const [regData, setRegData] = useState({ username: '', email: '', password: '', confirm: '' });
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [showRegPw, setShowRegPw] = useState(false);

  /* Redirect if already logged in */
  useEffect(() => {
    if (localStorage.getItem('admin_token')) {
      navigate(DASHBOARD_PATH, { replace: true });
    }
  }, [navigate]);

  /* ── Register Submit ── */
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (regData.password !== regData.confirm) {
      setRegError('Passwords do not match.');
      return;
    }
    if (regData.password.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }

    setRegLoading(true);
    try {
      await adminRegister(regData.username, regData.password, regData.email);
      setRegSuccess(`Account "${regData.username}" created! You can now log in.`);
      setRegData({ username: '', email: '', password: '', confirm: '' });
      setTimeout(() => {
        navigate(LOGIN_PATH);
      }, REDIRECT_DELAY_MS);
    } catch (err) {
      console.error('Register error:', err);
      setRegError(getErrorMessage(err, DEFAULT_REGISTER_ERROR));
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .ess-login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          color: #000000;
          font-family: 'Inter', sans-serif;
          padding: 24px;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .ess-card {
          position: relative;
          padding: 28px 32px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
          animation: slideIn 0.5s ease both;
        }

        .ess-logo-circle {
          width: 96px;
          height: 96px;
          margin: 0 auto 14px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          box-shadow: 0 6px 20px rgba(0,0,0,0.10);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .ess-logo-circle img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 12px;
        }

        .ess-logo-circle-fallback {
          font-size: 34px;
          font-weight: 800;
          color: #2563eb;
        }

        .ess-title {
          text-align: center;
          font-size: 22px;
          font-weight: 800;
          color: #000000;
          letter-spacing: -0.5px;
          margin-bottom: 4px;
        }

        .ess-subtitle {
          text-align: center;
          font-size: 13px;
          color: #4b5563;
          margin-bottom: 22px;
        }

        /* Form */
        .ess-form { animation: fadeIn 0.3s ease both; }

        .ess-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #000000;
          margin-bottom: 6px;
        }

        .ess-input-wrap {
          position: relative;
          margin-bottom: 16px;
        }

        .ess-input {
          width: 100%;
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 12px 14px;
          color: #000000;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: all 0.2s ease;
        }

        .ess-input::placeholder { color: #9ca3af; }

        .ess-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
        }

        .ess-input.has-eye { padding-right: 44px; }

        .ess-eye-btn {
          position: absolute;
          right: 12px;
          bottom: 10px;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .ess-eye-btn:hover { color: #000000; }

        .ess-submit-btn {
          width: 100%;
          padding: 13px;
          border: none;
          border-radius: 8px;
          background: #2563eb;
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 6px;
        }

        .ess-submit-btn:hover:not(:disabled) {
          background: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(37,99,235,0.35);
        }

        .ess-submit-btn:active:not(:disabled) { transform: translateY(0); }

        .ess-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* Alerts */
        .ess-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          font-size: 12px;
          font-weight: 500;
          padding: 10px 14px;
          border-radius: 8px;
          margin-bottom: 16px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .ess-success {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #15803d;
          font-size: 12px;
          font-weight: 500;
          padding: 10px 14px;
          border-radius: 8px;
          margin-bottom: 16px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        /* Spinner */
        @keyframes spin { to { transform: rotate(360deg); } }
        .ess-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
          margin-right: 8px;
          vertical-align: middle;
        }

        .ess-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 18px 0 0;
          color: #6b7280;
          font-size: 11px;
        }
        .ess-divider::before, .ess-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }

        .ess-footer-note {
          text-align: center;
          font-size: 11px;
          color: #4b5563;
          margin-top: 12px;
        }

        .ess-back-link {
          display: block;
          text-align: center;
          font-size: 13px;
          font-weight: 600;
          color: #2563eb;
          text-decoration: none;
          margin-top: 12px;
        }
        .ess-back-link:hover { text-decoration: underline; }
      `}</style>

      <div className="ess-login-root">
        <div className="ess-card">
          {/* ── Circle logo inside card top ── */}
          <div className="ess-logo-circle">
            {logoError ? (
              <span className="ess-logo-circle-fallback">E</span>
            ) : (
              <img
                src={LOGO_SRC}
                alt={`${COMPANY_NAME} logo`}
                onError={() => setLogoError(true)}
              />
            )}
          </div>

          <h1 className="ess-title">Create Admin Account</h1>
          <p className="ess-subtitle">{COMPANY_NAME}</p>

          {/* ── REGISTER FORM ── */}
          <form className="ess-form" onSubmit={handleRegister}>
            {regError && (
              <div className="ess-error">
                <span>⚠</span>
                <span>{regError}</span>
              </div>
            )}
            {regSuccess && (
              <div className="ess-success">
                <span>✓</span>
                <span>{regSuccess}</span>
              </div>
            )}

            <div className="ess-input-wrap">
              <label className="ess-label" htmlFor="reg-username">Username</label>
              <input
                id="reg-username"
                type="text"
                className="ess-input"
                placeholder="Choose a username"
                required
                minLength={3}
                value={regData.username}
                onChange={(e) => setRegData({ ...regData, username: e.target.value })}
              />
            </div>

            <div className="ess-input-wrap">
              <label className="ess-label" htmlFor="reg-email">
                Email <span style={{ color: '#6b7280', fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                id="reg-email"
                type="email"
                className="ess-input"
                placeholder="admin@example.com"
                value={regData.email}
                onChange={(e) => setRegData({ ...regData, email: e.target.value })}
              />
            </div>

            <div className="ess-input-wrap">
              <label className="ess-label" htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type={showRegPw ? 'text' : 'password'}
                className="ess-input has-eye"
                placeholder="Min. 6 characters"
                required
                minLength={6}
                value={regData.password}
                onChange={(e) => setRegData({ ...regData, password: e.target.value })}
              />
              <button
                type="button"
                className="ess-eye-btn"
                onClick={() => setShowRegPw(!showRegPw)}
                tabIndex={-1}
              >
                <EyeIcon open={showRegPw} />
              </button>
            </div>

            <div className="ess-input-wrap">
              <label className="ess-label" htmlFor="reg-confirm">Confirm Password</label>
              <input
                id="reg-confirm"
                type={showRegPw ? 'text' : 'password'}
                className="ess-input"
                placeholder="Repeat your password"
                required
                value={regData.confirm}
                onChange={(e) => setRegData({ ...regData, confirm: e.target.value })}
              />
            </div>

            <button type="submit" className="ess-submit-btn" disabled={regLoading}>
              {regLoading ? (
                <><span className="ess-spinner" />Creating Account…</>
              ) : 'Create Admin Account →'}
            </button>

            <div className="ess-divider">Secure Registration</div>
            <p className="ess-footer-note">All admin accounts are stored securely with bcrypt hashing.</p>
            <Link to={LOGIN_PATH} className="ess-back-link">← Back to Sign In</Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminRegister;