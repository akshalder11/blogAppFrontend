import { motion, AnimatePresence } from "framer-motion";
import { WifiCog, Clock } from "lucide-react";

const LoadingSplash = ({ isSuccess, countdown, isRetrying }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className="fixed inset-0 z-150 flex flex-col items-center justify-between bg-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main content - centered */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <motion.div
            className="flex flex-col items-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* App Name */}
            <div className="text-3xl font-bold text-blue-600 mb-6">BlogApp</div>
            
            {/* Status Message */}
            {isSuccess ? (
              <div className="flex flex-col items-center gap-3">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [1, 0.8, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    times: [0, 0.5, 1],
                  }}
                >
                  <WifiCog className="h-8 w-8 text-green-500" />
                </motion.div>
                <span className="text-sm text-gray-500">Connected to the server</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 w-full">
                <div className="text-sm text-gray-500">
                  {isRetrying ? 'Retrying connection...' : 'Connecting to server...'}
                </div>
                
                {/* Progress Bar */}
                <motion.div
                  className="h-2 w-48 overflow-hidden rounded-full bg-gray-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="h-full bg-blue-600"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                  />
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Countdown and helper text - at bottom */}
      {!isSuccess && (
        <motion.div 
          className="pb-12 px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Countdown Timer */}
          {countdown !== null && countdown > 0 && (
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-2">
              <Clock className="h-4 w-4" />
              <span>Server spin-up time: {formatTime(countdown)}</span>
            </div>
          )}
          
          <div className="text-xs text-gray-400 max-w-sm mx-auto">
            {isRetrying 
              ? 'The server is waking up. Please wait...' 
              : 'Server may be idle. Spinning up (this can take up to 2 minutes)...'
            }
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LoadingSplash;
