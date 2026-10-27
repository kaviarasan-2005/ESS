import React, { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { fetchExecutionScope } from '../services/projectsServices';

const DEFAULT_SCOPE = {
  title: 'Execution Scope',
  items: [
    'Basic and detailed engineering for instrumentation, control, and safety systems',
    'Analyser shelter, control panel, and Fire & Gas (F&G) panel design and integration',
    'Sampling system engineering for Gas and Liquid applications',
    'SIL rated safety system design per applicable safety lifecycle requirements (IEC 61511)',
    'Factory Acceptance Testing (FAT) and Site Acceptance Testing (SAT)',
    'Installation, testing, and commissioning',
    'Project documentation, as-built drawings, and handover packages',
  ],
  standards_title: 'Standards & Compliance',
  standards_content:
    "ESS Saudi applies relevant end-user engineering requirements and recognised international safety standards including IEC 61511, IEC 61508, and applicable Saudi Aramco Engineering Standards (SAES) throughout project execution. This approach ensures that engineered systems are fully compatible with existing plant infrastructure and aligned with the site's safety and functional safety requirements.",
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

const ExecutionScopeSection = () => {
  const [data, setData] = useState(DEFAULT_SCOPE);

  useEffect(() => {
    let isMounted = true;

    fetchExecutionScope()
      .then((res) => {
        if (!isMounted) return;

        const payload = res?.data?.data || res?.data || res || {};
        const hasItems = Array.isArray(payload.items);

        setData({
          title: payload.title || DEFAULT_SCOPE.title,
          items: hasItems ? payload.items : DEFAULT_SCOPE.items,
          standards_title: payload.standards_title || DEFAULT_SCOPE.standards_title,
          standards_content: payload.standards_content ?? DEFAULT_SCOPE.standards_content,
        });
      })
      .catch((err) => console.error('Error fetching Execution Scope section:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="w-full bg-[#f8fafc] py-16 font-sans text-slate-800 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-16">

        {/* EXECUTION SCOPE BLOCK */}
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
                  <p className=" text-base font-medium leading-relaxed text-slate-700 sm:text-lg">
                    {item}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* STANDARDS & COMPLIANCE BLOCK */}
        {data.standards_content && (
          <Reveal>
            <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xs sm:p-10">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="h-7 w-1.5 rounded-full bg-[#1b3270]" />
                <h3 className="text-2xl font-extrabold text-[#0f172a] sm:text-3xl">
                  {data.standards_title}
                </h3>
              </div>

              <p className=" text-justify text-lg font-normal leading-relaxed text-slate-700 sm:text-xl sm:leading-relaxed">
                {data.standards_content}
              </p>
            </div>
          </Reveal>
        )}

      </div>
    </section>
  );
};

export default ExecutionScopeSection;