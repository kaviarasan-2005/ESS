import React, { useState, useEffect, useRef } from 'react';
import { fetchMassNotificationCapabilities } from '../services/SystemsSolutions';

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

const MassNotificationCapabilities = () => {
  const [data, setData] = useState({
    industries_title: 'Industries served',
    industries_list: [
      'Oil & Gas',
      'Petrochemical',
      'Power Generation',
      'Utilities',
    ],
    why_title: 'Why ESS Saudi',
    why_description:
      'ESS Saudi supplies mass notification systems and sirens from internationally certified manufacturers, and offers local system design and integration support to connect notification systems with plant safety systems.',
  });

  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    loadCapabilitiesData();
  }, []);

  const loadCapabilitiesData = async () => {
    try {
      setLoading(true);
      const res = await fetchMassNotificationCapabilities();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Mass Notification capabilities:', err);
    } finally {
      setLoading(false);
    }
  };

  // Play the animation when the section scrolls into view (once)
  useEffect(() => {
    if (loading) return undefined;
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
  }, [loading]);

  if (loading) {
    return (
      <div className="flex h-48 w-full items-center justify-center bg-white text-slate-700">
        <div className="text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-[#1b439b] border-r-transparent"></div>
          <p className="mt-2 animate-pulse text-xs font-semibold">Loading capabilities...</p>
        </div>
      </div>
    );
  }

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
            {data.industries_list &&
              data.industries_list.map((industry, idx) => (
                <span
                  key={idx}
                  className={`cursor-default rounded-full bg-white px-7 py-3 text-sm font-bold text-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#1b439b] hover:text-white hover:shadow-lg md:text-base ${
                    isVisible ? 'cap-pill' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${PILLS_START_MS + idx * STAGGER_MS}ms` }}
                >
                  {industry}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* BOTTOM WHITE SECTION: WHY ESS SAUDI */}
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

          <p
            className={`mx-auto max-w-3xl text-lg leading-relaxed text-slate-600 md:text-lg text-justify md:leading-loose ${
              isVisible ? 'cap-why-text' : 'opacity-0'
            }`}
          >
            {data.why_description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default MassNotificationCapabilities;