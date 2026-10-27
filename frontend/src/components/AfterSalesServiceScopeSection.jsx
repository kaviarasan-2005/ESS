import React, { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { fetchAfterSalesServiceScope } from '../services/projectsServices';

const DEFAULT_SCOPE = {
  title: 'Service Scope',
  items: [
    'Warranty service and claim support for supplied instruments and systems',
    'Preventive maintenance and corrective maintenance',
    'Calibration services for process instrumentation and analysers',
    'Troubleshooting and fault diagnosis with on-site and remote support options',
    'Spare parts identification, sourcing, and supply',
    'Annual Maintenance Contracts (AMC) for long-term service coverage',
  ],
  engineers_title: 'Factory Trained & OEM Certified Engineers',
  engineers_content:
    "ESS Saudi's service engineers complete manufacturer led training and certification programmes at OEM facilities, covering installation, commissioning, calibration, and maintenance procedures specific to each product line. This ensures that service delivered in the Kingdom consistently meets manufacturer direct quality standards, with the added advantage of local accessibility and rapid response.",
};

// Animation settings
const REVEAL_THRESHOLD = 0.15;
const CARD_STAGGER_MS = 120;

// Fades + slides an element up when it scrolls into view (runs once)
const Reveal = ({ delay = 0, className = '', children }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: REVEAL_THRESHOLD }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const AfterSalesServiceScopeSection = () => {
  const [data, setData] = useState(DEFAULT_SCOPE);

  useEffect(() => {
    let isMounted = true;

    fetchAfterSalesServiceScope()
      .then((res) => {
        if (!isMounted) return;

        const payload = res?.data?.data || res?.data || res || {};
        const hasItems = Array.isArray(payload.items);

        setData({
          title: payload.title || DEFAULT_SCOPE.title,
          items: hasItems ? payload.items : DEFAULT_SCOPE.items,
          engineers_title: payload.engineers_title || DEFAULT_SCOPE.engineers_title,
          engineers_content: payload.engineers_content ?? DEFAULT_SCOPE.engineers_content,
        });
      })
      .catch((err) => console.error('Error fetching After-Sales Service Scope section:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="w-full bg-[#f8fafc] py-16 font-sans text-slate-800 lg:py-20">
      <div className="mx-auto max-w-7xl space-y-16 px-6 lg:px-12">

        {/* SERVICE SCOPE BLOCK */}
        <div className="space-y-10">
          {/* SECTION HEADING WITH BLUE UNDERLINE */}
          <Reveal className="text-center">
            <h2 className="text-4xl font-extrabold text-[#0f172a] sm:text-5xl">
              {data.title}
            </h2>
            <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-[#1b3270]" />
          </Reveal>

          {/* 2-COLUMN CHECKMARK CARDS GRID */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {data.items.map((item, index) => (
              <Reveal key={index} delay={(index % 2) * CARD_STAGGER_MS} className="h-full">
                <div className="group flex h-full items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1b3270] text-white transition-transform duration-300 group-hover:scale-110">
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                  <p className="text-base font-medium leading-relaxed text-slate-700 sm:text-lg">
                    {item}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* FACTORY TRAINED & OEM CERTIFIED ENGINEERS BLOCK */}
        {data.engineers_content && (
          <Reveal>
            <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xs sm:p-10">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="h-7 w-1.5 rounded-full bg-[#1b3270]" />
                <h3 className="text-2xl font-extrabold text-[#0f172a] sm:text-3xl">
                  {data.engineers_title}
                </h3>
              </div>

              <p className="text-justify text-lg font-normal leading-relaxed text-slate-700 sm:text-xl sm:leading-relaxed">
                {data.engineers_content}
              </p>
            </div>
          </Reveal>
        )}

      </div>
    </section>
  );
};

export default AfterSalesServiceScopeSection;