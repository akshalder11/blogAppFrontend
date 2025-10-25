import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../components/PostCard';
import { fetchPostsStart, fetchPostsSuccess } from '../features/posts/postsSlice';

// Temporary mock data
const mockPosts = [
  {
    id: 1,
    title: 'Getting Started with React',
    author: 'John Doe',
    date: '2025-10-24',
    preview: 'Learn the basics of React and how to build your first application...',
    content: 'Full content will be available after login...',
    likes: 15,
    isLiked: false,
  },
  {
    id: 2,
    title: 'Advanced Redux Patterns',
    author: 'Jane Smith',
    date: '2025-10-23',
    preview: 'Discover advanced patterns and best practices for Redux...',
    content: 'Full content will be available after login...',
    likes: 23,
    isLiked: false,
  },
  // Add more mock posts as needed
];

const Home = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    const fetchPosts = async () => {
      dispatch(fetchPostsStart());
      try {
        // TODO: Replace with actual API call
        dispatch(fetchPostsSuccess(mockPosts));
      } catch (err) {
        dispatch(fetchPostsFailure(err.message));
      }
    };

    fetchPosts();
  }, [dispatch]);

  if (loading) {
    return <div className="text-center">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="py-8">
      <h1 className="mb-8 text-3xl font-bold">Latest Blog Posts</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div key={post.id}>
            <PostCard post={post} preview />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;