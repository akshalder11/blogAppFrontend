import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ThumbsUp } from "lucide-react";
import moment from "moment";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/Card";
import { setCurrentPost, toggleLike } from "../features/posts/postsSlice";
import { getPostById } from "../api/posts";
import PostDetailSkeleton from "../components/ui/PostDetailSkeleton";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const postData = await getPostById(postId);
        // Map API data to frontend-friendly structure
        const mappedPost = {
          id: postData.id,
          title: postData.title,
          author: postData.user.username,
          date: postData.createdAt,
          preview:
            postData.content.length > 200
              ? postData.content.substring(0, 200) + "..."
              : postData.content,
          content: postData.content,
          likes: postData.likeCount,
          dislikes: postData.dislikeCount,
          isLiked: false, // you can adjust if you track likes per user
        };
        dispatch(setCurrentPost(mappedPost));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, dispatch]);

  const handleLike = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    dispatch(toggleLike(currentPost.id));
  };

  if (loading) {
    return <PostDetailSkeleton />;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  if (!currentPost) {
    return <div className="text-center py-8">Post not found</div>;
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
            By {currentPost.author} •{" "}
            {moment(currentPost.date).format("DD MMM, YYYY")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAuthenticated ? (
            <div className="prose prose-blue max-w-none">
              {currentPost.content.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <div>
              <p className="mb-4">{currentPost.preview}</p>
              <div className="rounded-md bg-blue-50 p-4">
                <p className="text-blue-700">
                  Please{" "}
                  <Button
                    variant="link"
                    className="p-0 text-blue-700 hover:text-blue-900"
                    onClick={() => navigate("/login")}
                  >
                    login
                  </Button>{" "}
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
            className={currentPost.isLiked ? "text-blue-600" : ""}
          >
            <ThumbsUp className="mr-2 h-4 w-4" />
            {currentPost.likes} {currentPost.likes === 1 ? "Like" : "Likes"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PostDetail;
