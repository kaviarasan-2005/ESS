import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchHomePage } from '../services/api';

/* Marquee settings */
const REPEATS_PER_HALF = 3;      // how many times the item list repeats in one half of the track
const SECONDS_PER_CARD = 8;      // higher = slower scrolling (was 4)

// Bottom-to-top white fade on the product image (change h-16 for a taller/shorter fade)
const IMAGE_FADE_CLASS =
  'pointer-events-none absolute inset-x-0 -bottom-0.5 h-16 bg-gradient-to-t from-white via-white/40 to-transparent';

const DEFAULT_PRODUCTS = {
  tagline: 'MANUFACTURED HARDWARE',
  title: 'Our Products',
  description: 'Engineered to withstand extreme pressures, harsh corrosive environments, and intensive manufacturing duty cycles.',
  items: [
    {
      id: 'prod-1',
      title: 'Analytical Instrumentation',
      description: '',
      spec_code: '',
      image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      details_url: '/products/analytical',
      btn_text: 'View Details'
    },
    {
      id: 'prod-2',
      title: 'Industrial Automation',
      description: '',
      spec_code: '',
      image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
      details_url: '/products/automation',
      btn_text: 'View Details'
    },
    {
      id: 'prod-3',
      title: 'Analytical System Integration',
      description: '',
      spec_code: '',
      image_url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      details_url: '/products/system-integration',
      btn_text: 'View Details'
    }
  ]
};

const ProductsSection = () => {
  const [data, setData] = useState(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    fetchHomePage()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        const rawSection = payload.products || payload.products_section;

        if (rawSection) {
          if (Array.isArray(rawSection) && rawSection.length > 0) {
            setData((prev) => ({ ...prev, items: rawSection }));
          } else if (typeof rawSection === 'object' && rawSection.items) {
            setData({
              tagline: rawSection.tagline ?? DEFAULT_PRODUCTS.tagline,
              title: rawSection.title ?? DEFAULT_PRODUCTS.title,
              description: rawSection.description ?? DEFAULT_PRODUCTS.description,
              items: Array.isArray(rawSection.items) && rawSection.items.length > 0 
                ? rawSection.items 
                : DEFAULT_PRODUCTS.items
            });
          }
        }
      })
      .catch((err) => console.error('Error loading Products section:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || !gridRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, [loading]);

  if (loading) {
    return (
      <div className="py-20 bg-slate-50 text-center text-slate-400 text-xs font-semibold animate-pulse">
        Loading Products Section...
      </div>
    );
  }

  const productItems = data.items || [];

  /* One half of the track = the item list repeated, so the row is always wider than the screen.
     The track shows two identical halves and slides left by exactly 50%, which loops seamlessly. */
  const trackHalf = Array.from({ length: REPEATS_PER_HALF }, () => productItems).flat();
  const marqueeDuration = `${Math.max(productItems.length, 1) * REPEATS_PER_HALF * SECONDS_PER_CARD}s`;

  /* Single product card */
  const renderProductCard = (item, index) => {
    const buttonText = item.btn_text || item.cta_text || item.details_text || 'View Details';
    const buttonUrl = item.details_url || item.btn_url || item.url || '/products';
    const isExternal = buttonUrl.startsWith('http://') || buttonUrl.startsWith('https://');
    const hasDescription = Boolean(item.description && item.description.trim());

    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between h-full w-full">
        {/* IMAGE CONTAINER (shorter on mobile) */}
        <div className="h-40 sm:h-52 bg-white overflow-hidden relative shrink-0">
          <img
            src={item.image_url || DEFAULT_PRODUCTS.items[0].image_url}
            alt={item.title || 'Product Image'}
            className="block w-full h-full object-cover hover:scale-110 transition-transform duration-700 ease-out"
            onError={(e) => {
              e.target.src = DEFAULT_PRODUCTS.items[0].image_url;
            }}
          />

          {/* Bottom-to-top white shade */}
          <div className={IMAGE_FADE_CLASS} />
        </div>

        {/* CARD BODY */}
        <div className="relative z-10 -mt-0.5 bg-white p-4 sm:p-5 flex flex-col flex-1 justify-between gap-4">
          
          {/* TITLE AND OPTIONAL DESCRIPTION */}
          <div className="space-y-2 flex-1 flex flex-col">
            {/* Mobile: row fills the card so the button sits at the bottom, all cards line up.
                Desktop (sm+): original title + button inline layout. */}
            <div className="flex flex-1 flex-row items-center justify-between gap-3 sm:flex-none">
              {/* Title: full name visible, wraps to as many lines as needed */}
              <h3
                className="min-w-0 flex-1 break-words text-[12px] sm:text-[14px] font-bold text-slate-900 leading-snug line-clamp-2 sm:line-clamp-none"
                title={item.title}
              >
                {item.title}
              </h3>
              
              {/* BUTTON INLINE WITH TITLE IF NO DESCRIPTION IS PRESENT */}
              {!hasDescription && (
                isExternal ? (
                  <a
                    href={buttonUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#1E3A8A] hover:bg-[#155CFB] text-white text-[10px] font-bold px-2.5 sm:px-3 py-2 rounded-lg shadow-sm transition-all duration-300 shrink-0 whitespace-nowrap"
                  >
                    {buttonText}
                  </a>
                ) : (
                  <Link
                    to={buttonUrl}
                    className="bg-[#1E3A8A] hover:bg-[#155CFB] text-white text-[10px] font-bold px-2.5 sm:px-3 py-2 rounded-lg shadow-sm transition-all duration-300 shrink-0 whitespace-nowrap"
                  >
                    {buttonText}
                  </Link>
                )
              )}
            </div>

            {hasDescription && (
              <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2">
                {item.description}
              </p>
            )}
          </div>

          {/* BOTTOM FOOTER IF DESCRIPTION OR SPEC CODE IS PRESENT */}
          {(hasDescription || item.spec_code) && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {item.spec_code || ''}
              </span>

              {isExternal ? (
                <a
                  href={buttonUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#0b1329] hover:bg-[#162244] text-white text-[11px] font-bold px-4 py-2 rounded-lg shadow-sm transition-all duration-300 shrink-0 whitespace-nowrap"
                >
                  {buttonText}
                </a>
              ) : (
                <Link
                  to={buttonUrl}
                  className="bg-[#0b1329] hover:bg-[#162244] text-white text-[11px] font-bold px-4 py-2 rounded-lg shadow-sm transition-all duration-300 shrink-0 whitespace-nowrap"
                >
                  {buttonText}
                </Link>
              )}
            </div>
          )}

        </div>
      </div>
    );
  };

  return (
    <section className="py-12 sm:py-16 bg-slate-50 text-slate-800 overflow-hidden">
      
      {/* RIGHT-TO-LEFT MARQUEE KEYFRAMES */}
      <style>{`
        @keyframes productsMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .products-marquee-track {
          display: flex;
          align-items: stretch;
          width: max-content;
          animation: productsMarquee var(--marquee-duration, 72s) linear infinite;
        }

        /* Pause while the visitor hovers over the cards */
        .products-marquee-track:hover {
          animation-play-state: paused;
        }

        /* Soft fade on the left and right edges (gentler on mobile) */
        .products-marquee-viewport {
          -webkit-mask-image: linear-gradient(to right, transparent, #000 2%, #000 98%, transparent);
          mask-image: linear-gradient(to right, transparent, #000 2%, #000 98%, transparent);
        }

        @media (min-width: 640px) {
          .products-marquee-viewport {
            -webkit-mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent);
            mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .products-marquee-track { animation: none; }
          .products-marquee-viewport { overflow-x: auto; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 space-y-10">
        
        {/* HEADER AREA */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          {data.tagline && (
            <span className="text-[11px] font-black text-slate-800 tracking-widest uppercase block">
              {data.tagline}
            </span>
          )}
          {data.title && (
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {data.title}
            </h2>
          )}
          {data.description && (
            <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
              {data.description}
            </p>
          )}
        </div>
      </div>

      {/* SCROLLING PRODUCT ROW (full width, right to left) */}
      <div
        ref={gridRef}
        className={`products-marquee-viewport mt-10 overflow-hidden py-4 transition-opacity duration-700 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className="products-marquee-track"
          style={{ '--marquee-duration': marqueeDuration }}
        >
          {/* First half, then an identical second half (hidden from screen readers) */}
          {[false, true].map((isCopy) =>
            trackHalf.map((item, index) => (
              <div
                key={`${isCopy ? 'copy' : 'main'}-${item.id || item._id || index}-${index}`}
                aria-hidden={isCopy}
                className="shrink-0 flex w-[80vw] max-w-[320px] sm:w-[420px] sm:max-w-none pr-4 sm:pr-8"
              >
                {renderProductCard(item, index)}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;