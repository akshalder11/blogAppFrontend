import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

// Helper component to auto-advance slides every 7 seconds
const AutoAdvance = ({ setCurrentIndex, setDirection, itemCount, isPaused }) => {
  useEffect(() => {
    if (itemCount <= 1 || isPaused) return;
    const id = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev === itemCount - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(id);
  }, [itemCount, setCurrentIndex, setDirection, isPaused]);
  return null;
};

const Carousel = ({ items = [], renderItem, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Preload ALL images at once and track progress
  useEffect(() => {
    if (!items || items.length === 0) {
      setAllImagesLoaded(true);
      return;
    }

    const imageUrls = items.filter(
      (item) => typeof item === 'string' && item.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)
    );

    if (imageUrls.length === 0) {
      setAllImagesLoaded(true);
      return;
    }

    let loadedCount = 0;
    const totalImages = imageUrls.length;
    const imagePromises = [];

    imageUrls.forEach((url) => {
      const promise = new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          setLoadingProgress(Math.round((loadedCount / totalImages) * 100));
          resolve();
        };
        img.onerror = () => {
          loadedCount++;
          setLoadingProgress(Math.round((loadedCount / totalImages) * 100));
          resolve(); // Still resolve to not block other images
        };
        img.src = url;
      });
      imagePromises.push(promise);
    });

    // Wait for all images to load
    Promise.all(imagePromises).then(() => {
      setAllImagesLoaded(true);
    });
  }, [items]);

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
      {/* Show loading screen until all images are cached */}
      {!allImagesLoaded ? (
        <div className="relative overflow-hidden rounded-lg bg-gray-100 h-64 sm:h-80 md:h-96">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            <div className="text-sm text-gray-600 font-medium">
              Loading images... {loadingProgress}%
            </div>
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Auto-advance every 7 seconds when multiple items */}
          {items.length > 1 && (
            <AutoAdvance 
              setCurrentIndex={setCurrentIndex} 
              setDirection={setDirection} 
              itemCount={items.length}
              isPaused={false}
            />
          )}
          {/* Carousel Container */}
          <div className="relative overflow-hidden rounded-lg bg-gray-100 h-64 sm:h-80 md:h-96">
            <AnimatePresence initial={false} mode="wait">
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
        </>
      )}

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
