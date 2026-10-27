import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {

  // ─────────────────────────────────────────────────
  // DATA DEFINITIONS
  // ─────────────────────────────────────────────────

  // 1. GLOBAL LAYOUT SETTINGS
  const globalSettings = [
    { title: 'Navbar Settings', path: '/admin/navbar', desc: 'Manage site navigation links, header logo, and action buttons.' },
    { title: 'Footer Settings', path: '/admin/footer', desc: 'Edit footer links, copyright text, contact info, and social links.' },
  ];

  // 2. HOME PAGE SECTIONS
  const homeSections = [
    { title: 'Hero Section', path: '/admin/hero', desc: 'Edit main headline, subtext, and primary call-to-action buttons.' },
    { title: 'About Section', path: '/admin/about', desc: 'Manage company introduction content and summary details.' },
    { title: 'Mission & Vision', path: '/admin/mission-vision', desc: 'Update core company values, mission statement, and vision.' },
    { title: 'Products Section', path: '/admin/products', desc: 'Manage product features, badges, and showcase items.' },
    { title: 'Solutions Section', path: '/admin/solution', desc: 'Edit turn-key modules, service cards, and bottom CTA banner.' },
    { title: 'Partners Section', path: '/admin/partners', desc: 'Update partner logos, client lists, and trust badges.' },
  ];

  // 3. ABOUT PAGE
  const aboutPageSections = [
    { title: 'Header Banner', path: '/admin/about/section', desc: 'Manage top hero banner, main title, and background graphics.' },
    { title: 'Our Story', path: '/admin/about/story', desc: 'Edit founding timeline, company narrative, and history copy.' },
    { title: 'Specialized Divisions', path: '/admin/specialized/Divisions', desc: 'Manage engineering and industrial division cards.' },
  ];

  // 4. PRODUCTS PAGE
  const productsPageSections = [
    { title: 'Product Hero', path: '/admin/products/hero', desc: 'Customize title, subtitle, and top banner background image.' },
    { title: 'Product Overview', path: '/admin/products/overview', desc: 'Edit division paragraph summaries and introductory content.' },
    { title: 'Product Categories', path: '/admin/products/categories', desc: 'Manage division category cards, icons, links, and details.' },
  ];

  // 5. MOISTURE (Michell) PRODUCT PAGE
  const moistureSections = [
    { title: 'Moisture Banner', path: '/admin/products/moisture-banner', desc: 'Manage hero banner title, tagline, and background image.' },
    { title: 'Moisture Overview', path: '/admin/products/moisture-overview', desc: 'Edit overview text, featured card, and section graphic.' },
    { title: 'Moisture Details', path: '/admin/products/moisture-details', desc: 'Configure product range cards and key specification details.' },
    { title: 'Moisture Capabilities', path: '/admin/products/moisture-capbilities', desc: 'Manage engineering capabilities text and feature highlights.' },
    { title: 'Moisture CTA', path: '/admin/products/moisture-cta', desc: 'Configure call-to-action buttons and enquiry copy.' },
  ];

  // 6. FLAME GAS PRODUCT PAGE
  const flameGasSections = [
    { title: 'Flame Gas Banner', path: '/admin/products/flamegas-banner', desc: 'Manage hero banner title, tagline, and background image.' },
    { title: 'Flame Gas Overview', path: '/admin/products/flamegas-overview', desc: 'Edit overview text and section introductory content.' },
    { title: 'Flame Gas Applications', path: '/admin/products/flamegas-application', desc: 'Manage application sector cards and use-case details.' },
    { title: 'Flame Gas Capabilities', path: '/admin/products/flamegas-capbilities', desc: 'Configure capabilities text and feature highlights.' },
  ];

  // 7. VESDA PRODUCT PAGE
  const vesdaSections = [
    { title: 'VESDA Banner', path: '/admin/products/vesda-banner', desc: 'Manage hero banner title, tagline, and background image.' },
    { title: 'VESDA Overview', path: '/admin/products/vesda-overview', desc: 'Edit overview text and introductory content.' },
    { title: 'VESDA Applications', path: '/admin/products/vesda-application', desc: 'Manage application sector cards and use-case descriptions.' },
    { title: 'VESDA Capabilities', path: '/admin/products/vesda-capbilities', desc: 'Configure capabilities and feature highlight content.' },
  ];

  // 8. PROCESS ANALYZERS PRODUCT PAGE
  const processAnalyzerSections = [
    { title: 'Process Analyzers Banner', path: '/admin/products/process-banner', desc: 'Manage hero banner title, tagline, and background image.' },
    { title: 'Process Analyzers Overview', path: '/admin/products/process-overview', desc: 'Edit overview text and introductory content.' },
    { title: 'Process Analyzers Applications', path: '/admin/products/process-application', desc: 'Manage application sector cards and use-case descriptions.' },
    { title: 'Process Analyzers Capabilities', path: '/admin/products/process-capbilities', desc: 'Configure capabilities and feature highlight content.' },
  ];

  // 9. PROCESS INSTRUMENTATION PRODUCT PAGE
  const processInstSections = [
    { title: 'Process Instrumentation Banner', path: '/admin/products/processinst-banner', desc: 'Manage hero banner title, tagline, and background image.' },
    { title: 'Process Instrumentation Overview', path: '/admin/products/processinst-overview', desc: 'Edit overview text and introductory content.' },
    { title: 'Process Instrumentation Applications', path: '/admin/products/processinst-application', desc: 'Manage application sector cards and use-case descriptions.' },
    { title: 'Process Instrumentation Capabilities', path: '/admin/products/processinst-capbilities', desc: 'Configure capabilities and feature highlight content.' },
  ];

  // 10. UPSTREAM INSTRUMENTATION PRODUCT PAGE
  const upstreamSections = [
    { title: 'Upstream Banner', path: '/admin/products/upstream-banner', desc: 'Manage hero banner title, tagline, and background image.' },
    { title: 'Upstream Overview', path: '/admin/products/upstream-overview', desc: 'Edit overview text and introductory content.' },
    { title: 'Upstream Applications', path: '/admin/products/upstream-application', desc: 'Manage application sector cards and use-case descriptions.' },
    { title: 'Upstream Capabilities', path: '/admin/products/upstream-capbilities', desc: 'Configure capabilities and feature highlight content.' },
  ];

  // 11. BEACONS & SOUNDERS PRODUCT PAGE
  const beaconsSections = [
    { title: 'Beacons & Sounders Banner', path: '/admin/products/beacons-banner', desc: 'Manage hero banner title, tagline, and background image.' },
    { title: 'Beacons & Sounders Overview', path: '/admin/products/beacons-overview', desc: 'Edit overview text and introductory content.' },
    { title: 'Beacons & Sounders Applications', path: '/admin/products/beacons-application', desc: 'Manage application sector cards and use-case descriptions.' },
    { title: 'Beacons & Sounders Capabilities', path: '/admin/products/beacons-capbilities', desc: 'Configure capabilities and feature highlight content.' },
  ];

  // 12. GENERAL PARTNERS PAGE
  // const partnersPageSections = [
  //   { title: 'Partners Hero', path: '/admin/partners/hero', desc: 'Manage top banner background image and header copy.' },
  //   { title: 'Partners Overview', path: '/admin/partners/overview', desc: 'Edit network overview text and global presence narrative.' },
  //   { title: 'Categorized Partners', path: '/admin/partners/categorizedpartners', desc: 'Organize brand logos, manufacturer cards, and website URLs.' },
  //   { title: 'Partners CTA', path: '/admin/partners/cta', desc: 'Configure call-to-action banner for new partnership inquiries.' },
  // ];

  // ───────── INDIVIDUAL PARTNER ROUTES (13–32) — COMMENTED OUT ─────────
  /*
  // 13. AGC INSTRUMENTS
  const agcSections = [
    { title: 'AGC Banner', path: '/admin/partners/agc-banner', desc: 'Manage top hero banner, main title, and background graphics.' },
    { title: 'AGC Overview', path: '/admin/partners/agc-overview', desc: 'Edit company overview text and featured content.' },
    { title: 'AGC Solutions', path: '/admin/partners/agc-solutions', desc: 'Manage engineering solutions and product support sections.' },
  ];

  // 14. AKAY INDUSTRIES
  const akaySections = [
    { title: 'AKAY Banner', path: '/admin/partners/akay-Industries', desc: 'Manage main header title, tagline, and background image asset.' },
    { title: 'AKAY Overview', path: '/admin/partners/akay-overview', desc: 'Edit section title, descriptive paragraph, and featured card.' },
    { title: 'AKAY Details', path: '/admin/partners/akay-details', desc: 'Configure product range cards, key sectors, and specifications.' },
  ];

  // 15. AVEVA SOLUTIONS
  const avevaSections = [
    { title: 'AVEVA Banner', path: '/admin/partners/aveva-banner', desc: 'Manage main header title, tagline, and background image asset.' },
    { title: 'AVEVA Overview', path: '/admin/partners/aveva-overview', desc: 'Edit section title, descriptive paragraph, and featured card.' },
    { title: 'AVEVA Details', path: '/admin/partners/aveva-details', desc: 'Configure product range cards, key sectors, and specifications.' },
  ];

  // 16. BARTEC
  const bartecSections = [
    { title: 'Bartec Banner', path: '/admin/partners/bartec-banner', desc: 'Manage main header title, tagline, and background image asset.' },
    { title: 'Bartec Overview', path: '/admin/partners/bartec-overview', desc: 'Edit section title, descriptive paragraph, and featured card.' },
    { title: 'Bartec Details', path: '/admin/partners/bartec-details', desc: 'Configure product range cards, key sectors, and specifications.' },
  ];

  // 17. EATON MEDC
  const eatonSections = [
    { title: 'Eaton Banner', path: '/admin/partners/eaton-banner', desc: 'Manage main header title, tagline, and background image asset.' },
    { title: 'Eaton Overview', path: '/admin/partners/eaton-overview', desc: 'Edit section title, descriptive paragraph, and featured card.' },
    { title: 'Eaton Details', path: '/admin/partners/eaton-details', desc: 'Configure product range cards, key sectors, and specifications.' },
  ];

  // 18. ECO PHYSICS
  const ecoPhysicsSections = [
    { title: 'Eco Physics Banner', path: '/admin/partners/ecophysics-banner', desc: 'Manage main header title, tagline, and background image asset.' },
    { title: 'Eco Physics Overview', path: '/admin/partners/ecophysics-overview', desc: 'Edit section title, descriptive paragraph, and featured card.' },
    { title: 'Eco Physics Precision', path: '/admin/partners/ecophysics-precision', desc: 'Configure precision measurement content and product specs.' },
    { title: 'Eco Range & Support', path: '/admin/partners/ecophysics-rangesupport', desc: 'Manage range, support, and service section content.' },
  ];

  // 19. EMERSON
  const emersonSections = [
    { title: 'Emerson Banner', path: '/admin/partners/emerson-banner', desc: 'Manage main header title, tagline, and background image asset.' },
    { title: 'Emerson Overview', path: '/admin/partners/emerson-overview', desc: 'Edit section title, descriptive paragraph, and featured card.' },
    { title: 'Emerson Details', path: '/admin/partners/emerson-details', desc: 'Configure product range cards, key sectors, and specifications.' },
  ];

  // 20. HACH
  const hachSections = [
    { title: 'HACH Banner', path: '/admin/partners/hach-banner', desc: 'Manage main header title, tagline, and background image asset.' },
    { title: 'HACH Overview', path: '/admin/partners/hach-overview', desc: 'Edit section title, descriptive paragraph, and featured card.' },
    { title: 'HACH Details', path: '/admin/partners/hach-details', desc: 'Configure product range cards, key sectors, and specifications.' },
  ];

  // 21. HITACHI
  const hitachiSections = [
    { title: 'Hitachi Banner', path: '/admin/partners/hitachi-banner', desc: 'Manage main header title, tagline, and background image asset.' },
    { title: 'Hitachi Overview', path: '/admin/partners/hitachi-overview', desc: 'Edit section title, descriptive paragraph, and featured card.' },
    { title: 'Hitachi Details', path: '/admin/partners/hitachi-details', desc: 'Configure precision engineering text, product range cards, and key sectors.' },
  ];

  // 22. HONEYWELL
  const honeywellSections = [
    { title: 'Honeywell Banner', path: '/admin/partners/honeywell-banner', desc: 'Manage main header title, tagline, and background image asset.' },
    { title: 'Honeywell Overview', path: '/admin/partners/honeywell-overview', desc: 'Edit section title, descriptive paragraph, and featured card.' },
    { title: 'Honeywell Details', path: '/admin/partners/honeywell-details', desc: 'Configure product range cards, key sectors, and specifications.' },
  ];

  // 23. HONEYWELL GAS DETECTION
  const honeywellGasSections = [
    { title: 'HW Gas Detection Banner', path: '/admin/partners/honeywellgasdetection-banner', desc: 'Manage main header title, tagline, and background image asset.' },
    { title: 'HW Gas Detection Overview', path: '/admin/partners/honeywellgasdetection-overview', desc: 'Edit section title, descriptive paragraph, and featured card.' },
    { title: 'HW Gas Detection Details', path: '/admin/partners/honeywellgasdetection-details', desc: 'Configure product range cards, key sectors, and specifications.' },
    { title: 'HW Gas Detection Industries', path: '/admin/partners/honeywellgasdetection-industries', desc: 'Manage industry-specific application content and use-cases.' },
  ];

  // 24. HYOSUNG GOODSPRINGS
  const hyosungSections = [
    { title: 'Hyosung Banner', path: '/admin/partners/hyosung-banner', desc: 'Manage main header title, tagline, and background image asset.' },
    { title: 'Hyosung Overview', path: '/admin/partners/hyosung-overview', desc: 'Edit overview title, body text, and featured card graphic.' },
    { title: 'Hyosung Details', path: '/admin/partners/hyosung-details', desc: 'Configure hydraulic performance overview, pump portfolio cards, and common uses.' },
  ];

  // 25. METAL SAMPLES
  const metalSections = [
    { title: 'Metal Samples Banner', path: '/admin/partners/metal-banner', desc: 'Manage main header title, tagline, and background image asset.' },
    { title: 'Metal Samples Overview', path: '/admin/partners/metal-overview', desc: 'Edit section title, descriptive paragraph, and featured card.' },
    { title: 'Metal Samples Details', path: '/admin/partners/metal-details', desc: 'Configure product range cards, key sectors, and specifications.' },
  ];

  // 26. MICHELL INSTRUMENTS
  const michellPartnerSections = [
    { title: 'Michell Banner', path: '/admin/partners/michell-banner', desc: 'Manage main header title, tagline, and background image asset.' },
    { title: 'Michell Overview', path: '/admin/partners/michell-overview', desc: 'Edit section title, descriptive paragraph, and featured card.' },
    { title: 'Michell Details', path: '/admin/partners/michell-details', desc: 'Configure product range cards, key sectors, and specifications.' },
  ];

  // 27. PANORAMA SYSTEM INTEGRATOR
  const panoramaSections = [
    { title: 'Panorama Banner', path: '/admin/partners/panorama-banner', desc: 'Manage main header title, tagline, and background image asset.' },
    { title: 'Panorama Overview', path: '/admin/partners/panorama-overview', desc: 'Edit section title, descriptive paragraph, and featured card.' },
    { title: 'Panorama Details', path: '/admin/partners/panorama-details', desc: 'Configure product range cards, key sectors, and specifications.' },
  ];

  // 28. PROMINENT METERING
  const prominentSections = [
    { title: 'Prominent Banner', path: '/admin/partners/prominent-banner', desc: 'Manage main header title, tagline, and background image asset.' },
    { title: 'Prominent Overview', path: '/admin/partners/prominent-overview', desc: 'Edit section title, descriptive paragraph, and featured card.' },
    { title: 'Prominent Details', path: '/admin/partners/prominent-details', desc: 'Configure product range cards, key sectors, and specifications.' },
  ];

  // 29. RASILVER
  const rasilverSections = [
    { title: 'Rasilver Banner', path: '/admin/partners/rasilver-banner', desc: 'Manage main header title, tagline, and background image asset.' },
    { title: 'Rasilver Overview', path: '/admin/partners/rasilver-overview', desc: 'Edit section title, descriptive paragraph, and featured card.' },
    { title: 'Rasilver Details', path: '/admin/partners/rasilver-details', desc: 'Configure product range cards, key sectors, and specifications.' },
  ];

  // 30. TESTO
  const testoSections = [
    { title: 'Testo Banner', path: '/admin/partners/testo-banner', desc: 'Manage main header title, tagline, and background image asset.' },
    { title: 'Testo Overview', path: '/admin/partners/testo-overview', desc: 'Edit section title, descriptive paragraph, and featured card.' },
    { title: 'Testo Details', path: '/admin/partners/testo-details', desc: 'Configure product range cards, key sectors, and specifications.' },
  ];

  // 31. TSI
  const tsiSections = [
    { title: 'TSI Banner', path: '/admin/partners/tsi-banner', desc: 'Manage main header title, tagline, and background image asset.' },
    { title: 'TSI Overview', path: '/admin/partners/tsi-overview', desc: 'Edit section title, descriptive paragraph, and featured card.' },
    { title: 'TSI Details', path: '/admin/partners/tsi-details', desc: 'Configure product range cards, key sectors, and specifications.' },
  ];

  // 32. VOGELSANG
  const vogelsangSections = [
    { title: 'Vogelsang Banner', path: '/admin/partners/vogelsang-banner', desc: 'Manage main header title, tagline, and background image asset.' },
    { title: 'Vogelsang Overview', path: '/admin/partners/vogelsang-overview', desc: 'Edit section title, descriptive paragraph, and featured card.' },
    { title: 'Vogelsang Details', path: '/admin/partners/vogelsang-details', desc: 'Configure product range cards, key sectors, and specifications.' },
  ];
  */
  // ───────── END COMMENTED PARTNER ROUTES ─────────

  // 33. CONTACT PAGE
  const contactPageSections = [
    { title: 'Contact Hero', path: '/admin/contact/hero', desc: 'Edit header title, subtitle, and contact banner background.' },
    { title: 'Contact Section', path: '/admin/contact/section', desc: 'Manage form field labels, locations, email, phone, and social links.' },
    { title: 'Contact Maps', path: '/admin/contact/maps', desc: 'Manage interactive map links, office locations, and social links.' },
  ];

  // ─────────────────────────────────────────────────
  // RENDER HELPERS
  // ─────────────────────────────────────────────────

  const renderCardGrid = (items, badgeText, badgeBg) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.path}
          className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between hover:border-slate-400 transition-all"
        >
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
              <span className={`${badgeBg} text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                {item.badge || badgeText}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
          <div>
            <Link
              to={item.path}
              className="inline-block text-xs font-bold text-white bg-[#1e2738] hover:bg-[#151c28] px-4 py-2.5 rounded-lg transition-all w-full text-center cursor-pointer"
            >
              Edit Section &rarr;
            </Link>
          </div>
        </div>
      ))}
    </div>
  );

  // Each section group definition for easy mapping
  const sections = [
    { num: 1, emoji: '🌐', label: 'Global Layout Settings', badge: 'Global', bg: 'bg-emerald-50 text-emerald-600', items: globalSettings },
    { num: 2, emoji: '🏠', label: 'Home Page Sections', badge: 'Home', bg: 'bg-blue-50 text-blue-600', items: homeSections },
    { num: 3, emoji: 'ℹ️', label: 'About Page', badge: 'About Page', bg: 'bg-sky-50 text-sky-600', items: aboutPageSections },
    { num: 4, emoji: '📦', label: 'Products Page', badge: 'Products Page', bg: 'bg-indigo-50 text-indigo-600', items: productsPageSections },
    { num: 5, emoji: '💧', label: 'Moisture / Michell (Product)', badge: 'Product', bg: 'bg-cyan-50 text-cyan-600', items: moistureSections },
    { num: 6, emoji: '🔥', label: 'Flame Gas Detection (Product)', badge: 'Product', bg: 'bg-orange-50 text-orange-600', items: flameGasSections },
    { num: 7, emoji: '🚨', label: 'VESDA (Product)', badge: 'Product', bg: 'bg-red-50 text-red-600', items: vesdaSections },
    { num: 8, emoji: '🧪', label: 'Process Analyzers (Product)', badge: 'Product', bg: 'bg-purple-50 text-purple-600', items: processAnalyzerSections },
    { num: 9, emoji: '🔩', label: 'Process Instrumentation (Product)', badge: 'Product', bg: 'bg-violet-50 text-violet-600', items: processInstSections },
    { num: 10, emoji: '⬆️', label: 'Upstream Instrumentation (Product)', badge: 'Product', bg: 'bg-teal-50 text-teal-600', items: upstreamSections },
    { num: 11, emoji: '🔔', label: 'Beacons & Sounders (Product)', badge: 'Product', bg: 'bg-yellow-50 text-yellow-700', items: beaconsSections },
    // { num: 12, emoji: '🤝', label: 'Partners Page', badge: 'Partners Page', bg: 'bg-amber-50 text-amber-600', items: partnersPageSections },

    // ───────── INDIVIDUAL PARTNER ROUTES (13–32) — COMMENTED OUT ─────────
    // { num: 13, emoji: '🏷️', label: 'AGC Instruments', badge: 'Partner', bg: 'bg-lime-50 text-lime-600', items: agcSections },
    // { num: 14, emoji: '⚙️', label: 'AKAY Industries', badge: 'Partner', bg: 'bg-stone-50 text-stone-600', items: akaySections },
    // { num: 15, emoji: '💻', label: 'AVEVA Solutions', badge: 'Partner', bg: 'bg-blue-50 text-blue-700', items: avevaSections },
    // { num: 16, emoji: '🛡️', label: 'Bartec', badge: 'Partner', bg: 'bg-slate-100 text-slate-600', items: bartecSections },
    // { num: 17, emoji: '⚡', label: 'Eaton MEDC', badge: 'Partner', bg: 'bg-yellow-50 text-yellow-600', items: eatonSections },
    // { num: 18, emoji: '🔬', label: 'Eco Physics', badge: 'Partner', bg: 'bg-green-50 text-green-600', items: ecoPhysicsSections },
    // { num: 19, emoji: '🏭', label: 'Emerson', badge: 'Partner', bg: 'bg-gray-50 text-gray-600', items: emersonSections },
    // { num: 20, emoji: '🧫', label: 'HACH', badge: 'Partner', bg: 'bg-teal-50 text-teal-700', items: hachSections },
    // { num: 21, emoji: '🏭', label: 'Hitachi', badge: 'Partner', bg: 'bg-red-50 text-red-600', items: hitachiSections },
    // { num: 22, emoji: '🌡️', label: 'Honeywell', badge: 'Partner', bg: 'bg-rose-50 text-rose-600', items: honeywellSections },
    // { num: 23, emoji: '🛢️', label: 'Honeywell Gas Detection', badge: 'Partner', bg: 'bg-pink-50 text-pink-600', items: honeywellGasSections },
    // { num: 24, emoji: '💧', label: 'Hyosung Goodsprings', badge: 'Partner', bg: 'bg-cyan-50 text-cyan-700', items: hyosungSections },
    // { num: 25, emoji: '🛠️', label: 'Metal Samples', badge: 'Partner', bg: 'bg-zinc-100 text-zinc-600', items: metalSections },
    // { num: 26, emoji: '🌡️', label: 'Michell Instruments', badge: 'Partner', bg: 'bg-indigo-50 text-indigo-700', items: michellPartnerSections },
    // { num: 27, emoji: '🌐', label: 'Panorama System Integrator', badge: 'Partner', bg: 'bg-sky-50 text-sky-700', items: panoramaSections },
    // { num: 28, emoji: '⚗️', label: 'Prominent Metering', badge: 'Partner', bg: 'bg-fuchsia-50 text-fuchsia-600', items: prominentSections },
    // { num: 29, emoji: '🏗️', label: 'Rasilver', badge: 'Partner', bg: 'bg-orange-50 text-orange-700', items: rasilverSections },
    // { num: 30, emoji: '🔬', label: 'Testo', badge: 'Partner', bg: 'bg-emerald-50 text-emerald-700', items: testoSections },
    // { num: 31, emoji: '💨', label: 'TSI', badge: 'Partner', bg: 'bg-violet-50 text-violet-700', items: tsiSections },
    // { num: 32, emoji: '🔧', label: 'Vogelsang', badge: 'Partner', bg: 'bg-amber-50 text-amber-700', items: vogelsangSections },
    // ───────── END COMMENTED PARTNER ROUTES ─────────

    { num: 12, emoji: '📞', label: 'Contact Page', badge: 'Contact Page', bg: 'bg-rose-50 text-rose-600', items: contactPageSections },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto p-2">

      {/* HEADER */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-xs text-slate-500 mt-1">
          Welcome back! All page content sections are listed below in order — {sections.length} sections total.
        </p>
      </div>

      {/* ALL SECTIONS */}
      {sections.map(({ num, emoji, label, badge, bg, items }) => (
        <div key={num} className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            {num}. {emoji} {label}
          </h2>
          {renderCardGrid(items, badge, bg)}
        </div>
      ))}

    </div>
  );
};

export default AdminDashboard;