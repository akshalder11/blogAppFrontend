import { motion, AnimatePresence } from "framer-motion";
import { WifiCog } from "lucide-react";

const LoadingSplash = ({ isSuccess }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-2">
        <motion.div
          className="flex flex-col items-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-3xl font-bold text-blue-600">BlogApp</div>
          {isSuccess ? (
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
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
                <WifiCog className="h-5 w-5 text-green-500" />
              </motion.div>
              <span>Connected to the server</span>
            </div>
          ) : (
            <div className="text-sm text-gray-500 mt-3 mb-1">
              Connecting to server...
            </div>
          )}
        </motion.div>

        <motion.div
          className="h-2 w-48 overflow-hidden rounded-full bg-gray-200"
          initial={{ width: 0, opacity: 1 }}
          animate={{ 
            width: 192,
            opacity: isSuccess ? 0 : 1
          }}
          transition={{ 
            width: { duration: 0.8 },
            opacity: { duration: 0.3 }
          }}
        >
          {!isSuccess && (
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
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingSplash;
