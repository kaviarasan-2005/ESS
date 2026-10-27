import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Layers, Target, Disc, Droplets, Bell, ArrowRight } from 'lucide-react';
import { fetchSystemsSolutionsGrid } from '../services/SystemsSolutions';

// Animation settings (same as ProductGridSection)
const CARD_STAGGER_MS = 100; // delay between each card's entrance
const REVEAL_THRESHOLD = 0.15; // how much of the section must be visible to start

// Shared icon style: grey by default, white on card hover
const ICON_CLASS = 'w-8 h-8 text-slate-500 group-hover:text-white transition-colors duration-300 stroke-[2]';

const DEFAULT_CARDS = [
  { id: 'sol-1', title: 'Moisture & Dew Point Measurement Instruments', icon_type: 'droplet', logo_url: '', link_url: '/systems/moisture-dew-point' },
  { id: 'sol-2', title: 'Flame & Gas Detectors', icon_type: 'flame', logo_url: '', link_url: '/systems/flame-gas-detectors' },
  { id: 'sol-3', title: 'VESDA® Aspirating Smoke Detection & Fire Alarm Devices', icon_type: 'target', logo_url: '', link_url: '/systems/vesda-smoke-detection' },
  { id: 'sol-4', title: 'Process Analyzers', icon_type: 'layers', logo_url: '', link_url: '/systems/process-analyzers' },
  { id: 'sol-5', title: 'Process Instrumentation', icon_type: 'disc', logo_url: '', link_url: '/systems/process-instrumentation' },
  { id: 'sol-6', title: 'Upstream Instrumentation (Water Cut Meters)', icon_type: 'droplet', logo_url: '', link_url: '/systems/water-cut-meters' },
  { id: 'sol-7', title: 'Beacons & Sounders', icon_type: 'bell', logo_url: '', link_url: '/systems/beacons-sounders' },
];

let cachedGridData = null;

const SystemsSolutionsGrid = () => {
  const [cards, setCards] = useState(() => cachedGridData || DEFAULT_CARDS);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    fetchSystemsSolutionsGrid()
      .then((res) => {
        if (!isMounted) return;

        const payload = res?.data || res || {};
        const freshCards = Array.isArray(payload.cards) && payload.cards.length > 0
          ? payload.cards
          : DEFAULT_CARDS;

        cachedGridData = freshCards;
        setCards(freshCards);
      })
      .catch((err) => console.error('Error loading Systems solutions grid:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Start the card animation when the section scrolls into view
  useEffect(() => {
    if (!sectionRef.current) return;

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
  }, []);

  const renderCardBadge = (card) => {
    if (card.logo_url) {
      return (
        <img
          src={card.logo_url}
          alt={card.title}
          className="max-h-16 max-w-[80%] object-contain transition-transform duration-300 group-hover:scale-110"
        />
      );
    }

    const iconBadge = (icon) => (
      <div className="w-16 h-16 rounded-full bg-slate-100 group-hover:bg-blue-900 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
        {icon}
      </div>
    );

    switch (card.icon_type) {
      case 'flame': return iconBadge(<Flame className={ICON_CLASS} />);
      case 'target': return iconBadge(<Target className={ICON_CLASS} />);
      case 'layers': return iconBadge(<Layers className={ICON_CLASS} />);
      case 'disc': return iconBadge(<Disc className={ICON_CLASS} />);
      case 'droplet': return iconBadge(<Droplets className={ICON_CLASS} />);
      case 'bell': return iconBadge(<Bell className={ICON_CLASS} />);
      default: return iconBadge(<Flame className={ICON_CLASS} />);
    }
  };

  if (cards.length === 0) {
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
          {cards.map((card, index) => (
            <div
              key={card.id || card.title}
              style={{ animationDelay: `${index * CARD_STAGGER_MS}ms` }}
              className={`${
                isVisible ? 'card-enter' : 'opacity-0'
              } relative overflow-hidden w-full bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:border-blue-200 hover:-translate-y-2 transition-all duration-300 group`}
            >
              {/* TOP ACCENT BAR (grows in on hover) */}
              <span className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#1E3A8A] to-[#155CFB] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />

              {/* ICON / LOGO DISPLAY CONTAINER */}
              <div className="h-20 w-full flex items-center justify-center mb-4">
                {renderCardBadge(card)}
              </div>

              {/* CARD TITLE */}
              <div className="flex-grow flex items-center justify-center mb-6">
                <h3 className="text-slate-900 group-hover:text-blue-900 text-base md:text-lg font-bold leading-snug transition-colors duration-300">
                  {card.title}
                </h3>
              </div>

              {/* KNOW MORE BUTTON */}
              <div className="w-full mt-auto flex justify-center">
                <Link
                  to={card.link_url || '#'}
                  className="inline-flex items-center justify-center gap-2 w-full max-w-[160px] bg-[#1E3A8A] hover:bg-[#155CFB] text-white text-xs font-black tracking-wider uppercase py-2.5 px-4 rounded-full shadow transition-all active:scale-95 text-center"
                >
                  KNOW MORE
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SystemsSolutionsGrid;