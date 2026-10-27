import React, { useEffect, useState, useRef } from 'react';
import { fetchAfterSalesWhyUs } from '../services/projectsServices';

const STAGGER_MS = 100;
const PILLS_START_MS = 250;
const VISIBLE_THRESHOLD = 0.15;

// Keyframes live here so no tailwind.config change is needed.
// Animations are switched off for users who prefer reduced motion.
const ANIMATION_CSS = `
  @keyframes cap-fade-up {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes cap-slide-left {
    from { opacity: 0; transform: translateX(-32px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes cap-pop {
    from { opacity: 0; transform: scale(0.8); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes cap-line-grow {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }

  .cap-industries-title { animation: cap-slide-left 0.7s ease-out both; }
  .cap-pill             { animation: cap-pop 0.5s ease-out both; }
  .cap-why-title        { animation: cap-fade-up 0.7s ease-out 0.5s both; }
  .cap-line             { animation: cap-line-grow 0.7s ease-out 0.9s both; transform-origin: center; }
  .cap-why-text         { animation: cap-fade-up 0.7s ease-out 1s both; }

  @media (prefers-reduced-motion: reduce) {
    .cap-industries-title, .cap-pill, .cap-why-title,
    .cap-line, .cap-why-text {
      animation: none !important;
      opacity: 1 !important;
    }
  }
`;

const DEFAULT_WHY_US = {
  industries_title: 'Industries Served',
  industries: ['Oil & Gas', 'Petrochemical', 'Power Generation', 'Water & Utilities'],
  why_title: 'Why Choose Us',
  why_description:
    'As the authorised local channel partner for the instrumentation and analyser brands we represent, ESS Saudi delivers factory certified after-sales and warranty services across the Kingdom. Clients benefit from reduced equipment downtime, faster response, and the confidence of OEM standard service without the delays and costs associated with routing support requests through overseas manufacturers.',
};

const AfterSalesWhyUsSection = () => {
  const [data, setData] = useState(DEFAULT_WHY_US);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    fetchAfterSalesWhyUs()
      .then((res) => {
        if (!isMounted) return;

        const payload = res?.data?.data || res?.data || res || {};
        const hasIndustries = Array.isArray(payload.industries);

        setData({
          industries_title: payload.industries_title || DEFAULT_WHY_US.industries_title,
          industries: hasIndustries ? payload.industries : DEFAULT_WHY_US.industries,
          why_title: payload.why_title || DEFAULT_WHY_US.why_title,
          why_description: payload.why_description ?? DEFAULT_WHY_US.why_description,
        });
      })
      .catch((err) => console.error('Error fetching After-Sales Why Us section:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Play the animation when the section scrolls into view (once)
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: VISIBLE_THRESHOLD }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full font-sans">
      <style>{ANIMATION_CSS}</style>

      {/* TOP GREY BANNER: INDUSTRIES SERVED */}
      <div className="w-full bg-[#e8ecef] px-6 py-12 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-8 md:flex-row md:justify-between">
          <h2
            className={`text-3xl font-black text-slate-900 md:text-4xl ${
              isVisible ? 'cap-industries-title' : 'opacity-0'
            }`}
          >
            {data.industries_title}
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {data.industries.map((item, index) => (
              <span
                key={index}
                className={`cursor-default rounded-full bg-white px-7 py-3 text-sm font-bold text-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#1b439b] hover:text-white hover:shadow-lg md:text-base ${
                  isVisible ? 'cap-pill' : 'opacity-0'
                }`}
                style={{ animationDelay: `${PILLS_START_MS + index * STAGGER_MS}ms` }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM WHITE SECTION: WHY CHOOSE US */}
      <div className="w-full bg-white px-6 py-20 text-center md:px-12 lg:px-20">
        <div className="mx-auto max-w-4xl space-y-6">
          <h2
            className={`text-4xl font-black text-slate-900 md:text-5xl lg:text-6xl ${
              isVisible ? 'cap-why-title' : 'opacity-0'
            }`}
          >
            {data.why_title}
          </h2>

          <span
            className={`mx-auto block h-1 w-20 rounded-full bg-[#1b439b] ${
              isVisible ? 'cap-line' : 'scale-x-0'
            }`}
          />

          {data.why_description && (
            <p
              className={`mx-auto max-w-3xl text-justify text-lg leading-relaxed text-slate-600 md:leading-loose ${
                isVisible ? 'cap-why-text' : 'opacity-0'
              }`}
            >
              {data.why_description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AfterSalesWhyUsSection;