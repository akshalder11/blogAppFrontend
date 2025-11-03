import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Helper component to auto-advance slides every 7 seconds
const AutoAdvance = ({ setCurrentIndex, setDirection, itemCount }) => {
  useEffect(() => {
    if (itemCount <= 1) return;
    const id = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev === itemCount - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(id);
  }, [itemCount, setCurrentIndex, setDirection]);
  return null;
};

const Carousel = ({ items = [], renderItem, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // kept for API parity, not used for fade

  if (!items || items.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const goToIndex = (index) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Fade variants for crossfade transitions
  const fadeVariants = {
    enter: {
      opacity: 0,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    center: {
      opacity: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    exit: {
      opacity: 0,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Auto-advance every 7 seconds when multiple items */}
      {items.length > 1 && (
        <AutoAdvance setCurrentIndex={setCurrentIndex} setDirection={setDirection} itemCount={items.length} />
      )}
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-lg bg-gray-100 h-64 sm:h-80 md:h-96">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentIndex}
            variants={fadeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              opacity: { duration: 0.35, ease: 'easeInOut' },
            }}
            className="absolute inset-0 w-full h-full"
            style={{ willChange: 'opacity' }}
          >
            {renderItem(items[currentIndex], currentIndex)}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons - Only show if more than 1 item */}
        {items.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all backdrop-blur-sm cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all backdrop-blur-sm cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Indicator Dots - Only show if more than 1 item */}
      {items.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`relative h-2 rounded-full overflow-hidden transition-all cursor-pointer ${
                index === currentIndex
                  ? 'w-8 bg-gray-400/20'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === currentIndex && (
                <motion.div
                  key={`progress-${currentIndex}`}
                  className="absolute inset-y-0 left-0 bg-gray-600"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 7, ease: 'linear' }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Counter */}
      {items.length > 1 && (
        <div className="text-center mt-2 text-sm text-gray-600">
          {currentIndex + 1} / {items.length}
        </div>
      )}
    </div>
  );
};

export default Carousel;
