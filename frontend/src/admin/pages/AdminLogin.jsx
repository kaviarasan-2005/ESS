import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { adminLogin } from '../../services/api';
import { isAdminTokenExpired } from '../../services/apiCore';

const LOGO_SRC =
  'https://res.cloudinary.com/dfu9u7nlz/image/upload/e_trim/v1789119900/WhatsApp_Image_2026-08-28_at_5.21.24_PM_kyxtdy.jpg';
const COMPANY_NAME = 'Essential Industrial Services';
const DASHBOARD_PATH = '/admin/dashboard';

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

const AdminLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [logoError, setLogoError] = useState(false);

  // Session message shown when redirected from a protected route
  const sessionReason = searchParams.get('session'); // 'expired' | 'unauthorized' | null

  /* login state */
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPw, setShowLoginPw] = useState(false);

  /* Redirect if already logged in AND token is still valid */
  useEffect(() => {
    if (!isAdminTokenExpired()) {
      navigate(DASHBOARD_PATH, { replace: true });
    }
  }, [navigate]);

  /* ── Login Submit ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      await adminLogin(loginData.username, loginData.password);
      if (localStorage.getItem('admin_token')) {
        navigate(DASHBOARD_PATH);
      } else {
        setLoginError('Login succeeded but token was not saved.');
      }
    } catch (err) {
      setLoginError(
        err.response?.data?.detail || 'Invalid username or password. Please try again.'
      );
    } finally {
      setLoginLoading(false);
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
          padding: 10px;
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

        .ess-forgot-link {
          display: block;
          text-align: right;
          font-size: 12px;
          font-weight: 600;
          color: #2563eb;
          text-decoration: none;
          margin-top: -8px;
          margin-bottom: 16px;
          transition: color 0.2s;
        }
        .ess-forgot-link:hover { color: #1d4ed8; text-decoration: underline; }

        .ess-session-banner {
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 16px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        .ess-session-banner.expired {
          background: #fffbeb;
          border: 1px solid #fcd34d;
          color: #92400e;
        }
        .ess-session-banner.unauthorized {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
        }
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

          <h1 className="ess-title">Admin Portal</h1>
          <p className="ess-subtitle">{COMPANY_NAME}</p>

          {/* ── LOGIN FORM ── */}
          <form className="ess-form" onSubmit={handleLogin}>
            {/* Session expired / unauthorized banner */}
            {sessionReason === 'expired' && (
              <div className="ess-session-banner expired">
                <span>⏱</span>
                <span>Your session has expired. Please sign in again.</span>
              </div>
            )}
            {sessionReason === 'unauthorized' && (
              <div className="ess-session-banner unauthorized">
                <span>🔒</span>
                <span>Access denied. Please sign in to continue.</span>
              </div>
            )}

            {loginError && (
              <div className="ess-error">
                <span>⚠</span>
                <span>{loginError}</span>
              </div>
            )}

            <div className="ess-input-wrap">
              <label className="ess-label" htmlFor="login-username">Username</label>
              <input
                id="login-username"
                type="text"
                className="ess-input"
                placeholder="Enter your username"
                required
                autoComplete="username"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              />
            </div>

            <div className="ess-input-wrap">
              <label className="ess-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type={showLoginPw ? 'text' : 'password'}
                className="ess-input has-eye"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
              <button
                type="button"
                className="ess-eye-btn"
                onClick={() => setShowLoginPw(!showLoginPw)}
                tabIndex={-1}
              >
                <EyeIcon open={showLoginPw} />
              </button>
            </div>

            <Link to="/admin/forgot-password" className="ess-forgot-link">
              Forgot Password?
            </Link>

            <button type="submit" className="ess-submit-btn" disabled={loginLoading}>
              {loginLoading ? (
                <><span className="ess-spinner" />Authenticating…</>
              ) : 'Sign In →'}
            </button>

            <div className="ess-divider">Secure Admin Access</div>
            <p className="ess-footer-note">ESS CMS · All rights reserved © {new Date().getFullYear()}</p>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;