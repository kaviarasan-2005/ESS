import React, { useEffect } from 'react';

// Ultra-high z-index to stay above all dropdowns, portals, and modals
const PRELOADER_Z_INDEX = 'z-[999999]';
const RING_SIZE = 'h-40 w-40'; // Outer spinner
const LOGO_BOX_SIZE = 'h-28 w-28'; // Center logo circle
const BAR_SPEED_SECONDS = 1.4; // Progress bar speed
const LOGO_URL =
  'https://res.cloudinary.com/dfu9u7nlz/image/upload/v1789119900/WhatsApp_Image_2026-08-28_at_5.21.24_PM_kyxtdy.jpg';

const Preloader = ({ message = 'Loading...' }) => {
  // Prevent underlying layout shifts, scrollbars, and dropdown leaks while active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.pointerEvents = 'none';

    return () => {
      document.body.style.overflow = '';
      document.body.style.pointerEvents = '';
    };
  }, []);

  return (
    <div
      style={{ isolate: 'isolate' }}
      className={`fixed inset-0 ${PRELOADER_Z_INDEX} flex flex-col items-center justify-center bg-white font-sans text-slate-800 pointer-events-auto select-none`}
    >
      {/* Progress bar slide animation */}
      <style>{`
        @keyframes preloader-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>

      {/* Soft background glow */}
      <div className="absolute h-80 w-80 rounded-full bg-blue-100/60 blur-3xl pointer-events-none" />

      {/* Ring + logo */}
      <div className="relative flex items-center justify-center">
        {/* Static track */}
        <div className={`${RING_SIZE} absolute rounded-full border-[3px] border-slate-100`} />

        {/* Spinning arc */}
        <div
          className={`${RING_SIZE} animate-spin rounded-full border-[3px] border-transparent border-t-blue-600 [animation-duration:1.1s]`}
        />

        {/* Logo circle */}
        <div
          className={`absolute ${LOGO_BOX_SIZE} flex items-center justify-center overflow-hidden rounded-full border border-slate-100 bg-white p-3 shadow-lg shadow-blue-900/10`}
        >
          <img
            src={LOGO_URL}
            alt="ESS Logo"
            className="h-full w-full object-contain"
          />
        </div>
      </div>

      {/* Text + progress bar */}
      <div className="relative z-10 mt-10 flex flex-col items-center gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
          {message}
        </p>

        <div className="relative h-[3px] w-28 overflow-hidden rounded-full bg-slate-200">
          <div
            className="absolute left-0 top-0 h-full w-1/3 rounded-full bg-blue-600"
            style={{ animation: `preloader-slide ${BAR_SPEED_SECONDS}s ease-in-out infinite` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Preloader;