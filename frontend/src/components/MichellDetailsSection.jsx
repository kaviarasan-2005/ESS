import React, { useState, useEffect, useRef } from 'react';
import { fetchMichellDetails } from '../services/api';

const ITEM_BASE = "transition-all duration-700 ease-out motion-reduce:transition-none";
const FADE_IN = "translate-y-0 opacity-100";
const FADE_HIDDEN = "translate-y-6 opacity-0";
const HEADING_TEXT = "text-3xl md:text-4xl lg:text-5xl";
const ITEM_TEXT = "text-base md:text-lg lg:text-xl";
const LIST_GRID = "grid grid-cols-1 gap-x-16 gap-y-5 md:grid-cols-2";
const STAGGER_MS = 100;
const VISIBLE_THRESHOLD = 0.15;

const MichellDetailsSection = () => {
  const [data, setData] = useState({
    section_title: 'Product Features & Specifications',
    features: [],
  });

  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    loadDetailsData();
  }, []);

  // Trigger reveal animation when section enters viewport
  useEffect(() => {
    if (loading || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: VISIBLE_THRESHOLD }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [loading]);

  const loadDetailsData = async () => {
    try {
      setLoading(true);
      const res = await fetchMichellDetails();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Michell details section:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center bg-white text-black">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-slate-800 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Loading details...</p>
        </div>
      </div>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="w-full overflow-hidden bg-white px-6 py-16 font-sans text-slate-800 md:px-12 lg:px-20"
    >
      <div className="mx-auto max-w-6xl">
        {/* SECTION HEADING */}
        {data.section_title && (
          <h2
            className={`mb-12 text-center font-bold tracking-tight text-slate-900 ${HEADING_TEXT} ${ITEM_BASE} ${
              isVisible ? FADE_IN : FADE_HIDDEN
            }`}
          >
            {data.section_title}
          </h2>
        )}

        {/* BULLET FEATURES LIST - left and right columns */}
        {data.features && data.features.length > 0 ? (
          <div className={LIST_GRID}>
            {data.features.map((feature, idx) => (
              <div
                key={idx}
                style={{ transitionDelay: `${idx * STAGGER_MS}ms` }}
                className={`flex items-start gap-3 leading-relaxed text-slate-700 ${ITEM_TEXT} ${ITEM_BASE} ${
                  isVisible ? FADE_IN : FADE_HIDDEN
                }`}
              >
                {/* BULLET ICON */}
                <span className="mt-[0.65em] h-2 w-2 shrink-0 rounded-full bg-sky-600" />

                {/* FEATURE TEXT */}
                <p className="text-left font-normal text-slate-700">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-slate-500">
            No features available.
          </div>
        )}
      </div>
    </section>
  );
};

export default MichellDetailsSection;