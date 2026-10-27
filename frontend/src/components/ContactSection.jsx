import React, { useEffect, useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { fetchContactPage, submitContactForm } from '../services/api';

/* ── EmailJS config (from .env) ── */
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/* ── Success popup settings ── */
const AUTO_CLOSE_MS = 4000;
const SUCCESS_TITLE = 'Inquiry Sent!';
const SUCCESS_MESSAGE =
  'Thank you for contacting us. Our team will get back to you shortly.';

const sendEmail = (data) => {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    return Promise.reject(
      new Error('EmailJS env keys missing. Check .env and restart the dev server.')
    );
  }

  return emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      name: data.name,
      location: data.location || 'Not provided',
      email: data.email,
      reply_to: data.email,
      contact_number: data.contact_number || 'Not provided',
      products: data.selected_products.join(', ') || 'None selected',
      message: data.message,
    },
    { publicKey: EMAILJS_PUBLIC_KEY }
  );
};

const DEFAULT_CONTENT = {
  tagline: 'REACH US',
  title: 'Get in Touch.',
  description:
    'We are never out of reach and always at your service. We can’t wait to grow along with you.',
  locations: [
    {
      id: 'loc-1',
      title: 'Main Office',
      address:
        'P.O. Box: 319, Buzwair Commercial Building, Al Mansoura Zone: 25, Street: 330, Building: 57, Doha, Qatar.',
    },
    {
      id: 'loc-2',
      title: 'Warehouse',
      address: 'P.O. Box: 319, Street 46, Industrial Area, Doha, Qatar.',
    },
    {
      id: 'loc-3',
      title: 'Engineering Facility',
      address: 'P.O. Box: 319, Street 14, Industrial Area Doha, Qatar.',
    },
  ],
  email: 'sales@essme.com',
  phone: '+974 4405 9666',
  product_options: [
    'Fire & Gas Systems',
    'Analytical Instrumentation',
    'Analyzer System Integration',
    'Industrial Automation',
    'Process Equipments',
  ],
  form_labels: {
    name_label: 'Name',
    name_placeholder: 'Your name',
    location_label: 'Location',
    location_placeholder: 'Your location',
    email_label: 'Email',
    email_placeholder: 'you@example.com',
    contact_number_label: 'Contact Number',
    contact_number_placeholder: '+974 ...',
    products_label: 'Choose Products',
    message_label: 'Message',
    message_placeholder: 'Tell us about your requirements...',
    submit_btn_text: 'SUBMIT',
    email_heading: 'Email Us',
    phone_heading: 'Call to Us',
    social_heading: 'FOLLOW OUR SOCIAL MEDIA',
  },
  social_links: [{ id: 'soc-1', platform: 'linkedin', url: 'https://linkedin.com' }],
};

const ICON_BOX_CLASS =
  'w-10 h-10 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#1E3A8A] group-hover:text-white transition-all duration-300 shadow-xs';

const IconWrap = ({ children }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const PinIcon = () => (
  <IconWrap>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </IconWrap>
);

const MailIcon = () => (
  <IconWrap>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 7L2 7" />
  </IconWrap>
);

const PhoneIcon = () => (
  <IconWrap>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </IconWrap>
);

/* ── Success Modal Component ── */
const SubmitSuccessModal = ({ show, onClose, title, message }) => {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, AUTO_CLOSE_MS);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <style>{`
        @keyframes successPopIn {
          0% { transform: scale(0.6); opacity: 0; }
          70% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes successDrawCheck {
          from { stroke-dashoffset: 30; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes successShrinkBar {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>

      <div
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl px-8 py-10 text-center overflow-hidden"
        style={{ animation: 'successPopIn 0.45s ease-out forwards' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative mx-auto mb-6 w-20 h-20">
          <span className="absolute inset-0 rounded-full bg-green-400/40 animate-ping" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 13l4 4L19 7"
                style={{
                  strokeDasharray: 30,
                  strokeDashoffset: 30,
                  animation: 'successDrawCheck 0.5s ease-out 0.3s forwards',
                }}
              />
            </svg>
          </div>
        </div>

        <h3 className="text-2xl font-black text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-6">{message}</p>

        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 rounded-full bg-[#1E3A8A] text-white text-sm font-semibold hover:bg-[#122760] transition cursor-pointer"
        >
          Done
        </button>

        <div
          className="absolute bottom-0 left-0 h-1 bg-emerald-500"
          style={{ animation: `successShrinkBar ${AUTO_CLOSE_MS}ms linear forwards` }}
        />
      </div>
    </div>
  );
};

const ContactSection = () => {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    email: '',
    contact_number: '',
    selected_products: [],
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', msg: '' });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchContactPage()
      .then((res) => {
        if (!isMounted) return;
        const payload = res?.data?.data || res?.data || res || {};
        const cmsContent = payload.content || {};
        const savedLabels = cmsContent.form_labels || {};

        setContent({
          tagline: cmsContent.tagline ?? DEFAULT_CONTENT.tagline,
          title: cmsContent.title ?? DEFAULT_CONTENT.title,
          description: cmsContent.description ?? DEFAULT_CONTENT.description,
          locations: Array.isArray(cmsContent.locations)
            ? cmsContent.locations
            : DEFAULT_CONTENT.locations,
          email: cmsContent.email !== undefined ? cmsContent.email : (payload.general_email || DEFAULT_CONTENT.email),
          phone: cmsContent.phone !== undefined ? cmsContent.phone : (payload.general_phone || DEFAULT_CONTENT.phone),
          product_options: Array.isArray(cmsContent.product_options)
            ? cmsContent.product_options
            : DEFAULT_CONTENT.product_options,
          form_labels: {
            name_label: savedLabels.name_label || DEFAULT_CONTENT.form_labels.name_label,
            name_placeholder: savedLabels.name_placeholder || DEFAULT_CONTENT.form_labels.name_placeholder,
            location_label: savedLabels.location_label || DEFAULT_CONTENT.form_labels.location_label,
            location_placeholder: savedLabels.location_placeholder || DEFAULT_CONTENT.form_labels.location_placeholder,
            email_label: savedLabels.email_label || DEFAULT_CONTENT.form_labels.email_label,
            email_placeholder: savedLabels.email_placeholder || DEFAULT_CONTENT.form_labels.email_placeholder,
            contact_number_label: savedLabels.contact_number_label || DEFAULT_CONTENT.form_labels.contact_number_label,
            contact_number_placeholder: savedLabels.contact_number_placeholder || DEFAULT_CONTENT.form_labels.contact_number_placeholder,
            products_label: savedLabels.products_label || DEFAULT_CONTENT.form_labels.products_label,
            message_label: savedLabels.message_label || DEFAULT_CONTENT.form_labels.message_label,
            message_placeholder: savedLabels.message_placeholder || DEFAULT_CONTENT.form_labels.message_placeholder,
            submit_btn_text: savedLabels.submit_btn_text || DEFAULT_CONTENT.form_labels.submit_btn_text,
            email_heading: savedLabels.email_heading || DEFAULT_CONTENT.form_labels.email_heading,
            phone_heading: savedLabels.phone_heading || DEFAULT_CONTENT.form_labels.phone_heading,
            social_heading: savedLabels.social_heading || DEFAULT_CONTENT.form_labels.social_heading,
          },
          social_links: Array.isArray(cmsContent.social_links)
            ? cmsContent.social_links
            : DEFAULT_CONTENT.social_links,
        });
      })
      .catch((err) => console.error('Failed to fetch Contact Section content:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (loading || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [loading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductToggle = (productName) => {
    setFormData((prev) => {
      const exists = prev.selected_products.includes(productName);
      if (exists) {
        return {
          ...prev,
          selected_products: prev.selected_products.filter((p) => p !== productName),
        };
      } else {
        return {
          ...prev,
          selected_products: [...prev.selected_products, productName],
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (content.product_options.length > 0 && formData.selected_products.length === 0) {
      setFeedback({ type: 'error', msg: 'Please select at least one product.' });
      return;
    }

    setSubmitting(true);
    setFeedback({ type: '', msg: '' });

    const [backendResult, emailResult] = await Promise.allSettled([
      submitContactForm(formData),
      sendEmail(formData),
    ]);

    const backendOk =
      backendResult.status === 'fulfilled' &&
      Boolean(backendResult.value?.data?.success || backendResult.value?.success);
    const emailOk = emailResult.status === 'fulfilled';

    if (backendOk || emailOk) {
      setShowSuccess(true);
      setFormData({
        name: '',
        location: '',
        email: '',
        contact_number: '',
        selected_products: [],
        message: '',
      });
    } else {
      setFeedback({
        type: 'error',
        msg: 'Failed to send message. Please try again or reach out directly via phone.',
      });
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <section className="bg-white py-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-800 border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  const labels = content.form_labels;

  return (
    <section ref={sectionRef} className="bg-white text-slate-900 py-12 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-16">
      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .slide-in-left { animation: slideInLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .slide-in-right { animation: slideInRight 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* items-stretch makes both cards the same height */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">

          {/* LEFT FORM SECTION */}
          <div
            className={`lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl shadow-slate-200/50 flex flex-col justify-between h-full ${
              isVisible ? 'slide-in-left' : 'opacity-0'
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* NAME & LOCATION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    {labels.name_label}
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder={labels.name_placeholder}
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#f8fafc] text-slate-900 placeholder-slate-400 text-sm sm:text-base px-4 py-3 sm:py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white font-medium transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    {labels.location_label}
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder={labels.location_placeholder}
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full bg-[#f8fafc] text-slate-900 placeholder-slate-400 text-sm sm:text-base px-4 py-3 sm:py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white font-medium transition-all"
                  />
                </div>
              </div>

              {/* EMAIL & PHONE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    {labels.email_label}
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder={labels.email_placeholder}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#f8fafc] text-slate-900 placeholder-slate-400 text-sm sm:text-base px-4 py-3 sm:py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white font-medium transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    {labels.contact_number_label}
                  </label>
                  <input
                    type="tel"
                    name="contact_number"
                    placeholder={labels.contact_number_placeholder}
                    value={formData.contact_number}
                    onChange={handleInputChange}
                    className="w-full bg-[#f8fafc] text-slate-900 placeholder-slate-400 text-sm sm:text-base px-4 py-3 sm:py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white font-medium transition-all"
                  />
                </div>
              </div>

              {/* PRODUCTS CHECKBOX SELECTION */}
              {content.product_options.length > 0 && (
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-3">
                    {labels.products_label} <span className="text-rose-600">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {content.product_options.map((prod, idx) => {
                      const isChecked = formData.selected_products.includes(prod);
                      return (
                        <label
                          key={idx}
                          className={`flex items-center gap-3 text-xs sm:text-sm font-semibold p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                            isChecked
                              ? 'bg-blue-50/70 border-[#1E3A8A] text-[#1E3A8A]'
                              : 'bg-[#f8fafc] border-slate-200 text-slate-700 hover:bg-slate-100/80'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleProductToggle(prod)}
                            className="w-4 h-4 accent-[#1E3A8A] rounded cursor-pointer shrink-0"
                          />
                          <span className="leading-snug">{prod}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MESSAGE TEXTAREA */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  {labels.message_label}
                </label>
                <textarea
                  name="message"
                  rows="4"
                  placeholder={labels.message_placeholder}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#f8fafc] text-slate-900 placeholder-slate-400 text-sm sm:text-base px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white font-medium transition-all text-left resize-none"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto bg-[#1E3A8A] hover:bg-[#122760] text-white font-black text-xs sm:text-sm uppercase tracking-widest px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl shadow-lg shadow-blue-950/20 hover:shadow-blue-950/40 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : labels.submit_btn_text}
                </button>
              </div>

              {feedback.msg && (
                <p className={`text-xs sm:text-sm font-bold p-4 rounded-xl ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                  {feedback.msg}
                </p>
              )}
            </form>
          </div>

          {/* RIGHT INFO PANEL */}
          <div
            className={`lg:col-span-5 bg-white text-slate-900 border border-slate-200/90 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl shadow-slate-200/50 flex flex-col gap-8 h-full ${
              isVisible ? 'slide-in-right' : 'opacity-0'
            }`}
          >
            {/* TAGLINE, TITLE & DESCRIPTION */}
            <div className="space-y-3">
              <span className="text-slate-800 font-extrabold text-xs sm:text-sm uppercase tracking-widest block">
                {content.tagline}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {content.title}
              </h2>
              {content.description && (
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed text-left pt-1">
                  {content.description}
                </p>
              )}
            </div>

            {/* DYNAMIC LOCATIONS LIST */}
            {content.locations.length > 0 && (
              <div className="space-y-6 pt-2">
                {content.locations.map((loc, idx) => (
                  <div key={loc.id || idx} className="flex items-start gap-4 group">
                    <div className={ICON_BOX_CLASS}>
                      <PinIcon />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-base sm:text-lg tracking-wide">{loc.title}</h4>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed text-left">{loc.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* EMAIL AND PHONE DETAILS */}
            {(content.email || content.phone) && (
              <div className="space-y-6 pt-6 border-t border-slate-100">
                {content.email && (
                  <div className="flex items-start gap-4 group">
                    <div className={ICON_BOX_CLASS}>
                      <MailIcon />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-slate-900 text-base sm:text-lg tracking-wide">{labels.email_heading}</h4>
                      <a href={`mailto:${content.email}`} className="text-slate-600 hover:text-[#1E3A8A] text-xs sm:text-sm transition-colors block font-medium break-all">
                        {content.email}
                      </a>
                    </div>
                  </div>
                )}

                {content.phone && (
                  <div className="flex items-start gap-4 group">
                    <div className={ICON_BOX_CLASS}>
                      <PhoneIcon />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-slate-900 text-base sm:text-lg tracking-wide">{labels.phone_heading}</h4>
                      <a href={`tel:${content.phone}`} className="text-slate-600 hover:text-[#1E3A8A] text-xs sm:text-sm transition-colors block font-medium">
                        {content.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SOCIAL MEDIA SECTION (pinned to bottom of card) */}
            {content.social_links.length > 0 && (
              <div className="border-t border-slate-100 pt-6 mt-auto">
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-3">
                  {labels.social_heading}
                </h5>
                <div className="flex items-center gap-3">
                  {content.social_links.map((soc, idx) => (
                    <a
                      key={soc.id || idx}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-[#1E3A8A] text-white font-black flex items-center justify-center text-xs hover:bg-[#122760] hover:scale-110 transition-all shadow-md"
                      title={soc.platform}
                    >
                      in
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* SUCCESS POPUP */}
      <SubmitSuccessModal
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
        title={SUCCESS_TITLE}
        message={SUCCESS_MESSAGE}
      />
    </section>
  );
};

export default ContactSection;