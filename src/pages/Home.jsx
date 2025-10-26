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
  const { posts, loading, error } = useSelector((state) => state.posts);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      dispatch(fetchPostsStart());
      try {
        const data = await getAllPosts();

        const formattedPosts = data.map((post) => ({
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
        }));

        dispatch(fetchPostsSuccess(formattedPosts));
      } catch (err) {
        dispatch(fetchPostsFailure(err.message));
      }
    };

    fetchPosts();
  }, [dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".create-post-wrapper")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

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
        className="mb-8 flex items-center justify-between"
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
              className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 border border-gray-200 rounded-md bg-white shadow-sm hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
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
                        console.log(`Selected ${option.label} post`);
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
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {posts.map((post) => (
              <motion.div key={post.id} variants={cardVariants}>
                <PostCard post={post} preview />
              </motion.div>
            ))}
          </motion.div>
        )
      )}
    </motion.div>
  );
};

export default Home;
