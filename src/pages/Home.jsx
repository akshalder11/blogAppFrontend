import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import PageSkeleton from "../components/ui/PageSkeleton";
import PostCard from "../components/PostCard";
import {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
} from "../features/posts/postsSlice";

// Temporary mock data
const mockPosts = [
  {
    id: 1,
    title: "Getting Started with React",
    author: "John Doe",
    date: "2025-10-24",
    preview:
      "Learn the basics of React and how to build your first application...",
    content: "Full content will be available after login...",
    likes: 15,
    isLiked: false,
  },
  {
    id: 2,
    title: "Advanced Redux Patterns",
    author: "Jane Smith",
    date: "2025-10-23",
    preview: "Discover advanced patterns and best practices for Redux...",
    content: "Full content will be available after login...",
    likes: 23,
    isLiked: false,
  },
  // Add more mock posts as needed
];

// Motion variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const Home = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    const fetchPosts = async () => {
      dispatch(fetchPostsStart());
      try {
        // Simulate API delay
        await new Promise((res) => setTimeout(res, 500));
        dispatch(fetchPostsSuccess(mockPosts));
      } catch (err) {
        dispatch(fetchPostsFailure(err.message));
      }
    };
    fetchPosts();
  }, [dispatch]);

  // if (loading) {
  //   return <PageSkeleton />;
  // }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <motion.div
      className="py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Heading */}
      <motion.h1 className="mb-8 text-3xl font-bold" variants={headingVariants}>
        Latest Blog Posts
      </motion.h1>

      {/* Posts Grid */}
      {posts.length > 0 && (
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
      )}
    </motion.div>
  );
};

export default Home;
