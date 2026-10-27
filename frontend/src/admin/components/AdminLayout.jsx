// AdminLayout.jsx — Thin layout shell: sidebar + main content area
import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ToastProvider } from './ToastContext';
import AdminSidebar from './Adminsidebar';
import { isAdminTokenExpired } from '../../services/apiCore';

// Page content fade-in when a section changes
const PAGE_FADE_STYLES = `
  @keyframes adminPageFade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .admin-page-fade {
    animation: adminPageFade 0.3s ease-out both;
  }
  @media (prefers-reduced-motion: reduce) {
    .admin-page-fade { animation: none; }
  }
`;

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ── Auth guard: redirect to login if token is missing or expired ──
  useEffect(() => {
    const checkAuth = () => {
      if (isAdminTokenExpired()) {
        navigate('/admin/login?session=expired', { replace: true });
      }
    };

    // Check immediately on mount
    checkAuth();

    // Re-check every 60 seconds to catch mid-session expiry without a network call
    const interval = setInterval(checkAuth, 60_000);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-slate-100 font-sans text-slate-800">
        <style>{PAGE_FADE_STYLES}</style>

        {/* SIDEBAR */}
        <AdminSidebar />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
          <div key={location.pathname} className="admin-page-fade">
            <Outlet />
          </div>
        </main>
      </div>
    </ToastProvider>
  );
};

export default AdminLayout;