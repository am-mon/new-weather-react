import { useState, useEffect } from "react";
import { PiArrowCircleUpLight } from "react-icons/pi";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      {visible && (
        <button
          onClick={scrollToTop}
          className="z-10 fixed bottom-8 right-4 md:right-8 text-4xl md:text-5xl cursor-pointer bg-blue-500 text-white p-1 rounded-full shadow-lg hover:bg-blue-600 transition"
          aria-label="Scroll to top"
        >
          <PiArrowCircleUpLight />
        </button>
      )}
    </>
  );
}
