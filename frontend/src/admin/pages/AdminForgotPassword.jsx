import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminResetPassword } from '../../services/api';

const LOGO_SRC =
  'https://res.cloudinary.com/dfu9u7nlz/image/upload/e_trim/v1789119900/WhatsApp_Image_2026-08-28_at_5.21.24_PM_kyxtdy.jpg';
const COMPANY_NAME = 'Essential Industrial Services';
const LOGIN_PATH = '/admin/login';
const DASHBOARD_PATH = '/admin/dashboard';

/* ── Eye icon ── */
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

/* ── Password strength ── */
const getStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '#e5e7eb' };
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return [
    { score: 0, label: '',           color: '#e5e7eb' },
    { score: 1, label: 'Very Weak',  color: '#ef4444' },
    { score: 2, label: 'Weak',       color: '#f97316' },
    { score: 3, label: 'Fair',       color: '#eab308' },
    { score: 4, label: 'Good',       color: '#22c55e' },
    { score: 5, label: 'Strong',     color: '#16a34a' },
  ][s];
};

const AdminForgotPassword = () => {
  const navigate = useNavigate();
  const [logoError, setLogoError] = useState(false);
  const [done, setDone] = useState(false);

  const [username, setUsername]     = useState('');
  const [newPw, setNewPw]           = useState('');
  const [confirmPw, setConfirmPw]   = useState('');
  const [showNew, setShowNew]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);

  const strength = getStrength(newPw);

  /* Redirect if already logged in */
  useEffect(() => {
    if (localStorage.getItem('admin_token')) navigate(DASHBOARD_PATH, { replace: true });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPw.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (newPw !== confirmPw) { setError('Passwords do not match. Please try again.'); return; }
    setLoading(true);
    try {
      await adminResetPassword(username, newPw);
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password. Please check your username and try again.');
    } finally {
      setLoading(false);
    }
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }

    .afp-root { min-height:100vh; display:flex; align-items:center; justify-content:center; background:#ffffff; color:#000000; font-family:'Inter',sans-serif; padding:24px; }

    @keyframes afpIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
    @keyframes afpFade { from{opacity:0} to{opacity:1} }

    /* Card + logo (same as login page) */
    .afp-card { position:relative; padding:28px 32px; background:#ffffff; border:1px solid #e5e7eb; border-radius:16px; width:100%; max-width:440px; box-shadow:0 10px 40px rgba(0,0,0,0.08); animation:afpIn 0.5s ease both; }
    .afp-logo { width:96px; height:96px; margin:0 auto 14px; border-radius:50%; background:#ffffff; border:1px solid #e5e7eb; box-shadow:0 6px 20px rgba(0,0,0,0.10); display:flex; align-items:center; justify-content:center; overflow:hidden; }
    .afp-logo img { width:100%; height:100%; object-fit:contain; padding:12px; }
    .afp-logo-fb { font-size:34px; font-weight:800; color:#2563eb; }

    .afp-title { text-align:center; font-size:22px; font-weight:800; color:#000000; letter-spacing:-0.5px; margin-bottom:4px; }
    .afp-sub { text-align:center; font-size:13px; color:#4b5563; margin-bottom:14px; }
    .afp-hint { text-align:center; font-size:12px; color:#6b7280; margin-bottom:20px; background:#f9fafb; border:1px solid #f0f0f0; border-radius:8px; padding:10px 14px; line-height:1.6; }

    .afp-label { display:block; font-size:12px; font-weight:600; color:#000000; margin-bottom:6px; }
    .afp-iw { position:relative; margin-bottom:16px; }
    .afp-input { width:100%; background:#ffffff; border:1px solid #d1d5db; border-radius:8px; padding:12px 14px; color:#000000; font-size:14px; font-family:'Inter',sans-serif; outline:none; transition:all 0.2s ease; }
    .afp-input::placeholder { color:#9ca3af; }
    .afp-input:focus { border-color:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,0.15); }
    .afp-input.has-eye { padding-right:44px; }
    .afp-eye { position:absolute; right:12px; bottom:10px; background:none; border:none; color:#6b7280; cursor:pointer; padding:4px; display:flex; align-items:center; transition:color 0.2s; }
    .afp-eye:hover { color:#000000; }

    .afp-bar { height:4px; border-radius:4px; background:#f3f4f6; overflow:hidden; margin-top:-8px; margin-bottom:4px; }
    .afp-fill { height:100%; border-radius:4px; transition:width 0.3s,background 0.3s; }
    .afp-slabel { font-size:10px; font-weight:600; margin-bottom:12px; text-align:right; }
    .afp-match { font-size:11px; font-weight:600; margin-top:-8px; margin-bottom:12px; }

    .afp-err { background:#fef2f2; border:1px solid #fecaca; color:#b91c1c; font-size:12px; font-weight:500; padding:10px 14px; border-radius:8px; margin-bottom:16px; display:flex; align-items:flex-start; gap:8px; }

    .afp-btn { width:100%; padding:13px; border:none; border-radius:8px; background:#2563eb; color:#ffffff; font-size:14px; font-weight:700; font-family:'Inter',sans-serif; cursor:pointer; transition:all 0.2s ease; margin-top:6px; }
    .afp-btn:hover:not(:disabled) { background:#1d4ed8; transform:translateY(-1px); box-shadow:0 6px 18px rgba(37,99,235,0.35); }
    .afp-btn:active:not(:disabled) { transform:translateY(0); }
    .afp-btn:disabled { opacity:0.65; cursor:not-allowed; }
    .afp-btn-ok { background:#16a34a; margin-top:20px; }
    .afp-btn-ok:hover:not(:disabled) { background:#15803d; box-shadow:0 6px 18px rgba(22,163,74,0.35); }

    @keyframes afpSpin { to{transform:rotate(360deg)} }
    .afp-spin { width:16px; height:16px; border:2px solid rgba(255,255,255,0.4); border-top-color:#ffffff; border-radius:50%; animation:afpSpin 0.7s linear infinite; display:inline-block; margin-right:8px; vertical-align:middle; }

    .afp-success-icon { width:68px; height:68px; border-radius:50%; background:#dcfce7; display:flex; align-items:center; justify-content:center; font-size:34px; margin:0 auto 16px; }

    .afp-divider { display:flex; align-items:center; gap:10px; margin:18px 0 0; color:#6b7280; font-size:11px; }
    .afp-divider::before, .afp-divider::after { content:''; flex:1; height:1px; background:#e5e7eb; }
    .afp-back { display:flex; align-items:center; justify-content:center; gap:5px; margin-top:12px; font-size:12px; color:#6b7280; text-decoration:none; transition:color 0.2s; }
    .afp-back:hover { color:#2563eb; }
    .afp-footer { text-align:center; font-size:11px; color:#4b5563; margin-top:12px; }
  `;

  return (
    <>
      <style>{css}</style>
      <div className="afp-root">
        <div className="afp-card">

          {/* Logo */}
          <div className="afp-logo">
            {logoError
              ? <span className="afp-logo-fb">E</span>
              : <img src={LOGO_SRC} alt={`${COMPANY_NAME} logo`} onError={() => setLogoError(true)} />
            }
          </div>

          <h1 className="afp-title">Forgot Password</h1>
          <p className="afp-sub">{COMPANY_NAME}</p>

          {/* ── RESET FORM ── */}
          {!done && (
            <>
              <p className="afp-hint">
                Enter your <strong>admin username</strong> and choose a new password.<br />
                No current password needed.
              </p>

              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="afp-err"><span>⚠</span><span>{error}</span></div>
                )}

                {/* Username */}
                <div className="afp-iw">
                  <label className="afp-label" htmlFor="fp-username">Username</label>
                  <input
                    id="fp-username" type="text" className="afp-input"
                    placeholder="Enter your admin username"
                    required autoComplete="username"
                    value={username} onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                {/* New Password */}
                <div className="afp-iw">
                  <label className="afp-label" htmlFor="fp-newpw">New Password</label>
                  <input
                    id="fp-newpw" type={showNew ? 'text' : 'password'}
                    className="afp-input has-eye" placeholder="Create a new password"
                    required autoComplete="new-password" minLength={6}
                    value={newPw} onChange={(e) => setNewPw(e.target.value)}
                  />
                  <button type="button" className="afp-eye" onClick={() => setShowNew(!showNew)} tabIndex={-1}>
                    <EyeIcon open={showNew} />
                  </button>
                </div>

                {/* Strength bar */}
                {newPw && (
                  <>
                    <div className="afp-bar">
                      <div className="afp-fill" style={{ width: `${(strength.score / 5) * 100}%`, background: strength.color }} />
                    </div>
                    <p className="afp-slabel" style={{ color: strength.color }}>{strength.label}</p>
                  </>
                )}

                {/* Confirm Password */}
                <div className="afp-iw">
                  <label className="afp-label" htmlFor="fp-confirmpw">Confirm New Password</label>
                  <input
                    id="fp-confirmpw" type={showConfirm ? 'text' : 'password'}
                    className="afp-input has-eye" placeholder="Re-enter your new password"
                    required autoComplete="new-password"
                    value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
                  />
                  <button type="button" className="afp-eye" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>
                    <EyeIcon open={showConfirm} />
                  </button>
                </div>

                {/* Match indicator */}
                {confirmPw && (
                  <p className="afp-match" style={{ color: newPw === confirmPw ? '#16a34a' : '#ef4444' }}>
                    {newPw === confirmPw ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}

                <button type="submit" className="afp-btn" disabled={loading}>
                  {loading ? <><span className="afp-spin" />Resetting Password…</> : 'Reset Password →'}
                </button>
              </form>
            </>
          )}

          {/* ── SUCCESS ── */}
          {done && (
            <div style={{ textAlign: 'center', animation: 'afpFade 0.4s ease both' }}>
              <div className="afp-success-icon">🎉</div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 8 }}>Password Reset!</h2>
              <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.7 }}>
                Your password has been updated successfully.<br />
                Please sign in with your new password.
              </p>
              <button className="afp-btn afp-btn-ok" onClick={() => navigate(LOGIN_PATH)}>
                Go to Login →
              </button>
            </div>
          )}

          {/* Footer */}
          {!done && (
            <>
              <div className="afp-divider">Admin Access</div>
              <Link to={LOGIN_PATH} className="afp-back">← Back to Login</Link>
            </>
          )}
          <p className="afp-footer">ESS CMS · All rights reserved © {new Date().getFullYear()}</p>
        </div>
      </div>
    </>
  );
};

export default AdminForgotPassword;