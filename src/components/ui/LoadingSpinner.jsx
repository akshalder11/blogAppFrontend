import { motion } from 'framer-motion';

const LoadingSpinner = () => (
  <div className="flex h-40 items-center justify-center">
    <motion.div
      className="h-16 w-16 rounded-full border-4 border-t-indigo-600"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);

export default LoadingSpinner;