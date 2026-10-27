import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchHomePage } from '../services/api';

/* Shared text styles so Mission and Vision always match */
const BODY_TEXT_CLASS =
  'text-black text-base sm:text-lg font-medium leading-relaxed whitespace-pre-line text-justify [text-justify:inter-word]';
const POINT_TITLE_CLASS = 'text-black text-base  whitespace-pre-line sm:text-lg font-bold';
const HEADING_TEXT_CLASS =
  'text-2xl sm:text-3xl font-extrabold text-[#1E3A8A] tracking-wider uppercase text-center drop-shadow-xs whitespace-pre-line mt-10 mb-4';

const MissionVisionSection = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeNode, setActiveNode] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Helper function to fetch and populate section data
  const loadSectionData = useCallback((showSpinner = false) => {
    if (showSpinner) setLoading(true);

    fetchHomePage()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        if (payload.mission_vision) {
          setData(payload.mission_vision);
        }
      })
      .catch((err) => console.error('Error loading Mission/Vision:', err))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadSectionData(true);

    // Listen for custom update events triggered by the Admin Panel
    const handleAdminUpdate = () => {
      loadSectionData(false);
    };

    window.addEventListener('homeDataUpdated', handleAdminUpdate);
    window.addEventListener('focus', handleAdminUpdate);

    return () => {
      window.removeEventListener('homeDataUpdated', handleAdminUpdate);
      window.removeEventListener('focus', handleAdminUpdate);
    };
  }, [loadSectionData]);

  useEffect(() => {
    if (!data || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [data]);

  if (loading || !data) return null;

  const nodes = data.hexagon_nodes || [];

  // Default positions aligned with the pentagonal diagram
  const defaultPositions = [
    { top: '21%', left: '50%', x: 50, y: 21, color: '#e53e3e' }, // Top Center
    { top: '37%', left: '24%', x: 24, y: 37, color: '#00a896' }, // Top Left
    { top: '37%', left: '76%', x: 76, y: 37, color: '#6b21a8' }, // Top Right
    { top: '73%', left: '32%', x: 32, y: 73, color: '#2f9e44' }, // Bottom Left
    { top: '73%', left: '68%', x: 68, y: 73, color: '#0077b6' }, // Bottom Right
  ];

  const defaultIcons = [
    // Fire & Gas (Flame)
    <path key="icon-1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />,
    // Analytical Instrumentation (Flask)
    <path key="icon-2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.6 15.12a2 2 0 00-1.022.547l-1.3 1.3A2 2 0 004.7 20.39l14.6-14.6a2 2 0 000-2.83l-1.3-1.3z" />,
    // Industrial Automation (Growth/Robotics)
    <path key="icon-3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    // System Integration (Network Nodes)
    <path key="icon-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-5.367 3 3 0 000 5.367zm0 6a3 3 0 100 5.367 3 3 0 000-5.367z" />,
    // Testing Measurement (Gauge/Meter)
    <path key="icon-5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  ];

  const getNodePos = (node, index, total) => {
    const cardColor = node?.bg_color || node?.color || defaultPositions[index]?.color || '#3b82f6';

    if (total === 5 && defaultPositions[index]) {
      return { ...defaultPositions[index], color: cardColor };
    }

    const angle = (index * (360 / total) - 90) * (Math.PI / 180);
    const x = 50 + 32 * Math.cos(angle);
    const y = 50 + 30 * Math.sin(angle);
    return { top: `${y}%`, left: `${x}%`, x, y, color: cardColor };
  };

  const resolveNodeLink = (node) => {
    if (!node) return '/products';
    const rawPath = node.url || node.link || node.link_url || node.path || node.target_url || '';
    return typeof rawPath === 'string' && rawPath.trim() !== '' ? rawPath.trim() : '/products';
  };

  const missionHeadingText = (data.mission_heading || data.mission_description || '').trim();
  const visionHeadingText = (data.vision_heading || data.vision_description || '').trim();

  return (
    <section ref={sectionRef} className="py-10 sm:py-25 bg-white text-slate-800 relative overflow-hidden">
      <style>{`
        @keyframes essCenterPulse {
          0%, 100% { transform: scale(1); opacity: 0.35; }
          50% { transform: scale(1.12); opacity: 0.6; }
        }
        @keyframes essRingExpand {
          0% { transform: scale(0.9); opacity: 0.8; }
          100% { transform: scale(1.25); opacity: 0; }
        }
        @keyframes essCenterFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes essFloatCard {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-5px); }
        }
        @keyframes essPopIn {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.6); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes essFadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .ess-slide-hidden {
          opacity: 0;
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .ess-animate-up {
          animation: essFadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 flex flex-col items-center gap-12">

        {/* 1. TOP GRAPHIC CONTAINER */}
        <div className={`w-full relative flex flex-col items-center justify-center ${isVisible ? 'ess-animate-up' : 'ess-slide-hidden'}`}>
          <div className="relative w-full min-h-[700px] sm:min-h-[780px] rounded-3xl bg-gradient-to-br from-blue-50/30 via-slate-50 to-indigo-50/20 border border-slate-200/80 p-2 sm:p-6 shadow-lg overflow-hidden flex flex-col items-center justify-center">

            {/* SVG CONNECTING LINES & DOTS */}
            <div className="absolute inset-0 hidden sm:block pointer-events-none z-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {nodes.map((node, index) => {
                  const pos = getNodePos(node, index, nodes.length);
                  return (
                    <g key={`connection-${index}`}>
                      <line
                        x1="50"
                        y1="50"
                        x2={pos.x}
                        y2={pos.y}
                        stroke={pos.color}
                        strokeWidth="0.4"
                        strokeOpacity="0.85"
                      />
                      <circle
                        cx={50 + (pos.x - 50) * 0.38}
                        cy={50 + (pos.y - 50) * 0.38}
                        r="0.8"
                        fill={pos.color}
                      >
                        <animate
                          attributeName="r"
                          values="0.6;1.2;0.6"
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="0.9"
                        fill={pos.color}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* CENTER BRAND BADGE - ENLARGED DISPLAY */}
            <div 
              className="relative w-44 h-44 sm:w-56 sm:h-56 my-4 z-20"
              style={{ animation: 'essCenterFloat 5s ease-in-out infinite' }}
            >
              <div
                className="absolute -inset-5 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
                  animation: 'essCenterPulse 3s ease-in-out infinite',
                }}
              />
              <div
                className="absolute inset-0 rounded-full border border-blue-400 pointer-events-none"
                style={{ animation: 'essRingExpand 3s ease-out infinite' }}
              />

              <div className="relative z-20 w-full h-full rounded-full shadow-xl border-[4px] border-slate-200 bg-white flex flex-col items-center justify-center p-4 text-center transition-transform duration-300 hover:scale-105">
                {data.center_logo_url ? (
                  <div className="bg-white w-[85%] h-[85%] rounded-xl flex items-center justify-center p-2">
                    <img 
                      src={data.center_logo_url} 
                      alt="ESS Logo" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                ) : (
                  <>
                    <div className="text-slate-900 font-black tracking-tighter text-3xl sm:text-4xl leading-none">
                      {data.center_circle_title || 'ESS'}
                    </div>
                    <span className="block text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mt-1">
                      {data.center_circle_subtitle || 'ESSENTIAL SYSTEMS & SERVICES'}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* DESKTOP HEXAGON CARDS */}
            <div className="absolute inset-0 hidden sm:block z-30">
              {nodes.map((node, index) => {
                const pos = getNodePos(node, index, nodes.length);
                const targetPath = resolveNodeLink(node);
                const isExternal = targetPath.startsWith('http://') || targetPath.startsWith('https://');
                const nodeColor = pos.color;
                const nodeIcon = node.icon_url || node.icon;

                const CardElement = (
                  <div
                    onMouseEnter={() => setActiveNode(index)}
                    onMouseLeave={() => setActiveNode(null)}
                    className="relative group w-[170px] h-[180px] lg:w-[195px] lg:h-[205px] transition-transform duration-300 hover:scale-108"
                  >
                    <div
                      className="absolute inset-0 p-[5px] transition-all duration-300 group-hover:drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)]"
                      style={{
                        backgroundColor: nodeColor,
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                      }}
                    >
                      <div
                        className="w-full h-full bg-white p-[3px] flex flex-col relative overflow-hidden"
                        style={{
                          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        }}
                      >
                        <div
                          className="w-full h-full bg-white flex flex-col relative overflow-hidden"
                          style={{
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                          }}
                        >
                          <div className="h-[48%] w-full relative bg-slate-100 overflow-hidden">
                            {node.image_url || node.image ? (
                              <img
                                src={node.image_url || node.image}
                                alt={node.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-t from-slate-200 to-slate-50 flex items-center justify-center text-slate-400 text-[10px] font-semibold">
                                Image
                              </div>
                            )}
                          </div>

                          {/* FLOATING ICON / BADGE OVERLAY WITH WHITE BACKGROUND */}
                          <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                            <div 
                              className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border-[3px] border-white shadow-lg flex items-center justify-center overflow-hidden ring-1 ring-black/5 bg-white p-1.5"
                            >
                              {nodeIcon && (nodeIcon.startsWith('http') || nodeIcon.startsWith('/') || nodeIcon.startsWith('data:image')) ? (
                                <img 
                                  src={nodeIcon} 
                                  alt="" 
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    if (e.target.nextSibling) {
                                      e.target.nextSibling.style.display = 'flex';
                                    }
                                  }}
                                />
                              ) : null}
                              <svg 
                                className="w-6 h-6 lg:w-7 lg:h-7" 
                                style={{ 
                                  color: nodeColor,
                                  display: nodeIcon && (nodeIcon.startsWith('http') || nodeIcon.startsWith('/') || nodeIcon.startsWith('data:image')) ? 'none' : 'flex' 
                                }}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                {defaultIcons[index % defaultIcons.length]}
                              </svg>
                            </div>
                          </div>

                          <div
                            className="h-[52%] w-full flex flex-col items-center justify-center px-2 lg:px-3 pt-3 pb-1 text-center text-white relative transition-colors duration-300"
                            style={{ backgroundColor: nodeColor }}
                          >
                            <span className="text-[11px] lg:text-[12px] font-bold tracking-tight leading-snug text-white block max-w-full break-words">
                              {node.title}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );

                const cardStyle = {
                  top: pos.top,
                  left: pos.left,
                  animation: isVisible
                    ? `essPopIn 0.6s ease-out ${index * 0.12}s both, essFloatCard 4s ease-in-out ${index * 0.5}s infinite`
                    : 'none',
                };

                if (isExternal) {
                  return (
                    <a
                      key={node.id || index}
                      href={targetPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute cursor-pointer"
                      style={cardStyle}
                    >
                      {CardElement}
                    </a>
                  );
                }

                return (
                  <Link
                    key={node.id || index}
                    to={targetPath}
                    className="absolute cursor-pointer"
                    style={cardStyle}
                  >
                    {CardElement}
                  </Link>
                );
              })}
            </div>

            {/* MOBILE LAYOUT */}
            <div className="flex flex-col gap-3 sm:hidden w-full pt-4 relative z-10">
              {nodes.map((node, index) => {
                const targetPath = resolveNodeLink(node);
                const isExternal = targetPath.startsWith('http://') || targetPath.startsWith('https://');
                const nodeColor = node.bg_color || node.color || '#3b82f6';
                const nodeIcon = node.icon_url || node.icon;

                const MobileContent = (
                  <>
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                      {node.image_url || node.image ? (
                        <img src={node.image_url || node.image} alt={node.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-500">Image</div>
                      )}
                    </div>
                    <span className="text-[13px] font-bold text-slate-800 leading-snug flex-1 uppercase text-left">
                      {node.title}
                    </span>
                    <div className="w-9 h-9 rounded-full bg-white border border-slate-200 shrink-0 shadow-xs flex items-center justify-center p-1.5">
                      {nodeIcon && (nodeIcon.startsWith('http') || nodeIcon.startsWith('/') || nodeIcon.startsWith('data:image')) ? (
                        <img src={nodeIcon} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <svg className="w-4 h-4" style={{ color: nodeColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {defaultIcons[index % defaultIcons.length]}
                        </svg>
                      )}
                    </div>
                  </>
                );

                const mobileClass = "relative overflow-hidden flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-white shadow-xs active:scale-[0.98] transition-transform cursor-pointer";

                if (isExternal) {
                  return (
                    <a key={node.id || index} href={targetPath} target="_blank" rel="noopener noreferrer" className={mobileClass}>
                      {MobileContent}
                    </a>
                  );
                }

                return (
                  <Link key={node.id || index} to={targetPath} className={mobileClass}>
                    {MobileContent}
                  </Link>
                );
              })}
            </div>

          </div>
        </div>

        {/* 2. BOTTOM TEXT SECTION (MISSION & VISION) */}
        <div className={`w-full max-w-4xl flex flex-col items-center gap-8 ${isVisible ? 'ess-animate-up' : 'ess-slide-hidden'}`}>
          
          {data.tagline && (
            <span className="text-sm sm:text-base font-black tracking-widest text-slate-800 uppercase text-center">
              {data.tagline}
            </span>
          )}

          {/* MISSION SECTION */}
          {(data.mission_title || data.mission_quote || missionHeadingText || (data.mission_points && data.mission_points.length > 0)) && (
            <div className="space-y-4 w-full text-left">
              {data.mission_title && (
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1E3A8A] tracking-wider uppercase text-center drop-shadow-xs">
                  {data.mission_title}
                </h3>
              )}

              {data.mission_quote && (
                <p className={BODY_TEXT_CLASS + ' whitespace-pre-line'}>
                  {data.mission_quote.trim()}
                </p>
              )}

              {missionHeadingText && (
                <p className={HEADING_TEXT_CLASS}>
                  {missionHeadingText}
                </p>
              )}

              {Array.isArray(data.mission_points) && data.mission_points.length > 0 && (
                <div className="space-y-4 pt-3">
                  {data.mission_points.map((pt, idx) => (
                    <div key={pt.id || idx} className="space-y-1">
                      <h4 className={POINT_TITLE_CLASS}>
                        {pt.title}
                      </h4>
                      {pt.description && (
                        <p className={BODY_TEXT_CLASS}>
                          {pt.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VISION SECTION */}
          {(data.vision_title || data.vision_quote || visionHeadingText || (data.vision_points && data.vision_points.length > 0)) && (
            <div className="space-y-4 w-full pt-8 border-t border-slate-200 text-left">
              {data.vision_title && (
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1E3A8A] tracking-wider uppercase text-center drop-shadow-xs">
                  {data.vision_title}
                </h3>
              )}

              {data.vision_quote && (
                <p className={BODY_TEXT_CLASS + ' whitespace-pre-line'}>
                  {data.vision_quote.trim()}
                </p>
              )}

              {visionHeadingText && (
                <p className={HEADING_TEXT_CLASS}>
                  {visionHeadingText}
                </p>
              )}

              {Array.isArray(data.vision_points) && data.vision_points.length > 0 && (
                <div className="space-y-4 pt-3">
                  {data.vision_points.map((pt, idx) => (
                    <div key={pt.id || idx} className="space-y-1">
                      <h4 className={POINT_TITLE_CLASS}>
                        {pt.title}
                      </h4>
                      {pt.description && (
                        <p className={BODY_TEXT_CLASS}>
                          {pt.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CALL TO ACTION BUTTON */}
          {(data.cta_url || data.cta_text) && (
            <div className="pt-2 text-center">
              <Link
                to={data.cta_url || '/capabilities'}
                className="inline-flex items-center justify-center gap-3 bg-[#1E3A8A] hover:bg-[#155CFB] text-white text-xs font-black px-8 py-4 rounded-xl shadow-md transition-all active:scale-95"
              >
                <span>{data.cta_text || 'DISCOVER CAPABILITIES'}</span>
                <span>&rarr;</span>
              </Link>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};

export default MissionVisionSection;