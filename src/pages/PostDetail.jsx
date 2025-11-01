import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ThumbsUp, Pencil, Trash2 } from "lucide-react";
import moment from "moment";
import { Button } from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EditPostModal from "../components/EditPostModal";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/Card";
import { setCurrentPost, toggleLike } from "../features/posts/postsSlice";
import { getPostById, deletePost } from "../api/posts";
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
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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
          // Convert API mediaType (TEXT/IMAGE/AUDIO/VIDEO) to UI format (Text/Image/Audio/Video)
          mediaType: postData.mediaType 
            ? postData.mediaType.charAt(0) + postData.mediaType.slice(1).toLowerCase() 
            : 'Text',
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

  const handleUpdate = () => {
    setShowEditModal(true);
  };

  const handlePostUpdated = () => {
    // Refresh the post data
    const fetchPost = async () => {
      try {
        const postData = await getPostById(postId);
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
          isLiked: false,
          mediaType: postData.mediaType,
        };
        dispatch(setCurrentPost(mappedPost));
      } catch (err) {
        console.error('Failed to refresh post:', err);
      }
    };
    fetchPost();
  };

  const handlePostDeleted = () => {
    // Navigate to home after deletion
    navigate('/');
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await deletePost(currentPost.id);
      console.log("Post deleted successfully");
      // Navigate to home after successful deletion
      navigate("/");
    } catch (err) {
      console.error("Failed to delete post:", err);
      setError(err.message);
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  // Check if update is allowed (within 10 minutes of creation)
  const isUpdateAllowed = () => {
    if (!currentPost) return false;
    const postTime = moment(currentPost.date);
    const now = moment();
    const minutesSincePost = now.diff(postTime, "minutes");
    return minutesSincePost <= 10;
  };

  // Check if user is the author
  const isAuthor = () => {
    if (!currentPost || !user) return false;
    return currentPost.author === user.username;
  };

  // Get time ago string or date
  const getTimeDisplay = () => {
    if (!currentPost) return "";
    const postTime = moment(currentPost.date);
    const now = moment();
    const hoursDiff = now.diff(postTime, "hours");
    
    // If less than 24 hours, show relative time
    if (hoursDiff < 24) {
      return postTime.fromNow();
    }
    
    // Otherwise show the formatted date
    return postTime.format("DD MMM, YYYY");
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
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-3xl">{currentPost.title}</CardTitle>
              <CardDescription>
                By {currentPost.author} • {getTimeDisplay()}
              </CardDescription>
            </div>
            
            {/* Action Buttons - Only show to author */}
            {isAuthenticated && isAuthor() && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleUpdate}
                  disabled={!isUpdateAllowed()}
                  className={`flex items-center gap-1 ${
                    !isUpdateAllowed()
                      ? "opacity-50 cursor-not-allowed"
                      : "text-blue-600 border-blue-300 hover:bg-blue-50"
                  }`}
                  title={
                    !isUpdateAllowed()
                      ? "Updates are only allowed within 10 minutes of posting"
                      : "Edit this post"
                  }
                >
                  <Pencil className="h-4 w-4" />
                  Update
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1 text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        confirmVariant="danger"
      />

      {/* Edit Post Modal */}
      <EditPostModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        post={currentPost}
        onPostUpdated={handlePostUpdated}
        onPostDeleted={handlePostDeleted}
      />
    </motion.div>
  );
};

export default PostDetail;
