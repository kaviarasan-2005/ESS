import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

// ─── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

// ─── Icons ────────────────────────────────────────────────────────────────────
const SuccessIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12.5l3 3 5-5" />
  </svg>
);

const ErrorIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
  </svg>
);

// ─── Toast Config ─────────────────────────────────────────────────────────────
const TOAST_CONFIG = {
  success: {
    bg: 'bg-white',
    border: 'border-l-4 border-emerald-500',
    Icon: SuccessIcon,
    iconColor: 'text-emerald-500',
    titleColor: 'text-emerald-700',
    textColor: 'text-slate-600',
    progress: 'bg-emerald-500',
    label: 'Saved Successfully',
  },
  error: {
    bg: 'bg-white',
    border: 'border-l-4 border-rose-500',
    Icon: ErrorIcon,
    iconColor: 'text-rose-500',
    titleColor: 'text-rose-700',
    textColor: 'text-slate-600',
    progress: 'bg-rose-500',
    label: 'Action Failed',
  },
  info: {
    bg: 'bg-white',
    border: 'border-l-4 border-blue-500',
    Icon: InfoIcon,
    iconColor: 'text-blue-500',
    titleColor: 'text-blue-700',
    textColor: 'text-slate-600',
    progress: 'bg-blue-500',
    label: 'Info',
  },
};

const DURATION = 4500; // ms

// ─── Single Toast Item ────────────────────────────────────────────────────────
const ToastItem = ({ toast, onDismiss }) => {
  const cfg = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;
  const { Icon } = cfg;
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  const dismiss = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 320);
  }, [onDismiss, toast.id]);

  useEffect(() => {
    startRef.current = performance.now();
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const pct = Math.max(0, 100 - (elapsed / DURATION) * 100);
      setProgress(pct);
      if (pct > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        dismiss();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [dismiss]);

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        animation: exiting
          ? 'toastSlideOut 0.32s cubic-bezier(0.4,0,1,1) forwards'
          : 'toastSlideIn 0.38s cubic-bezier(0.175,0.885,0.32,1.275) forwards',
        pointerEvents: 'all',
      }}
      className={`relative overflow-hidden rounded-xl shadow-lg ring-1 ring-slate-900/8 ${cfg.bg} ${cfg.border}`}
    >
      <div className="flex items-start gap-3 px-4 py-3.5">
        <span className={`mt-0.5 ${cfg.iconColor}`}><Icon /></span>
        <div className="flex-1 min-w-0">
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${cfg.titleColor}`}>
            {cfg.label}
          </p>
          <p className={`text-sm leading-snug break-words ${cfg.textColor}`}>
            {toast.message}
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss notification"
          className="shrink-0 mt-0.5 text-slate-400 hover:text-slate-700 transition-colors duration-150 rounded-lg p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        >
          <CloseIcon />
        </button>
      </div>
      <div className="h-[3px] w-full bg-slate-100">
        <div
          className={`h-full ${cfg.progress} transition-none`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(115%) scale(0.90); }
          to   { opacity: 1; transform: translateX(0)    scale(1);    }
        }
        @keyframes toastSlideOut {
          from { opacity: 1; transform: translateX(0)    scale(1);    }
          to   { opacity: 0; transform: translateX(115%) scale(0.90); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes toastSlideIn  { from { opacity: 0; } to { opacity: 1; } }
          @keyframes toastSlideOut { from { opacity: 1; } to { opacity: 0; } }
        }
      `}</style>

      <div
        aria-label="Notifications"
        role="region"
        style={{
          position: 'fixed',
          top: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.625rem',
          pointerEvents: 'none',
          width: '22rem',
          maxWidth: 'calc(100vw - 3rem)',
        }}
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
/**
 * useToast()
 * Returns { showToast }
 * Usage: showToast('Message text', 'success' | 'error' | 'info')
 */
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      showToast: (msg, type = 'info') => {
        console.warn(`[Toast fallback - ${type}]:`, msg);
      }
    };
  }
  return ctx;
};

export default ToastProvider;
