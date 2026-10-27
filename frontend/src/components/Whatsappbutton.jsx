// Floating WhatsApp button — React + Tailwind
// Usage: <WhatsAppButton /> (put it once in App.jsx or your layout)

const PHONE_NUMBER = "+919876543210"; // country code + number, no "+" or spaces
const DEFAULT_MESSAGE = "Hi, I would like to know more about your services.";
const WHATSAPP_URL = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

const WhatsAppButton = () => {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-20 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 hover:scale-110 hover:bg-[#1ebe5b] focus:outline-none focus-visible:ring-4 focus-visible:ring-green-300"
    >
      {/* Soft pulse ring */}
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30" />

      {/* WhatsApp icon */}
      <svg
        viewBox="0 0 32 32"
        className="relative h-8 w-8 fill-current"
        aria-hidden="true"
      >
        <path d="M16.002 3C9.374 3 4 8.373 4 15c0 2.385.697 4.607 1.894 6.48L4 29l7.7-1.86A11.94 11.94 0 0 0 16.002 27C22.63 27 28 21.627 28 15S22.63 3 16.002 3zm0 21.8a9.77 9.77 0 0 1-4.98-1.36l-.357-.212-4.57 1.104 1.13-4.45-.233-.366A9.77 9.77 0 0 1 6.2 15c0-5.412 4.39-9.8 9.802-9.8 5.41 0 9.798 4.388 9.798 9.8 0 5.41-4.388 9.8-9.798 9.8zm5.377-7.34c-.295-.147-1.745-.86-2.016-.958-.27-.1-.467-.147-.664.147-.196.295-.762.958-.934 1.155-.172.196-.344.22-.64.074-.294-.148-1.245-.459-2.372-1.464-.877-.782-1.469-1.748-1.64-2.043-.173-.295-.019-.454.129-.6.133-.132.295-.344.442-.516.148-.172.197-.295.295-.492.1-.196.05-.369-.024-.516-.074-.147-.664-1.6-.91-2.19-.24-.575-.483-.497-.664-.506l-.566-.01c-.196 0-.516.074-.786.369-.27.295-1.032 1.008-1.032 2.46s1.056 2.853 1.204 3.05c.147.196 2.078 3.173 5.035 4.45.703.303 1.252.484 1.68.62.706.224 1.35.192 1.858.116.567-.085 1.745-.713 1.99-1.402.246-.69.246-1.28.172-1.403-.074-.123-.27-.196-.566-.344z" />
      </svg>
    </a>
  );
};

export default WhatsAppButton;