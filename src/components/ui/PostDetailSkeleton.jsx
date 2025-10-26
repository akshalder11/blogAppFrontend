import { motion } from "framer-motion";

const PostDetailSkeleton = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex justify-center py-8"
    >
      <div className="w-full max-w-3xl rounded-lg border border-gray-200 bg-white shadow-sm p-6">
        {/* Title */}
        <div className="h-9 w-3/4 bg-gray-200 rounded animate-pulse mb-4" />

        {/* Author and Date */}
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-6" />

        {/* Content */}
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-start gap-4 mt-6">
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostDetailSkeleton;
