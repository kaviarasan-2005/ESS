import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset window/html/body
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.body.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Also reset any wrapper div that might be the real scroll container
    document.querySelectorAll("*").forEach((el) => {
      if (el.scrollTop > 0) {
        el.scrollTop = 0;
      }
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;