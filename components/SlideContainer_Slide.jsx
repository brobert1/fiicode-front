import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import IntroSectionIndex from "@components/IntroSectionIndex";
import SecondContainerIndex from "@components/SecondContainerIndex";
import AboutContainerIndex from "@components/AboutContainerIndex";

const slides = [
  { id: 1, component: <IntroSectionIndex /> },
  { id: 2, component: <SecondContainerIndex /> },
  { id: 3, component: <AboutContainerIndex /> },
];

export default function Carousel() {
  const [index, setIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [yPosition, setYPosition] = useState(0); 

  const nextSlide = () => {
    if (isScrolling) return; 
    setIsScrolling(true);
    setIndex((prev) => {
      const nextIndex = prev + 1;
      return nextIndex < slides.length ? nextIndex : prev;
    });
    setYPosition((prev) => prev - 100);
  };

  const prevSlide = () => {
    if (isScrolling) return; 
    setIsScrolling(true);
    setIndex((prev) => {
      const prevIndex = prev - 1;
      return prevIndex >= 0 ? prevIndex : prev;
    });
    setYPosition((prev) => prev + 100); 
  };

  const handlers = useSwipeable({
    onSwipedUp: nextSlide,
    onSwipedDown: prevSlide,
  });

  useEffect(() => {
    const handleWheel = (event) => {
      if (isScrolling) return;
      if (event.deltaY > 0) nextSlide();
      else if (event.deltaY < 0) prevSlide();
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isScrolling]);

  useEffect(() => {
    if (isScrolling) {
      const timer = setTimeout(() => setIsScrolling(false), 800); 
      return () => clearTimeout(timer);
    }
  }, [isScrolling]);

  return (
    <div {...handlers} className="relative w-screen h-screen overflow-hidden">
      <div className="absolute w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[index].id}
            initial={{ opacity: 0, y: yPosition }}
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -yPosition }} 
            transition={{ duration: 0.5 }}
            className="absolute w-full h-full flex items-center justify-center"
          >
            {slides[index].component}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
