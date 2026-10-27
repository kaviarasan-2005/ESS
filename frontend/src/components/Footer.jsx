import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchFooter } from '../services/footerService';

const DEFAULT_FOOTER = {
  bg_image_url: '',
  logo_url: '',
  description: 'Integrated engineering solutions, life-safety instrumentation, and industrial process control.',
  socials: [
    { id: 'soc-1', platform: 'linkedin', url: 'https://linkedin.com' },
    { id: 'soc-2', platform: 'instagram', url: 'https://instagram.com' }
  ],
  quick_links: [
    { id: 'ql-1', label: 'Home', url: '/' },
    { id: 'ql-2', label: 'About Us', url: '/about' },
    { id: 'ql-3', label: 'Contact Us', url: '/contact' }
  ],
  products: [
    { id: 'fp-1', label: 'Fire & Gas Systems', url: '/products/fire-gas' },
    { id: 'fp-2', label: 'Analytical Instrumentation', url: '/products/analytical' },
    { id: 'fp-3', label: 'Analyzer System Integration', url: '/products/analyzer-integration' },
    { id: 'fp-4', label: 'Industrial Automation', url: '/products/industrial-automation' },
    { id: 'fp-5', label: 'Process Division', url: '/products/process-division' }
  ],
  reach_us: {
    company_name: 'Essential Systems and Services',
    address: 'P.O. Box: 319, Buzwair Commercial Building, Al Mansoura, Zone: 25, Street: 330, Building: 57, Doha, Qatar.',
    email: 'sales@essme.com',
    phone: '+974 4405 9666'
  },
  terms_label: 'Terms & Conditions',
  terms_url: '/terms',
  privacy_label: 'Privacy Policy',
  privacy_url: '/privacy',
  copyright_text: 'Copyright © 2026 Essential Systems and Services - All rights reserved.'
};

const FALLBACK_BG_IMAGE = '';

/* ── Contact icon box style (change colours here once) ── */
const CONTACT_ICON_BOX_CLASS =
  'w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-blue-400 shrink-0 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600';

/* ── SVG icons for the Reach Us column ── */
const IconWrap = ({ children }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const PinIcon = () => (
  <IconWrap>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </IconWrap>
);

const MailIcon = () => (
  <IconWrap>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 7L2 7" />
  </IconWrap>
);

const PhoneIcon = () => (
  <IconWrap>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </IconWrap>
);

// Helper component for crisp vector social media SVG icons
const SocialIcon = ({ platform }) => {
  const normalized = (platform || '').toLowerCase();

  if (normalized === 'linkedin') {
    return (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
      </svg>
    );
  }

  if (normalized === 'instagram') {
    return (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    );
  }

  return <span className="text-xs">★</span>;
};

const Footer = () => {
  const [data, setData] = useState(DEFAULT_FOOTER);

  useEffect(() => {
    fetchFooter()
      .then((res) => {
        // /api/footer returns { success: true, data: { ...footerFields } }
        const footerData = res?.data || res || {};

        if (footerData && Object.keys(footerData).length > 0) {
          setData({
            bg_image_url: footerData.bg_image_url ?? DEFAULT_FOOTER.bg_image_url,
            logo_url: footerData.logo_url ?? DEFAULT_FOOTER.logo_url,
            description: footerData.description ?? DEFAULT_FOOTER.description,
            socials: Array.isArray(footerData.socials) && footerData.socials.length > 0 ? footerData.socials : DEFAULT_FOOTER.socials,
            quick_links: Array.isArray(footerData.quick_links) && footerData.quick_links.length > 0 ? footerData.quick_links : DEFAULT_FOOTER.quick_links,
            products: Array.isArray(footerData.products) && footerData.products.length > 0 ? footerData.products : DEFAULT_FOOTER.products,
            reach_us: { ...DEFAULT_FOOTER.reach_us, ...(footerData.reach_us || {}) },
            terms_label: footerData.terms_label ?? DEFAULT_FOOTER.terms_label,
            terms_url: footerData.terms_url ?? DEFAULT_FOOTER.terms_url,
            privacy_label: footerData.privacy_label ?? DEFAULT_FOOTER.privacy_label,
            privacy_url: footerData.privacy_url ?? DEFAULT_FOOTER.privacy_url,
            copyright_text: footerData.copyright_text ?? DEFAULT_FOOTER.copyright_text
          });
        }
      })
      .catch((err) => console.error('Error fetching Footer content:', err));
  }, []);

  const activeBgImage = data.bg_image_url && data.bg_image_url.trim() !== '' 
    ? data.bg_image_url 
    : FALLBACK_BG_IMAGE;

  return (
    <footer className="bg-[#0b121e] text-slate-300 relative overflow-hidden border-t border-slate-800">

      {/* DYNAMIC BACKGROUND TEXTURE */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none transition-all duration-500"
        style={{ backgroundImage: `url('${activeBgImage}')` }}
      />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10 space-y-12">
        
        {/* TOP MAIN GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* COLUMN 1: BRAND LOGO & DESCRIPTION */}
          <div className="space-y-5">
            <div className="h-14 w-36 bg-white rounded-xl p-2 flex items-center justify-center shadow-md border border-slate-200/20">
              {data.logo_url ? (
                <img src={data.logo_url} alt="ESS Logo" className="w-full h-full object-contain" />
              ) : (
                <span className="text-2xl font-black tracking-wider text-slate-900">ESS</span>
              )}
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              {data.description}
            </p>

            {/* SOCIAL ICONS WITH PROPER SVG LOGOS */}
            {data.socials && data.socials.length > 0 && (
              <div className="flex gap-3 pt-1">
                {data.socials.map((soc, idx) => (
                  <a 
                    key={soc.id || idx}
                    href={soc.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={soc.platform || 'Social Link'}
                    className="w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm border border-slate-700/60 hover:scale-105"
                  >
                    <SocialIcon platform={soc.platform} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                QUICK LINKS
              </h4>
              <div className="w-12 h-0.5 bg-blue-500 rounded" />
            </div>

            <ul className="space-y-3 text-sm sm:text-base font-medium pt-1">
              {data.quick_links.map((link, idx) => (
                <li key={link.id || idx}>
                  <Link to={link.url || '/'} className="hover:text-blue-400 transition-colors block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: PRODUCTS */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                PRODUCTS
              </h4>
              <div className="w-12 h-0.5 bg-blue-500 rounded" />
            </div>

            <ul className="space-y-3 text-sm sm:text-base font-medium pt-1">
              {data.products.map((item, idx) => (
                <li key={item.id || idx} className="flex items-start gap-2.5">
                  <span className="text-xs text-blue-400 mt-1 shrink-0">✔</span>
                  <Link to={item.url || '/products'} className="hover:text-blue-400 transition-colors leading-snug">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: REACH US */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                REACH US
              </h4>
              <div className="w-12 h-0.5 bg-blue-500 rounded" />
            </div>

            <div className="space-y-4 text-sm text-slate-300 font-normal pt-1">
              
              {/* ADDRESS */}
              <div className="flex gap-3 items-start group">
                <div className={CONTACT_ICON_BOX_CLASS}>
                  <PinIcon />
                </div>
                <div className="space-y-1">
                  {data.reach_us.company_name && (
                    <p className="font-bold text-white text-sm sm:text-base leading-snug">{data.reach_us.company_name}</p>
                  )}
                  {data.reach_us.address && (
                    <p className="leading-relaxed text-xs sm:text-sm text-slate-400 whitespace-pre-line">{data.reach_us.address}</p>
                  )}
                </div>
              </div>

              {/* EMAIL */}
              {data.reach_us.email && (
                <div className="flex gap-3 items-center group">
                  <div className={CONTACT_ICON_BOX_CLASS}>
                    <MailIcon />
                  </div>
                  <a href={`mailto:${data.reach_us.email}`} className="hover:text-white transition-colors text-xs sm:text-sm truncate">
                    {data.reach_us.email}
                  </a>
                </div>
              )}

              {/* PHONE */}
              {data.reach_us.phone && (
                <div className="flex gap-3 items-center group">
                  <div className={CONTACT_ICON_BOX_CLASS}>
                    <PhoneIcon />
                  </div>
                  <a href={`tel:${data.reach_us.phone}`} className="hover:text-white transition-colors text-xs sm:text-sm">
                    {data.reach_us.phone}
                  </a>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT & LEGAL BAR */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-400 font-medium text-center sm:text-left">
          
          <div className="flex items-center gap-3">
            <Link to={data.terms_url} className="hover:text-slate-200 transition-colors">
              {data.terms_label}
            </Link>
            <span className="text-slate-600">/</span>
            <Link to={data.privacy_url} className="hover:text-slate-200 transition-colors">
              {data.privacy_label}
            </Link>
          </div>

          <p>{data.copyright_text}</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;