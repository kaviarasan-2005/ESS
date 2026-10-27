import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Users, CircleDot, Layers, Share2, Package, ArrowRight } from 'lucide-react';
import { fetchProductsPage } from '../services/api';

// Icon Map fallback for dynamic Lucide Icon rendering
const ICON_MAP = {
  Flame: Flame,
  Users: Users,
  CircleDot: CircleDot,
  Layers: Layers,
  Share2: Share2,
};

// Animation settings
const CARD_STAGGER_MS = 100; // delay between each card's entrance
const REVEAL_THRESHOLD = 0.15; // how much of the section must be visible to start

// Formats relative paths (/uploads/image.png) into absolute backend URLs
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000')
  .replace(/\/api\/?$/, '')
  .replace(/\/+$/, '');

const formatImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('/')) return `${API_BASE_URL}${trimmed}`;
  return `${API_BASE_URL}/${trimmed}`;
};

const DEFAULT_ITEMS = [
  {
    id: 'fire-and-gas-systems',
    title: 'Fire & Gas Systems',
    icon_name: 'Flame',
    button_text: 'KNOW MORE',
    button_link: '/products/fire-and-gas-systems',
  },
  {
    id: 'analytical-instrumentation',
    title: 'Analytical Instrumentation',
    icon_name: 'Users',
    button_text: 'KNOW MORE',
    button_link: '/products/analytical-instrumentation',
  },
  {
    id: 'analyzer-system-integration',
    title: 'Analyzer System Integration',
    icon_name: 'CircleDot',
    button_text: 'KNOW MORE',
    button_link: '/products/analyzer-system-integration',
  },
  {
    id: 'industrial-automation',
    title: 'Industrial Automation',
    icon_name: 'Layers',
    button_text: 'KNOW MORE',
    button_link: '/products/industrial-automation',
  },
  {
    id: 'process-division',
    title: 'Process Division',
    icon_name: 'Share2',
    button_text: 'KNOW MORE',
    button_link: '/products/process-division',
  },
];

const ProductGridSection = () => {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    fetchProductsPage()
      .then((res) => {
        if (!isMounted) return;

        const payload = res?.data?.data || res?.data || res || {};
        const fetchedItems = payload.items;

        if (Array.isArray(fetchedItems) && fetchedItems.length > 0) {
          setItems(fetchedItems);
        }
      })
      .catch((err) => {
        console.error('Failed to load Product Division Cards:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Start the card animation when the section scrolls into view
  useEffect(() => {
    if (loading || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: REVEAL_THRESHOLD }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [loading]);

  if (loading) {
    return (
      <section className="bg-slate-100 py-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-slate-50 to-slate-100 py-16 px-4 sm:px-6 lg:px-12"
    >
      {/* Card entrance animation */}
      <style>{`
        @keyframes cardFadeUp {
          from { opacity: 0; transform: translateY(32px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .card-enter {
          animation: cardFadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) backwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .card-enter { animation: none; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* 4 CARDS PER ROW ON LARGE SCREENS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-stretch gap-6">
          {items.map((item, index) => {
            const IconComponent = ICON_MAP[item.icon_name] || Package;
            const logoUrl = formatImageUrl(item.icon_url);

            return (
              <div
                key={item.id || item.title}
                style={{ animationDelay: `${index * CARD_STAGGER_MS}ms` }}
                className={`${
                  isVisible ? 'card-enter' : 'opacity-0'
                } relative overflow-hidden w-full bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:border-blue-200 hover:-translate-y-2 transition-all duration-300 group`}
              >
                {/* TOP ACCENT BAR (grows in on hover) */}
                <span className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#1E3A8A] to-[#155CFB] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />

                {/* LOGO / ICON DISPLAY CONTAINER */}
                <div className="h-20 w-full flex items-center justify-center mb-4">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={item.title}
                      className="max-h-16 max-w-[80%] object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-100 group-hover:bg-blue-900 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <IconComponent className="w-8 h-8 text-slate-500 group-hover:text-white transition-colors duration-300 stroke-[2]" />
                    </div>
                  )}
                </div>

                {/* CARD TITLE */}
                <div className="flex-grow flex items-center justify-center mb-6">
                  <h3 className="text-slate-900 group-hover:text-blue-900 text-base md:text-lg font-bold leading-snug transition-colors duration-300">
                    {item.title}
                  </h3>
                </div>

                {/* BUTTON CTA */}
                <div className="w-full mt-auto flex justify-center">
                  <Link
                    to={item.button_link || '#'}
                    className="inline-flex items-center justify-center gap-2 w-full max-w-[160px] bg-[#1E3A8A] hover:bg-[#155CFB] text-white text-xs font-black tracking-wider uppercase py-2.5 px-4 rounded-full shadow transition-all active:scale-95 text-center"
                  >
                    {item.button_text || 'KNOW MORE'}
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductGridSection;