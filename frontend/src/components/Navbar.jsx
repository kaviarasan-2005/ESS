import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchNavbarSettings } from '../services/api';

// Dropdowns that use two-column layout
const TWO_COLUMN_DROPDOWN_PATHS = ['/products', '/integrated-systems', '/partners'];

// Nav links hidden from the navbar (set to [] to show them again)
const HIDDEN_NAV_PATHS = ['/partners'];

// Show / hide the "Shop with Us" CTA button (true to show it again)
const SHOW_CTA_BUTTON = true;

// Sizing constants
const ICON_SIZE = 'w-8 h-8';              // actual icon size (was w-5 h-5)
const SPLIT_ICON_BOX = 'w-11 h-11';       // icon wrapper (was w-7 h-7)
const SPLIT_PANEL_WIDTH = 'w-[700px]';    // was w-[640px]
const SIMPLE_PANEL_WIDTH = 'w-80';        // was w-72
// Partner row (bullet dot list) - font bumped up one step
const PARTNER_ROW_CLASS =
  'flex items-center gap-2.5 px-3 py-2 min-h-[42px] text-sm xl:text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg transition-colors text-left';
// Shared row hover class
const DROPDOWN_ROW_CLASS =
  'flex items-center gap-3 px-3 py-2 min-h-[52px] text-xs xl:text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg transition-colors text-left';

// Helper to extract string safely from API objects
const getItemRawString = (item) => {
  if (!item) return '';
  if (typeof item === 'string') return item;
  return (
    item.label ||
    item.title ||
    item.name ||
    item.product_name ||
    item.category_name ||
    item.text ||
    ''
  );
};

/* 
 * Unique Blue Line-Art SVG Icons (Products, Integrated Systems, Projects & Services)
 */
const BLUE_ICONS = {
  // --- PROJECTS & SERVICES ICONS ---
  turnkeyProjects: (
    <svg className={`${ICON_SIZE} text-blue-600 shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  maintenanceSupport: (
    <svg className={`${ICON_SIZE} text-blue-600 shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a2 2 0 01-2 2 2 2 0 01-2-2V4zm-6 8a2 2 0 114 0v1a2 2 0 01-2 2 2 2 0 01-2-2v-1zm12 0a2 2 0 114 0v1a2 2 0 01-2 2 2 2 0 01-2-2v-1z" />
    </svg>
  ),
  capabilities: (
    <svg className={`${ICON_SIZE} text-blue-900 shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  completedProjects: (
    <svg className={`${ICON_SIZE} text-blue-900 shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  afterSalesWarranty: (
    <svg className={`${ICON_SIZE} text-blue-900 shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),

  // --- PRODUCTS & SYSTEMS ICONS ---
  analyzerSystems: (
    <svg className={`${ICON_SIZE} text-blue-900 shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  emissionMonitoring: (
    <svg className={`${ICON_SIZE} text-blue-900 shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
  ),
  fireGasControl: (
    <svg className={`${ICON_SIZE} text-blue-900 shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  industrialAutomation: (
    <svg className={`${ICON_SIZE} text-blue-900 shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 20h18V10l-4 3V10l-4 3V7L3 12v8zm14-13h2v3h-2V7z" />
    </svg>
  ),
  massNotification: (
    <svg className={`${ICON_SIZE} text-blue-900 shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" />
    </svg>
  ),
  powerBackup: (
    <svg className={`${ICON_SIZE} text-blue-900 shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h11a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 01-2-2zm15 3v4M10 11l-2 3h3l-1 3" />
    </svg>
  ),
  samplingSystems: (
    <svg className={`${ICON_SIZE} text-blue-900 shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
    </svg>
  ),
  beaconsSounders: (
    <svg className={`${ICON_SIZE} text-blue-900 shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414M12 8a4 4 0 00-4 4v3h8v-3a4 4 0 00-4-4z" />
    </svg>
  ),
  flameGasDetectors: (
    <svg className={`${ICON_SIZE} text-blue-900 shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  moistureDewPoint: (
    <svg className={`${ICON_SIZE} text-blue-900 shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12l3-3m-3 7a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
  ),
  processAnalyzers: (
    <svg className={`${ICON_SIZE} text-blue-900 shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.6 15.11a2 2 0 01-1.183-1.808V5.001a2 2 0 012-2h11.196a2 2 0 011.969 1.632l.846 4.652" />
    </svg>
  ),
  processInstrumentation: (
    <svg className={`${ICON_SIZE} text-blue-900 shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-8m14 0a3 3 0 00-3-3H8a3 3 0 00-3 3m14 0H5m7-8v3" />
    </svg>
  ),
  upstreamInstrumentation: (
    <svg className={`${ICON_SIZE} text-blue-900 shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M7 8l5 4-5 4M17 8l-5 4 5 4" />
    </svg>
  ),
  vesdaSmokeDetection: (
    <svg className={`${ICON_SIZE} text-blue-900 shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    </svg>
  ),
  default: (
    <svg className={`${ICON_SIZE} text-blue-900 shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

/* 
 * Returns icon for Products, Integrated Systems, and Projects & Services
 */
const getItemIcon = (dropItem) => {
  const text = (getItemRawString(dropItem) + ' ' + (dropItem?.path || '')).toLowerCase();

  // Projects & Services
  if (text.includes('after-sales') || text.includes('after sales') || text.includes('warranty')) return BLUE_ICONS.afterSalesWarranty;
  if (text.includes('turnkey')) return BLUE_ICONS.turnkeyProjects;
  if (text.includes('maintenance') || text.includes('support')) return BLUE_ICONS.maintenanceSupport;
  if (text.includes('capability') || text.includes('capabilities')) return BLUE_ICONS.capabilities;
  if (text.includes('completed project') || text.includes('completed projects')) return BLUE_ICONS.completedProjects;

  // Integrated Systems
  if (text.includes('analyzer systems')) return BLUE_ICONS.analyzerSystems;
  if (text.includes('emission monitoring')) return BLUE_ICONS.emissionMonitoring;
  if (text.includes('fire & gas control') || text.includes('fire and gas control')) return BLUE_ICONS.fireGasControl;
  if (text.includes('industrial automation') || text.includes('sil-rated')) return BLUE_ICONS.industrialAutomation;
  if (text.includes('mass notification')) return BLUE_ICONS.massNotification;
  if (text.includes('power backup') || text.includes('ups') || text.includes('battery')) return BLUE_ICONS.powerBackup;
  if (text.includes('sampling systems')) return BLUE_ICONS.samplingSystems;

  // Products
  if (text.includes('beacons') || text.includes('sounders')) return BLUE_ICONS.beaconsSounders;
  if (text.includes('flame & gas detectors') || text.includes('flame and gas detectors')) return BLUE_ICONS.flameGasDetectors;
  if (text.includes('moisture') || text.includes('dew point')) return BLUE_ICONS.moistureDewPoint;
  if (text.includes('process analyzers')) return BLUE_ICONS.processAnalyzers;
  if (text.includes('process instrumentation')) return BLUE_ICONS.processInstrumentation;
  if (text.includes('upstream instrumentation') || text.includes('water cut')) return BLUE_ICONS.upstreamInstrumentation;
  if (text.includes('vesda') || text.includes('smoke detection')) return BLUE_ICONS.vesdaSmokeDetection;

  return BLUE_ICONS.default;
};

const Navbar = () => {
  const navigate = useNavigate();
  const [navData, setNavData] = useState({
    logo_url: '',
    nav_links: [
      { id: '1', label: 'Home', path: '/' },
      { id: '2', label: 'About Us', path: '/about' },
      { 
        id: '3', 
        label: 'Products', 
        path: '/products', 
        has_dropdown: true,
        dropdown_items: [
          { label: 'Beacons & Sounders', path: '/products/beacons-sounders' },
          { label: 'Flame & Gas Detectors', path: '/products/flame-gas-detectors' },
          { label: 'Moisture & Dew Point Measurement Instruments', path: '/products/moisture-dew-point' },
          { label: 'Process Analyzers', path: '/products/process-analyzers' },
          { label: 'Process Instrumentation', path: '/products/process-instrumentation' },
          { label: 'Upstream Instrumentation (Water Cut Meters)', path: '/products/upstream-instrumentation' },
          { label: 'VESDA® Aspirating Smoke Detection & Fire Alarm Devices', path: '/products/vesda-smoke-detection' }
        ]
      },
      { 
        id: '4', 
        label: 'Systems & Solutions', 
        path: '/integrated-systems', 
        has_dropdown: true,
        dropdown_items: [
          { label: 'Analyzer Systems', path: '/integrated-systems/analyzer-systems' },
          { label: 'Emission Monitoring Systems', path: '/integrated-systems/emission-monitoring' },
          { label: 'Fire & Gas Control Systems', path: '/integrated-systems/fire-gas-control' },
          { label: 'Industrial Automation & SIL-Rated Control Systems', path: '/integrated-systems/industrial-automation' },
          { label: 'Mass Notification Systems', path: '/integrated-systems/mass-notification' },
          { label: 'Power Backup Systems (UPS & Battery Charger)', path: '/integrated-systems/power-backup' },
          { label: 'Sampling Systems', path: '/integrated-systems/sampling-systems' }
        ]
      },
      { 
        id: '5', 
        label: 'Our Partners', 
        path: '/partners', 
        has_dropdown: true, 
        dropdown_items: [
          { label: 'AGC Instruments', path: '/agcinstruments' },
          { label: 'AKAY Industries', path: '/akayindustries' },
          { label: 'Aveva', path: '/avevapage' },
          { label: 'Bartec', path: '/bartecpage' },
          { label: 'Eco Physics', path: '/ecophysics' },
          { label: 'Eaton MEDC', path: '/eaton' },
          { label: 'Emerson Automation Solutions', path: '/emerson' },
          { label: 'HACH Water Quality Analysis', path: '/hach' },
          { label: 'Hitachi Compressors', path: '/hitachi' },
          { label: 'Honeywell Automation', path: '/honeywell' },
          { label: 'Honeywell Gas Detection', path: '/honeywellgas-detection' },
          { label: 'Hyosung Goodsprings', path: '/hyosung' },
          { label: 'Metal Samples', path: '/metal-samples' },
          { label: 'Michell Instruments', path: '/michell-instruments' },
          { label: 'Panorama System Integrator', path: '/panorama' },
          { label: 'Prominent Metering Pumps', path: '/prominent' },
          { label: 'RA Silver System Integrator', path: '/rasilver' },
          { label: 'Testo', path: '/testo' },
          { label: 'TSI', path: '/sub-route-1' },
          { label: 'Vogelsang', path: '/sub-route-2' }
        ] 
      },
      { 
        id: '6', 
        label: 'Projects &\nServices', 
        path: '/projects-services', 
        has_dropdown: true,
        dropdown_items: [
          { label: 'Turnkey Projects', path: '/projects-services/turnkey' },
          { label: 'Maintenance & Support', path: '/projects-services/maintenance' },
          { label: 'Capabilities', path: '/projects-services/capabilities' },
          { label: 'Completed Projects', path: '/projects-services/completed-projects' }
        ]
      },
      { id: '7', label: 'Contact Us', path: '/contact' }
    ],
    cta_button: { text: 'Shop with Us', url: '/shop' }
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);

  useEffect(() => {
    fetchNavbarSettings()
      .then((res) => {
        const data = res?.data || res || {};
        if (data && (data.nav_links || data.logo_url)) {
          setNavData((prev) => ({
            ...prev,
            ...data,
            cta_button: data.cta_button || { text: data.cta_text || 'Shop with Us', url: data.cta_url || '/shop' }
          }));
        }
      })
      .catch((err) => console.error('Error fetching Navbar settings:', err));
  }, []);

  /* Formatting single-line label */
  const renderFormattedLabel = (item) => {
    const raw = getItemRawString(item);
    const singleLine = raw.replace(/\s*\n\s*/g, ' ').trim();
    return <span className="whitespace-nowrap">{singleLine}</span>;
  };

  const getDropdownItems = (items) => {
    if (!items || !Array.isArray(items)) return [];
    return items;
  };

  /* Render SVG icon for items with icons */
  const renderDropdownIcon = (dropItem) => {
    const icon = getItemIcon(dropItem);
    return (
      <span className={`${SPLIT_ICON_BOX} shrink-0 flex items-center justify-center`}>
        {icon}
      </span>
    );
  };

  /* Render standard item link with SVG Icon */
  const renderDropdownLinkWithIcon = (dropItem, idx, parentPath) => (
    <Link
      key={`link-${parentPath}-${dropItem.id || dropItem.path || idx}`}
      to={dropItem.path || '#'}
      className={DROPDOWN_ROW_CLASS}
    >
      {renderDropdownIcon(dropItem)}
      <span className="leading-tight">{getItemRawString(dropItem)}</span>
    </Link>
  );

  /* Render partner item link WITH BULLET POINTER DOT */
  const renderPartnerLinkWithDot = (dropItem, idx) => (
    <Link
      key={`partner-${dropItem.id || dropItem.path || idx}`}
      to={dropItem.path || '#'}
      className={PARTNER_ROW_CLASS}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
      <span className="leading-tight">{getItemRawString(dropItem)}</span>
    </Link>
  );

  const handleMobileTextClick = (item) => {
    const items = getDropdownItems(item.dropdown_items);
    const hasChildren = item.has_dropdown && items.length > 0;

    if (hasChildren) {
      if (openMobileDropdown === item.id) {
        setIsMobileMenuOpen(false);
        setOpenMobileDropdown(null);
        navigate(item.path || '#');
      } else {
        setOpenMobileDropdown(item.id);
      }
    } else {
      setIsMobileMenuOpen(false);
      setOpenMobileDropdown(null);
      navigate(item.path || '#');
    }
  };

  const handleArrowToggle = (e, id) => {
    e.stopPropagation();
    setOpenMobileDropdown((prev) => (prev === id ? null : id));
  };

  // Links actually shown in the navbar (hidden ones removed)
  const visibleNavLinks = (navData.nav_links || []).filter(
    (item) => !HIDDEN_NAV_PATHS.includes(item.path)
  );

  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-sm border-b-2 border-[#1e2738]">
      <style>{`
        .no-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Container */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 lg:h-25 flex items-center justify-between gap-4 lg:gap-6">

          {/* BRAND LOGO */}
          <Link to="/" className="flex items-center shrink-0 pr-2">
            {navData.logo_url ? (
              <img 
                src={navData.logo_url} 
                alt="ESS Logo" 
                className="h-10 lg:h-12 xl:h-14 mb-1 w-auto object-contain"
              />
            ) : (
              <span className="text-2xl font-black text-slate-900 tracking-tight">ESS</span>
            )}
          </Link>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden lg:flex items-center justify-evenly gap-2 lg:gap-1 xl:gap-8 2xl:gap-10 flex-1 h-full">
            {visibleNavLinks.map((item) => {
              const dropdownItems = getDropdownItems(item.dropdown_items);
              const hasDropdown = item.has_dropdown && dropdownItems.length > 0;
              const isTwoColumn = hasDropdown && TWO_COLUMN_DROPDOWN_PATHS.includes(item.path);
              const isPartners = item.path === '/partners';

              const halfCount = Math.ceil(dropdownItems.length / 2);
              const leftItems = dropdownItems.slice(0, halfCount);
              const rightItems = dropdownItems.slice(halfCount);

              return (
                <div key={`nav-${item.id || item.path}`} className="relative group py-2 h-full flex items-center shrink-0">
                  <Link
                    to={item.path || '#'}
                    className="relative text-[11px] xl:text-[12.5px] 2xl:text-[13px] font-extrabold text-slate-600 hover:text-[#1e2738] flex items-center gap-1.5 uppercase tracking-wider transition-colors whitespace-nowrap text-center leading-tight after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#1e2738] after:transition-all after:duration-300 group-hover:after:w-full"
                  >
                    {renderFormattedLabel(item)}
                    {hasDropdown && (
                      <svg className="w-3 h-3 xl:w-3.5 xl:h-3.5 text-slate-800 group-hover:text-[#1e2738] transition-transform group-hover:rotate-180 shrink-0 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>

                  {/* DROPDOWN PANEL */}
                  {hasDropdown && (
                    <div className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 ${isTwoColumn ? SPLIT_PANEL_WIDTH : SIMPLE_PANEL_WIDTH} opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out z-50`}>
                      <div className="no-scrollbar bg-white border border-slate-100 rounded-xl shadow-2xl p-3 max-h-[70vh] overflow-y-auto overscroll-contain">
                        {isPartners ? (
                          /* Our Partners: 2-Column Alignment WITH Bullet Pointers */
                          <div className="grid grid-cols-2 items-start divide-x divide-slate-100">
                            <div className="flex flex-col gap-1 pr-2">
                              {leftItems.map((dropItem, idx) => renderPartnerLinkWithDot(dropItem, idx))}
                            </div>
                            <div className="flex flex-col gap-1 pl-2">
                              {rightItems.map((dropItem, idx) => renderPartnerLinkWithDot(dropItem, idx))}
                            </div>
                          </div>
                        ) : isTwoColumn ? (
                          /* Two Column Grid with SVG Icons */
                          <div className="grid grid-cols-2 items-start divide-x divide-slate-100">
                            <div className="flex flex-col gap-1 pr-2">
                              {leftItems.map((dropItem, idx) => renderDropdownLinkWithIcon(dropItem, idx, item.path))}
                            </div>
                            <div className="flex flex-col gap-1 pl-2">
                              {rightItems.map((dropItem, idx) => renderDropdownLinkWithIcon(dropItem, idx, item.path))}
                            </div>
                          </div>
                        ) : (
                          /* Single Column Grid with SVG Icons (e.g. Projects & Services) */
                          <div className="flex flex-col gap-1">
                            {dropdownItems.map((dropItem, idx) => renderDropdownLinkWithIcon(dropItem, idx, item.path))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* CTA BUTTON */}
          {SHOW_CTA_BUTTON && (
          <div className="hidden lg:flex items-center shrink-0 pl-2">
            <Link
              to={navData.cta_button?.url || '/shop'}
              className="bg-[#2d4ea8] hover:bg-[#155CFB] text-white text-[11px] xl:text-xs font-extrabold px-4 xl:px-6 py-2.5 xl:py-3 rounded-lg shadow-sm transition-all inline-block uppercase tracking-wider whitespace-nowrap"
            >
              {navData.cta_button?.text || 'Shop with Us'}
            </Link>
          </div>
          )}

          {/* MOBILE TOGGLE BUTTON */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-slate-700"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU PANEL */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-1">
          {visibleNavLinks.map((item) => {
            const dropdownItems = getDropdownItems(item.dropdown_items);
            const hasChildren = item.has_dropdown && dropdownItems.length > 0;
            const isOpen = openMobileDropdown === item.id;
            const isPartners = item.path === '/partners';

            return (
              <div key={`mob-${item.id || item.path}`} className="border-b border-slate-100 last:border-0">
                <div className="w-full flex items-center justify-between py-3.5">
                  <button
                    type="button"
                    onClick={() => handleMobileTextClick(item)}
                    className="text-sm font-bold text-slate-800 uppercase tracking-wide text-left flex-1 select-none"
                  >
                    {getItemRawString(item).replace('\n', ' ')}
                  </button>

                  {hasChildren && (
                    <button
                      type="button"
                      onClick={(e) => handleArrowToggle(e, item.id)}
                      className="p-2 -mr-2 text-slate-400 hover:text-[#1e2738] focus:outline-none"
                      aria-label={`Toggle ${getItemRawString(item)} dropdown`}
                    >
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#1e2738]' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>

                {hasChildren && isOpen && (
                  <div className="no-scrollbar pb-3 pl-4 space-y-1 bg-slate-50/50 rounded-lg mb-2 p-2 max-h-64 overflow-y-auto overscroll-contain">
                    {dropdownItems.map((dropItem, idx) => (
                      <Link
                        key={`mob-item-${dropItem.id || dropItem.path || idx}`}
                        to={dropItem.path || '#'}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 py-2 px-3 text-xs font-semibold text-slate-600 hover:text-[#1e2738] hover:bg-slate-50 rounded transition-colors"
                      >
                        {isPartners ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        ) : (
                          renderDropdownIcon(dropItem)
                        )}
                        <span>{getItemRawString(dropItem)}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {SHOW_CTA_BUTTON && (
          <Link
            to={navData.cta_button?.url || '/shop'}
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-center bg-[#155CFB] hover:bg-[#1E3A8A] text-white text-xs font-bold px-6 py-3 rounded-lg shadow-sm mt-3 uppercase tracking-wider"
          >
            {navData.cta_button?.text || 'Shop with Us'}
          </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;