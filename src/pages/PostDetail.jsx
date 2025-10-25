import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ThumbsUp } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { setCurrentPost, toggleLike } from '../features/posts/postsSlice';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const PostDetail = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPost } = useSelector((state) => state.posts);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // TODO: Replace with actual API call
    // For now, using mock data
    const mockPost = {
      id: parseInt(postId),
      title: 'Getting Started with React',
      author: 'John Doe',
      date: '2025-10-24',
      preview: 'Learn the basics of React and how to build your first application...',
      content: `This is the full content of the blog post. It will only be visible to logged-in users.

React is a powerful JavaScript library for building user interfaces. Let's explore how to get started with React and build your first application.

1. Setting up your development environment
First, you'll need Node.js installed on your computer. Then you can create a new React project using Create React App:

\`\`\`bash
npx create-react-app my-app
cd my-app
npm start
\`\`\`

2. Understanding Components
React is all about components. Components are reusable pieces of UI that can contain both markup and logic...

(Continue reading by logging in)`,
      likes: 15,
      isLiked: false,
    };

    dispatch(setCurrentPost(mockPost));
  }, [postId, dispatch]);

  const handleLike = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(toggleLike(currentPost.id));
  };

  if (!currentPost) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-3xl py-8"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{currentPost.title}</CardTitle>
          <CardDescription>
            By {currentPost.author} • {new Date(currentPost.date).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAuthenticated ? (
            <div className="prose prose-indigo max-w-none">
              {currentPost.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <div>
              <p className="mb-4">{currentPost.preview}</p>
              <div className="rounded-md bg-indigo-50 p-4">
                <p className="text-indigo-700">
                  Please{' '}
                  <Button
                    variant="link"
                    className="p-0 text-indigo-700 hover:text-indigo-900"
                    onClick={() => navigate('/login')}
                  >
                    login
                  </Button>{' '}
                  to read the full post.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="ghost"
            onClick={handleLike}
            disabled={!isAuthenticated}
            className={currentPost.isLiked ? 'text-blue-600' : ''}
          >
            <ThumbsUp className="mr-2 h-4 w-4" />
            {currentPost.likes} {currentPost.likes === 1 ? 'Like' : 'Likes'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PostDetail;