import React, { useState, useEffect, useRef } from 'react';
import { fetchVESDAApplications } from '../services/api';

const ITEM_BASE = 'transition-all duration-700 ease-out motion-reduce:transition-none';
const FADE_IN = 'translate-y-0 opacity-100';
const FADE_HIDDEN = 'translate-y-6 opacity-0';
const HEADING_TEXT = 'text-3xl md:text-4xl lg:text-5xl';
const ITEM_TEXT = 'text-base md:text-lg lg:text-xl';
const LIST_GRID = 'grid grid-cols-1 gap-x-16 gap-y-5 md:grid-cols-2';
const STAGGER_MS = 100;
const VISIBLE_THRESHOLD = 0.15;

const VESDAApplicationsSection = () => {
  const [data, setData] = useState({
    title: 'Key Applications',
    applications_list: [
      'Control room and switchgear/electrical room fire protection',
      'Cable gallery and cable tray early-warning detection',
      'Data and telecom room smoke monitoring',
      'Clean agent suppression system activation triggers',
      'Building and facility-wide fire alarm coverage',
    ],
  });

  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    loadApplicationsData();
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

  const loadApplicationsData = async () => {
    try {
      setLoading(true);
      const res = await fetchVESDAApplications();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load VESDA applications section:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-48 w-full items-center justify-center bg-white text-slate-700">
        <div className="text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-3 border-solid border-sky-600 border-r-transparent"></div>
          <p className="mt-2 text-xs font-semibold">Loading applications...</p>
        </div>
      </div>
    );
  }

  const items = data.applications_list || [];

  return (
    <section
      ref={sectionRef}
      className="w-full overflow-hidden bg-white px-6 py-16 font-sans text-slate-800 md:px-12 lg:px-20"
    >
      <div className="mx-auto max-w-6xl">
        {/* CENTERED TITLE */}
        {data.title && (
          <h2
            className={`mb-12 text-center font-bold tracking-tight text-[#0a192f] ${HEADING_TEXT} ${ITEM_BASE} ${
              isVisible ? FADE_IN : FADE_HIDDEN
            }`}
          >
            {data.title}
          </h2>
        )}

        {/* TWO-COLUMN BULLET GRID */}
        {items.length > 0 ? (
          <div className={LIST_GRID}>
            {items.map((item, idx) => (
              <div
                key={idx}
                style={{ transitionDelay: `${idx * STAGGER_MS}ms` }}
                className={`flex items-start gap-3 leading-relaxed text-slate-700 ${ITEM_TEXT} ${ITEM_BASE} ${
                  isVisible ? FADE_IN : FADE_HIDDEN
                }`}
              >
                {/* BULLET ICON */}
                <span className="mt-[0.65em] h-2 w-2 shrink-0 rounded-full bg-sky-600" />

                {/* ITEM TEXT */}
                <p className="text-left font-normal text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-slate-500">
            No applications available.
          </div>
        )}
      </div>
    </section>
  );
};

export default VESDAApplicationsSection;