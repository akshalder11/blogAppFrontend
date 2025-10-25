import { Link } from 'react-router-dom';
import { ThumbsUp } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { toggleLike } from '../features/posts/postsSlice';

const PostCard = ({ post, preview }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLike = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    dispatch(toggleLike(post.id));
  };

  return (
    <Link to={`/posts/${post.id}`}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>By {post.author}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 text-gray-600">
            {preview ? post.preview : post.content}
          </p>
        </CardContent>
        <CardFooter className="justify-between">
          <span className="text-sm text-gray-500">
            {new Date(post.date).toLocaleDateString()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={!isAuthenticated}
            className={post.isLiked ? 'text-blue-600' : ''}
          >
            <ThumbsUp className="mr-2 h-4 w-4" />
            {post.likes}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PostCard;