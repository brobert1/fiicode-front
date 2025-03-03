import { useRef, useState, useEffect } from "react";

/**
 * Custom hook for handling horizontal scrolling with navigation buttons
 * @param {number} itemWidth - Approximate width of a scrollable item
 * @returns {Object} - Scroll container ref and scroll control functions/states
 */
const useScroll = (itemWidth = 180) => {
  const scrollContainerRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftButton(container.scrollLeft > 0);
      setShowRightButton(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      checkScrollButtons();

      return () => {
        container.removeEventListener("scroll", checkScrollButtons);
      };
    }
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -itemWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: itemWidth, behavior: "smooth" });
    }
  };

  return {
    scrollContainerRef,
    showLeftButton,
    showRightButton,
    scrollLeft,
    scrollRight,
    checkScrollButtons,
  };
};

export default useScroll;
