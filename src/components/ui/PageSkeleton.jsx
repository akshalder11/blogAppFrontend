import { motion, AnimatePresence } from 'framer-motion';

const PostCardSkeleton = () => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow transition-shadow">
      <div className="p-6 flex flex-col gap-4">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-7 w-[80%] bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-[40%] bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-[90%] bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-[60%] bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

const PageSkeleton = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex min-h-full flex-col">
      {/* Navbar placeholder - matches real navbar height */}
      {/* <header className="h-16 border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="flex items-center gap-4">
            <div className="h-9 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-9 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </header> */}

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page title */}
        {/* <div className="mb-8">
          <div className="h-9 w-48 bg-gray-200 rounded animate-pulse" />
        </div> */}

        {/* Posts grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </main>
    </motion.div>
  );
};

export default PageSkeleton;
