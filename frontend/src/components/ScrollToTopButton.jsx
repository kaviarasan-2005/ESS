import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="
            fixed
            bottom-6
            right-6
            z-50
            w-12
            h-12
            flex
            items-center
            justify-center
            rounded-full
            bg-blue-600
            text-white
            shadow-lg
            transition-all
            duration-300
            hover:bg-blue-700
            hover:scale-110
            active:scale-95
            cursor-pointer
          "
        >
          <ChevronUp size={24} strokeWidth={2.5} />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;