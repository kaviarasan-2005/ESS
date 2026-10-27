// useAdminNav.js — All sidebar accordion state and navigation data
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// ── Nav data (static, defined outside component so never re-created) ──────────
export const NAV_GROUPS = [
  {
    key: 'home',
    label: 'Home Page',
    icon: '🏠',
    paths: [
      { label: 'Hero Section', path: '/admin/hero' },
      { label: 'About Section', path: '/admin/about' },
      { label: 'Mission & Vision', path: '/admin/mission-vision' },
      { label: 'Products Section', path: '/admin/products' },
      { label: 'Solutions Section', path: '/admin/solution' },
      { label: 'Partners Section', path: '/admin/partners' },
    ],
  },
  {
    key: 'about',
    label: 'About Page',
    icon: 'ℹ️',
    paths: [
      { label: 'Header Banner', path: '/admin/about/section' },
      { label: 'Our Story', path: '/admin/about/story' },
      { label: 'Specialized Divisions', path: '/admin/specialized/Divisions' },
    ],
  },
  {
    key: 'products',
    label: 'Products Page',
    icon: '📦',
    paths: [
      { label: 'Product Hero', path: '/admin/products/hero' },
      { label: 'Product Overview', path: '/admin/products/overview' },
      { label: 'Product Categories', path: '/admin/products/categories' },
    ],
  },
  // {
  //   key: 'partners',
  //   label: 'Partners Page',
  //   icon: '🤝',
  //   paths: [
  //     { label: 'Partners Hero', path: '/admin/partners/hero' },
  //     { label: 'Partners Overview', path: '/admin/partners/overview' },
  //     { label: 'Categorized Partners', path: '/admin/partners/categorizedpartners' },
  //     { label: 'Partners CTA', path: '/admin/partners/cta' },
  //   ],
  // },
  // {
  //   key: 'agc',
  //   label: 'AGC Instruments',
  //   icon: '🏷️',
  //   paths: [
  //     { label: 'AGC Banner', path: '/admin/partners/agc-banner' },
  //     { label: 'AGC Overview', path: '/admin/partners/agc-overview' },
  //     { label: 'AGC Solutions', path: '/admin/partners/agc-solutions' },
  //   ],
  // },
  // {
  //   key: 'akay',
  //   label: 'AKAY Industries',
  //   icon: '⚙️',
  //   paths: [
  //     { label: 'AKAY Banner', path: '/admin/partners/akay-Industries' },
  //     { label: 'AKAY Overview', path: '/admin/partners/akay-overview' },
  //     { label: 'AKAY Details', path: '/admin/partners/akay-details' },
  //   ],
  // },
  // {
  //   key: 'aveva',
  //   label: 'AVEVA Solutions',
  //   icon: '💻',
  //   paths: [
  //     { label: 'AVEVA Banner', path: '/admin/partners/aveva-banner' },
  //     { label: 'AVEVA Overview', path: '/admin/partners/aveva-overview' },
  //     { label: 'AVEVA Details', path: '/admin/partners/aveva-details' },
  //   ],
  // },
  // {
  //   key: 'bartec',
  //   label: 'Bartec',
  //   icon: '🛡️',
  //   paths: [
  //     { label: 'Bartec Banner', path: '/admin/partners/bartec-banner' },
  //     { label: 'Bartec Overview', path: '/admin/partners/bartec-overview' },
  //     { label: 'Bartec Details', path: '/admin/partners/bartec-details' },
  //   ],
  // },
  // {
  //   key: 'eaton',
  //   label: 'Eaton MEDC',
  //   icon: '⚡',
  //   paths: [
  //     { label: 'Eaton Banner', path: '/admin/partners/eaton-banner' },
  //     { label: 'Eaton Overview', path: '/admin/partners/eaton-overview' },
  //     { label: 'Eaton Details', path: '/admin/partners/eaton-details' },
  //   ],
  // },
  // {
  //   key: 'ecophysics',
  //   label: 'Eco Physics',
  //   icon: '🔬',
  //   paths: [
  //     { label: 'Eco Physics Banner', path: '/admin/partners/ecophysics-banner' },
  //     { label: 'Eco Physics Overview', path: '/admin/partners/ecophysics-overview' },
  //     { label: 'Eco Range Support', path: '/admin/partners/ecophysics-rangesupport' },
  //   ],
  // },
  // {
  //   key: 'emerson',
  //   label: 'Emerson',
  //   icon: '🏭',
  //   paths: [
  //     { label: 'Emerson Banner', path: '/admin/partners/emerson-banner' },
  //     { label: 'Emerson Overview', path: '/admin/partners/emerson-overview' },
  //     { label: 'Emerson Details', path: '/admin/partners/emerson-details' },
  //   ],
  // },
  // {
  //   key: 'hach',
  //   label: 'HACH',
  //   icon: '🧪',
  //   paths: [
  //     { label: 'Hach Banner', path: '/admin/partners/hach-banner' },
  //     { label: 'Hach Overview', path: '/admin/partners/hach-overview' },
  //     { label: 'Hach Details', path: '/admin/partners/hach-details' },
  //   ],
  // },
  // {
  //   key: 'hitachi',
  //   label: 'Hitachi',
  //   icon: '🏭',
  //   paths: [
  //     { label: 'Hitachi Banner', path: '/admin/partners/hitachi-banner' },
  //     { label: 'Hitachi Overview', path: '/admin/partners/hitachi-overview' },
  //     { label: 'Hitachi Details', path: '/admin/partners/hitachi-details' },
  //   ],
  // },
  // {
  //   key: 'hyosung',
  //   label: 'Hyosung',
  //   icon: '💧',
  //   paths: [
  //     { label: 'Hyosung Banner', path: '/admin/partners/hyosung-banner' },
  //     { label: 'Hyosung Overview', path: '/admin/partners/hyosung-overview' },
  //     { label: 'Hyosung Details', path: '/admin/partners/hyosung-details' },
  //   ],
  // },
  {
    key: 'michell',
    label: 'Moisture',
    icon: '💧',
    paths: [
      { label: 'Moisture Banner', path: '/admin/products/moisture-banner' },
      { label: 'Moisture Overview', path: '/admin/products/moisture-overview' },
      { label: 'Moisture Details', path: '/admin/products/moisture-details' },
      { label: 'Moisture Capbilities', path: '/admin/products/moisture-capbilities' },
      { label: 'Moisture CTA', path: '/admin/products/moisture-cta' },


    ],
  },
  // {
  //   key: 'honeywell',
  //   label: 'Honeywell Page',
  //   icon: '⚙️',
  //   paths: [
  //     { label: 'Honeywell Banner', path: '/admin/partners/honeywell-banner' },
  //     { label: 'Honeywell Overview ', path: '/admin/partners/honeywell-overview' },
  //     { label: 'Honeywell Details', path: '/admin/partners/honeywell-details' },
  //   ],
  // },
  // {
  //   key: 'honeywellgasdetection',
  //   label: 'HoneywellGas Page',
  //   icon: '🛡️',
  //   paths: [
  //     { label: 'HoneywellGas Banner', path: '/admin/partners/honeywellgasdetection-banner' },
  //     { label: 'HoneywellGas Overview ', path: '/admin/partners/honeywellgasdetection-overview' },
  //     { label: 'Honeywell Details', path: '/admin/partners/honeywellgasdetection-details' },
  //     { label: 'Honeywell Industries', path: '/admin/partners/honeywellgasdetection-industries' },

  //   ],
  // },

  // {
  //   key: 'metalsamples',
  //   label: 'Mental Samples ',
  //   icon: '🛠️',
  //   paths: [
  //     { label: 'Mental Banner', path: '/admin/partners/metal-banner' },
  //     { label: 'Metal Overview ', path: '/admin/partners/metal-overview' },
  //     { label: 'Metal Details', path: '/admin/partners/metal-details' },
  //   ],
  // },

  // {
  //   key: 'michellinstruments',
  //   label: 'Michell Instruments ',
  //   icon: '🌡️',
  //   paths: [
  //     { label: 'Michell Banner', path: '/admin/partners/michell-banner' },
  //     { label: 'Michell Overview ', path: '/admin/partners/michell-overview' },
  //     { label: 'Michell Details', path: '/admin/partners/michell-details' },
  //   ],
  // },

  // {
  //   key: 'Panorama System Integrator',
  //   label: 'Panorama System ',
  //   icon: '🌐',
  //   paths: [
  //     { label: 'Panorama Banner', path: '/admin/partners/panorama-banner' },
  //     { label: 'Panorama Overview ', path: '/admin/partners/panorama-overview' },
  //     { label: 'Panorama Details', path: '/admin/partners/panorama-details' },
  //   ],
  // },

  // {
  //   key: 'Prominent Metering',
  //   label: 'Prominent',
  //   icon: '⚗️',
  //   paths: [
  //     { label: 'Prominent Banner', path: '/admin/partners/prominent-banner' },
  //     { label: 'Prominent Overview ', path: '/admin/partners/prominent-overview' },
  //     { label: 'Prominent Details', path: '/admin/partners/prominent-details' },
  //   ],
  // },

  // {
  //   key: 'RASilver System',
  //   label: 'Rasilver',
  //   icon: '🏭',
  //   paths: [
  //     { label: 'Rasilver Banner', path: '/admin/partners/rasilver-banner' },
  //     { label: 'Rasilver Overview ', path: '/admin/partners/rasilver-overview' },
  //     { label: 'Rasilver Details', path: '/admin/partners/rasilver-details' },
  //   ],
  // },

  // {
  //   key: 'Testo',
  //   label: 'Testo',
  //   icon: '🔬',
  //   paths: [
  //     { label: 'Testo Banner', path: '/admin/partners/testo-banner' },
  //     { label: 'Testo Overview ', path: '/admin/partners/testo-overview' },
  //     { label: 'Testo Details', path: '/admin/partners/testo-details' },
  //   ],
  // },


  // {
  //   key: 'Tsi',
  //   label: 'TSI',
  //   icon: '🌡️',
  //   paths: [
  //     { label: 'Tsi Banner', path: '/admin/partners/tsi-banner' },
  //     { label: 'Tsi Overview ', path: '/admin/partners/tsi-overview' },
  //     { label: 'Tsi Details', path: '/admin/partners/tsi-details' },
  //   ],
  // },
  // {
  //   key: 'Vogelsang',
  //   label: 'Vogelsang',
  //   icon: '🔧',
  //   paths: [
  //     { label: 'Vogelsang Banner', path: '/admin/partners/vogelsang-banner' },
  //     { label: 'Vogelsang Overview ', path: '/admin/partners/vogelsang-overview' },
  //     { label: 'Vogelsang Details', path: '/admin/partners/vogelsang-details' },
  //   ],
  // },
  {
    key: 'FlameGas',
    label: 'Flamegas',
    icon: '🔥',
    paths: [
      { label: 'Flamegas Banner', path: '/admin/products/flamegas-banner' },
      { label: 'Flamegas Overview ', path: '/admin/products/flamegas-overview' },
      { label: 'Flamegas Application', path: '/admin/products/flamegas-application' },
      { label: 'Flamegas Capbilities', path: '/admin/products/flamegas-capbilities' },

    ],
  },
  {
    key: 'VESDA',
    label: 'Vesda',
    icon: '🚨',
    paths: [
      { label: 'Vesda Banner', path: '/admin/products/vesda-banner' },
      { label: 'Vesda Overview ', path: '/admin/products/vesda-overview' },
      { label: 'Vesda Application', path: '/admin/products/vesda-application' },
      { label: 'Vesda Capbilities', path: '/admin/products/vesda-capbilities' },

    ],
  },
  {
    key: 'Process Analyzers',
    label: 'Process Analyzers',
    icon: '🧪',
    paths: [
      { label: 'Process Banner', path: '/admin/products/process-banner' },
      { label: 'Process Overview ', path: '/admin/products/process-overview' },
      { label: 'Process Application', path: '/admin/products/process-application' },
      { label: 'Process Capbilities', path: '/admin/products/process-capbilities' },

    ],
  },

  {
    key: 'Process Instrumentation',
    label: 'Process Instrument',
    icon: '🏭',
    paths: [
      { label: 'Processinst Banner', path: '/admin/products/processinst-banner' },
      { label: 'Processinst Overview ', path: '/admin/products/processinst-overview' },
      { label: 'Processinst Application', path: '/admin/products/processinst-application' },
      { label: 'Processinst Capbilities', path: '/admin/products/processinst-capbilities' },

    ],
  },

  {
    key: 'Upstream Instrumentation',
    label: 'Upstream',
    icon: '🛢️',
    paths: [
      { label: 'Upstream Banner', path: '/admin/products/upstream-banner' },
      { label: 'Upstream Overview ', path: '/admin/products/upstream-overview' },
      { label: 'Upstream Application', path: '/admin/products/upstream-application' },
      { label: 'Upstream Capbilities', path: '/admin/products/upstream-capbilities' },

    ],
  },

  {
    key: 'Beacons Sounders',
    label: 'Beacons Sounders',
    icon: '🔊',
    paths: [
      { label: 'Beacons Banner', path: '/admin/products/beacons-banner' },
      { label: 'Beacons Overview ', path: '/admin/products/beacons-overview' },
      { label: 'Beacons Application', path: '/admin/products/beacons-application' },
      { label: 'Beacons Capbilities', path: '/admin/products/beacons-capbilities' },

    ],
  },
  {
    key: 'Analyzer Systems',
    label: 'Analyzer Systems',
    icon: '⚙️',
    paths: [
      { label: 'Analyzer Banner', path: '/admin/system/analyzer/system-banner' },
      { label: 'Analyzer Overview ', path: '/admin/system/analyzer/system-overview' },
      { label: 'Analyzer Application', path: '/admin/system/analyzer/system-application' },
      { label: 'Analyzer Capbilities', path: '/admin/system/analyzer/system-capbilities' },

    ],
  },

  {
    key: 'Sampling Systems',
    label: 'Sampling Systems',
    icon: '🧪',
    paths: [
      { label: 'Sampling  Banner', path: '/admin/system/samplingy/system-banner' },
      { label: 'Sampling  Overview ', path: '/admin/system/samplingy/system-overview' },
      { label: 'Sampling  Application', path: '/admin/system/samplingy/system-application ' },
      { label: 'Sampling  Capbilities', path: '/admin/system/samplingy/system-capbilities' },

    ],
  },

  {
    key: 'Industrial Automation',
    label: 'Industrial auto',
    icon: '🤖',
    paths: [
      { label: 'Industrial  Banner', path: '/admin/system/industrial/automation-banner' },
      { label: 'Industrial  Overview ', path: '/admin/system/industrial/automation-overview' },
      { label: 'Industrial  Application', path: '/admin/system/industrial/automation-application ' },
      { label: 'Industrial  Capbilities', path: '/admin/system/industrial/automation-capbilities' },

    ],
  },

  {
    key: 'Fire Gas',
    label: 'Fire Gas',
    icon: '🧯',
    paths: [
      { label: 'firegas  Banner', path: '/admin/system/firegas/Control-banner' },
      { label: 'firegas  Overview ', path: '/admin/system/firegas/Control-overview' },
      { label: 'firegas  Application', path: '/admin/system/firegas/Control-application' },
      { label: 'firegas  Capbilities', path: '/admin/system/firegas/Control-capbilities' },

    ],
  },

  {
    key: 'Mass Notification',
    label: 'Mass Notification',
    icon: '🚨',
    paths: [
      { label: 'massnotify Banner', path: '/admin/system/mass/notification-banner' },
      { label: 'massnotify  Overview ', path: '/admin/system/mass/notification-overview' },
      { label: 'massnotify  Application', path: '/admin/system/mass/notification-application' },
      { label: 'massnotify  Capbilities', path: '/admin/system/mass/notification-capbilities' },

    ],
  },

  {
    key: 'Power Backup',
    label: 'Power Backup',
    icon: '⚡',
    paths: [
      { label: 'Power Banner', path: '/admin/system/power/backup-banner' },
      { label: 'Power  Overview ', path: '/admin/system/power/backup-overview' },
      { label: 'Power Application', path: '/admin/system/power/backup-application' },
      { label: 'Power  Capbilities', path: '/admin/system/power/backup-capbilities' },

    ],
  },

  {
    key: 'Emission Monitoring',
    label: 'Emission Monitoring',
    icon: '🌫️',
    paths: [
      { label: 'Emission Banner', path: '/admin/system/emission/monitoring-banner' },
      { label: 'Emission  Overview ', path: '/admin/system/emission/monitoring-overview' },
      { label: 'Emission Application', path: '/admin/system/emission/monitoring-application' },
      { label: 'Emission  Capbilities', path: '/admin/system/emission/monitoring-capbilities' },

    ],
  },

  {
    key: 'System Solutions',
    label: 'System Solutions',
    icon: '⚙️',
    paths: [
      { label: 'System Banner', path: '/admin/system/solutions-banner' },
      { label: 'System Overview ', path: '/admin/system/solutions-overview' },
      { label: 'system Application', path: '/admin/system/solutions-grid' },
      // { label: 'system  Capbilities',    path: '/admin/system/emission/monitoring-capbilities' },

    ],
  },

  {
    key: 'Project Services',
    label: 'Project Services',
    icon: '🏗️',
    paths: [
      { label: 'Project Banner', path: '/admin/project/services-banner' },
      { label: 'Project Overview ', path: '/admin/project/services-overview' },
      { label: 'Project Application', path: '/admin/project/services-grid' },
    ],
  },

  {
    key: 'Capabilities Page',
    label: 'Capabilities Page',
    icon: '🛠️',
    paths: [
      { label: 'Capabilities Banner', path: '/admin/project/capabilities-banner' },
      { label: 'Capabilities Overview ', path: '/admin/project/capabilities-overview' },
      { label: 'Capabilities Execution', path: '/admin/project/capabilities-execution' },
      { label: 'Capabilities WhySaudi', path: '/admin/project/capabilities-whysaudi' },

    ],
  },

  {
    key: 'AfterSales Page',
    label: 'AfterSales Page',
    icon: '🤝',
    paths: [
      { label: 'AfterSales Banner', path: '/admin/project/aftersales-banner' },
      { label: 'AfterSales Overview ', path: '/admin/project/aftersales-overview' },
      { label: 'AfterSales Execution', path: '/admin/project/aftersales-servicescope' },
      { label: 'AfterSales WhySaudi', path: '/admin/project/aftersales-whyus' },

    ],
  },


  {
    key: 'contact',
    label: 'Contact Page',
    icon: '📞',
    paths: [
      { label: 'Contact Hero', path: '/admin/contact/hero' },
      { label: 'Contact Section', path: '/admin/contact/section' },
      { label: 'Contact Maps', path: '/admin/contact/maps' },
    ],
  },
];

export const GLOBAL_SETTINGS = [
  { label: 'Navbar Settings', path: '/admin/navbar' },
  { label: 'Footer Settings', path: '/admin/footer' },
];

// ── Hook ──────────────────────────────────────────────────────────────────────
const useAdminNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Single object for all accordion open states (replaces 16 separate useState)
  const [openGroups, setOpenGroups] = useState({});

  // Auth guard
  useEffect(() => {
    if (!localStorage.getItem('admin_token')) {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  // Auto-expand the accordion matching the current route
  useEffect(() => {
    const matched = NAV_GROUPS.find((g) =>
      g.paths.some((item) => item.path === location.pathname)
    );
    if (matched) {
      setOpenGroups((prev) => ({ ...prev, [matched.key]: true }));
    }
  }, [location.pathname]);

  const toggleGroup = useCallback((key) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const isGroupOpen = useCallback(
    (key) => Boolean(openGroups[key]),
    [openGroups]
  );

  const isGroupActive = useCallback(
    (paths) => paths.some((item) => item.path === location.pathname),
    [location.pathname]
  );

  const handleLogout = useCallback(() => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  }, [navigate]);

  return {
    location,
    openGroups,
    toggleGroup,
    isGroupOpen,
    isGroupActive,
    handleLogout,
  };
};

export default useAdminNav;
