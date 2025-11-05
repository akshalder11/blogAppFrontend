import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FilePlus2,
  TextAlignStart,
  Image,
  ListMusic,
  SquarePlay,
} from "lucide-react";
import PageSkeleton from "../components/ui/PageSkeleton";
import PostCard from "../components/PostCard";
import CreatePostModal from "../components/CreatePostModal";
import {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
} from "../features/posts/postsSlice";
import { getAllPosts } from "../api/posts";

// Motion variants
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const headingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// Dropdown animation
const dropdownVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

const Home = () => {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.posts);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMediaType, setSelectedMediaType] = useState('Text');

  // Fetch posts from API
  useEffect(() => {
    fetchPosts();
  }, [dispatch]);

  const fetchPosts = async () => {
    dispatch(fetchPostsStart());
    try {
      const response = await getAllPosts();
      // console.log("Login successful:", response);
      const baseWithoutApi = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || '';
      const pickDisplayUrl = (u) => {
        if (!u) return null;
        return u.startsWith('http') ? u : `${baseWithoutApi}${u}`;
      };

      const formattedPosts = response.map((post) => {
        const mediaType = post.mediaType
          ? post.mediaType.charAt(0) + post.mediaType.slice(1).toLowerCase()
          : 'Text';
        const mediaUrlsArr = Array.isArray(post.mediaUrls)
          ? post.mediaUrls.map(pickDisplayUrl).filter(Boolean)
          : (post.mediaUrls ? [pickDisplayUrl(post.mediaUrls)].filter(Boolean) : []);

        return {
          id: post.id,
          title: post.title,
          author: post.user.username,
          date: post.createdAt,
          content: post.content,
          preview:
            post.content.length > 100
              ? post.content.slice(0, 100) + "..."
              : post.content,
          likes: post.likeCount,
          dislikes: post.dislikeCount,
          isLiked: false,
          mediaType,
          mediaUrls: mediaUrlsArr,
        };
      });

      dispatch(fetchPostsSuccess(formattedPosts));
    } catch (err) {
      const errorMessage = err?.response?.data?.error || err.message;
      dispatch(fetchPostsFailure(errorMessage));
      // Error already shown via toast
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".create-post-wrapper")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    document.removeEventListener("click", handleClickOutside);
  }, []);

  const postOptions = [
    { label: "Text", icon: <TextAlignStart className="w-4 h-4" /> },
    { label: "Image", icon: <Image className="w-4 h-4" /> },
    { label: "Audio", icon: <ListMusic className="w-4 h-4" /> },
    { label: "Video", icon: <SquarePlay className="w-4 h-4" /> },
  ];

  return (
    <motion.div
      className="py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Row */}
      <motion.div
        className="mb-8 flex flex-wrap gap-4 items-center justify-between"
        variants={headingVariants}
      >
        <h1 className="text-3xl font-bold">Latest Blog Posts</h1>

        {/* Create Post Dropdown */}
        {isAuthenticated && (
          <div className="relative create-post-wrapper">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 border border-gray-300 rounded-full bg-white  hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
            >
              <FilePlus2 className="w-4 h-4" />
              <span className="font-medium">Create Post</span>
            </motion.button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-100 z-10"
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {postOptions.map((option, index) => (
                    <button
                      key={index}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedMediaType(option.label);
                        setIsModalOpen(true);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Posts Grid */}
      {loading ? (
        <PageSkeleton />
      ) : (
        posts.length > 0 && (
          <motion.div
            className="columns-1 sm:columns-2 lg:columns-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {posts.map((post) => (
              <motion.div
                key={post.id}
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mb-6 break-inside-avoid cursor-pointer w-full inline-block"
                style={{ breakInside: 'avoid' }}
              >
                <PostCard post={post} preview />
              </motion.div>
            ))}
          </motion.div>
        )
      )}
    
      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        initialMediaType={selectedMediaType}
        onPostCreated={fetchPosts}
      />
    </motion.div>
  );
};

export default Home;
