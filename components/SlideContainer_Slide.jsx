import { useState, useRef, useEffect } from "react";

const SlideContainer_Slide = ({ children }) => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollTop = containerRef.current.scrollTop;
      const slideHeight = containerRef.current.clientHeight;
      const index = Math.round(scrollTop / slideHeight);
      setActiveIndex(index);
    };

    const container = containerRef.current;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
        {children.map((_, index) => (
          <span
            key={index}
            className={`h-3 w-3 rounded-full transition-all ${
              index === activeIndex ? "bg-green-800 scale-125" : "bg-gray-400"
            }`}
          ></span>
        ))}
      </div>


      <div
        ref={containerRef}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory custom-scrollbar rounded-3xl shadow-[0px_0px_20px_rgba(255,255,255,0.9)]"
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="h-screen flex justify-center items-center snap-center bg-transparent p-6 rounded-lg shadow-xl "
          >
            {child}
          </div>
        ))}
      </div>
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }

        .custom-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari */
        }
      `}</style>
    </div>
  );
};

export default SlideContainer_Slide;
