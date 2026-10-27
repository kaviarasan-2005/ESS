// AdminSidebar.jsx — Pure UI sidebar component (no state, no data logic)
import React, { useRef, useEffect, memo } from 'react';
import { NavLink } from 'react-router-dom';
import useAdminNav, { NAV_GROUPS, GLOBAL_SETTINGS } from './useAdminNav';

const LOGO_URL =
  'https://res.cloudinary.com/dfu9u7nlz/image/upload/v1789119900/WhatsApp_Image_2026-08-28_at_5.21.24_PM_kyxtdy.jpg';

const FOCUS_RING = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70';
const SECTION_LABEL = 'px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2';

const MAIN_LINK_BASE = `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${FOCUS_RING}`;
const MAIN_LINK_ACTIVE = 'bg-blue-600 text-white shadow-md shadow-blue-900/40';
const MAIN_LINK_IDLE = 'text-slate-400 hover:bg-slate-800 hover:text-slate-200';

const GLOBAL_LINK_BASE = `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${FOCUS_RING}`;
const GLOBAL_LINK_ACTIVE = 'bg-slate-800 text-blue-400 font-bold';
const GLOBAL_LINK_IDLE = 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200';

const GROUP_BUTTON_BASE = `w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${FOCUS_RING}`;
const GROUP_BUTTON_ACTIVE = 'text-blue-400 bg-slate-800/60';
const GROUP_BUTTON_OPEN = 'text-slate-200 bg-slate-800/40';
const GROUP_BUTTON_IDLE = 'text-slate-300 hover:bg-slate-800';

const SUB_LINK_BASE = `group flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${FOCUS_RING}`;
const SUB_LINK_ACTIVE = 'bg-blue-600/15 text-blue-400 font-bold';
const SUB_LINK_IDLE = 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 hover:translate-x-0.5';

const DOT_BASE = 'w-1.5 h-1.5 rounded-full bg-current transition-all duration-200';
const DOT_ACTIVE = 'scale-125 opacity-100';
const DOT_IDLE = 'opacity-40 group-hover:opacity-100';

const PANEL_BASE = 'grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-in-out motion-reduce:transition-none';
const PANEL_OPEN = 'grid-rows-[1fr] opacity-100 visible';
const PANEL_CLOSED = 'grid-rows-[0fr] opacity-0 invisible';

// ── Sub-components (memoized) ─────────────────────────────────────────────────

const ChevronIcon = memo(({ isOpen }) => (
  <svg
    className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
  </svg>
));
ChevronIcon.displayName = 'ChevronIcon';

const getSubLinkClass = ({ isActive }) =>
  `${SUB_LINK_BASE} ${isActive ? SUB_LINK_ACTIVE : SUB_LINK_IDLE}`;

// Single generic accordion — memoized so toggling one group doesn't re-render siblings
const AccordionGroup = memo(({ group, isOpen, isActive, onToggle }) => {
  const groupClass = isActive
    ? `${GROUP_BUTTON_BASE} ${GROUP_BUTTON_ACTIVE}`
    : isOpen
    ? `${GROUP_BUTTON_BASE} ${GROUP_BUTTON_OPEN}`
    : `${GROUP_BUTTON_BASE} ${GROUP_BUTTON_IDLE}`;

  const panelClass = `${PANEL_BASE} ${isOpen ? PANEL_OPEN : PANEL_CLOSED}`;

  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`${group.key}-panel`}
        className={groupClass}
      >
        <span className="flex items-center gap-2">
          <span aria-hidden="true">{group.icon}</span> {group.label}
        </span>
        <ChevronIcon isOpen={isOpen} />
      </button>

      <div id={`${group.key}-panel`} className={panelClass} aria-hidden={!isOpen}>
        <div className="overflow-hidden min-h-0">
          <div className="ml-4 pl-3 border-l border-slate-800 space-y-1 mt-1 pb-1">
            {group.paths.map((item) => (
              <NavLink key={item.path} to={item.path} end className={getSubLinkClass}>
                {({ isActive }) => (
                  <>
                    <span className={`${DOT_BASE} ${isActive ? DOT_ACTIVE : DOT_IDLE}`} />
                    <span className="truncate">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
AccordionGroup.displayName = 'AccordionGroup';

// ── AdminSidebar ──────────────────────────────────────────────────────────────
const AdminSidebar = () => {
  const { toggleGroup, isGroupOpen, isGroupActive, handleLogout } = useAdminNav();

  const sidebarRef = useRef(null);
  const sidebarScrollPos = useRef(0);

  const handleSidebarScroll = (e) => {
    sidebarScrollPos.current = e.currentTarget.scrollTop;
  };

  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.scrollTop = sidebarScrollPos.current;
    }
  });

  return (
    <aside
      ref={sidebarRef}
      onScroll={handleSidebarScroll}
      className="w-64 h-screen fixed top-0 left-0 bg-slate-900 text-white flex flex-col justify-between p-6 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#334155_transparent] z-40"
    >
      <div className="space-y-6">
        {/* BRAND / LOGO */}
        <div className="flex items-center gap-3 pb-5 border-b border-slate-800">
          <div className="w-14 h-13 rounded-xl bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-lg shadow-blue-900/40">
            <img src={LOGO_URL} alt="Admin Portal logo" className="w-full h-full object-contain p-1" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-wider text-slate-100 uppercase leading-tight">
              Admin Portal
            </h2>
            <p className="text-[10px] text-slate-300 font-semibold tracking-wide">Control Panel</p>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="space-y-5" aria-label="Admin navigation">
          {/* 1. DASHBOARD */}
          <div>
            <p className={SECTION_LABEL}>Main</p>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `${MAIN_LINK_BASE} ${isActive ? MAIN_LINK_ACTIVE : MAIN_LINK_IDLE}`
              }
            >
              <span aria-hidden="true">📊</span> Dashboard
            </NavLink>
          </div>

          {/* 2. GLOBAL SETTINGS */}
          <div>
            <p className={SECTION_LABEL}>Global Components</p>
            <div className="space-y-1">
              {GLOBAL_SETTINGS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `${GLOBAL_LINK_BASE} ${isActive ? GLOBAL_LINK_ACTIVE : GLOBAL_LINK_IDLE}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* 3. PAGE CONTENT ACCORDIONS — driven by data array, not copy-pasted JSX */}
          <div>
            <p className={SECTION_LABEL}>Page Content</p>
            {NAV_GROUPS.map((group) => (
              <AccordionGroup
                key={group.key}
                group={group}
                isOpen={isGroupOpen(group.key)}
                isActive={isGroupActive(group.paths)}
                onToggle={() => toggleGroup(group.key)}
              />
            ))}
          </div>
        </nav>
      </div>

      {/* FOOTER / LOGOUT */}
      <div className="border-t border-slate-800 pt-4 mt-6">
        <button
          type="button"
          onClick={handleLogout}
          className={`w-full py-2.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 rounded-xl text-xs font-bold transition-all duration-200 active:scale-[0.98] ${FOCUS_RING}`}
        >
          Logout Admin
        </button>
      </div>
    </aside>
  );
};

export default memo(AdminSidebar);