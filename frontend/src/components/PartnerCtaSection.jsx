import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPartnersPage } from '../services/api';

const PartnerCtaSection = ({ cta: ctaProp }) => {
  const [ctaData, setCtaData] = useState(ctaProp || null);

  // Fallback API Fetch if cta prop isn't provided by parent page
  useEffect(() => {
    if (ctaProp) {
      setCtaData(ctaProp);
      return;
    }

    fetchPartnersPage()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        if (payload.cta) {
          setCtaData(payload.cta);
        }
      })
      .catch((err) => console.error('Error fetching CTA section in component:', err));
  }, [ctaProp]);

  const heading = ctaData?.heading || "Need Any Help? Let's Talk";
  const buttonText = ctaData?.button_text || "ENQUIRY NOW";
  const buttonLink = ctaData?.button_link || "/contact";
  
  // Checks all possible backend image keys to prevent missing URLs
  const bgImageUrl = 
    ctaData?.bg_image_url || 
    ctaData?.image_url || 
    ctaData?.bg_url || 
    ctaData?.bg_image || 
    "";

  const isExternal = buttonLink.startsWith('http://') || buttonLink.startsWith('https://');

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Shared button styling — white bg, dark text, neutral shadow
  const buttonClass = "inline-block bg-white hover:bg-[#155CFB] hover:text-white text-slate-900 text-xs sm:text-sm font-black tracking-wider uppercase px-8 py-3.5 rounded-full shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/15 hover:scale-105 active:scale-95 transition-all duration-300";

  return (
    <section className="relative w-full py-16 sm:py-20 overflow-hidden border-t border-b border-slate-800/60">
      
      {/* BACKGROUND IMAGE WITH HIGH OPACITY & OVERLAY */}
      {bgImageUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-95 mix-blend-overlay transition-opacity duration-300 pointer-events-none"
          style={{ backgroundImage: `url("${bgImageUrl}")` }}
        />
      )}

      {/* OVERLAY TO ENSURE TEXT READABILITY */}
      {bgImageUrl && (
        <div className="absolute inset-0  pointer-events-none" />
      )}

      {/* TECH CIRCUIT DECORATIVE LINES */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-15 z-0">
        <svg 
          className="w-full h-full max-w-4xl" 
          viewBox="0 0 800 200" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
        >
          <path d="M100 200 L250 120 L350 120 L400 60" className="text-blue-400" />
          <circle cx="400" cy="60" r="4" className="fill-blue-400" />
          
          <path d="M200 200 L300 130 L450 130 L500 80" className="text-blue-400" />
          <circle cx="500" cy="80" r="4" className="fill-blue-400" />

          <path d="M700 200 L550 120 L450 120 L400 160" className="text-blue-400" />
          <circle cx="400" cy="160" r="4" className="fill-blue-400" />
        </svg>
      </div>

      {/* INNER CONTENT CONTAINER */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-6">
        
        {/* HEADING */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
          {heading}
        </h2>

        {/* WHITE PILL BUTTON */}
        <div className="pt-2 ">
          {isExternal ? (
            
            <a  href={buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass}
            >
              {buttonText}
            </a>
          ) : (
            <Link
              to={buttonLink}
              onClick={handleScrollTop}
              className={buttonClass}
            >
              {buttonText}
            </Link>
          )}
        </div>

      </div>

    </section>
  );
};

export default PartnerCtaSection;