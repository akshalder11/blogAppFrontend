import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, Pencil, Trash2 } from "lucide-react";
import moment from "moment";
import Lottie from "lottie-react";
import { Button } from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EditPostModal from "../components/EditPostModal";
import Carousel from "../components/ui/Carousel";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/Card";
import { setCurrentPost, toggleLike, toggleDislike } from "../features/posts/postsSlice";
import { getPostById, deletePost } from "../api/posts";
import { reactToPost, removeReaction } from "../api/reactions";
import PostDetailSkeleton from "../components/ui/PostDetailSkeleton";
import warningAnimation from "../assets/animations/warning.json";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isReacting, setIsReacting] = useState(false);
  const [is403Error, setIs403Error] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setIs403Error(false);
      try {
        const postData = await getPostById(postId);
        // Map API data to frontend-friendly structure
        const baseWithoutApi = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || '';
        const pickDisplayUrl = (u) => {
          if (!u) return null;
          return u.startsWith('http') ? u : `${baseWithoutApi}${u}`;
        };
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
          isLiked: postData.hasLikedByCurrentUser || false,
          isDisliked: postData.hasDisLikedByCurrentUser || false,
          // Convert API mediaType (TEXT/IMAGE/AUDIO/VIDEO) to UI format (Text/Image/Audio/Video)
          mediaType: postData.mediaType 
            ? postData.mediaType.charAt(0) + postData.mediaType.slice(1).toLowerCase() 
            : 'Text',
          // Accept both string and array; convert all to full URLs for display
          mediaUrls: Array.isArray(postData.mediaUrls) 
            ? postData.mediaUrls.map(pickDisplayUrl).filter(Boolean)
            : (postData.mediaUrls ? [pickDisplayUrl(postData.mediaUrls)].filter(Boolean) : []),
        };
        dispatch(setCurrentPost(mappedPost));
      } catch (err) {
        // Check if it's a 403 error
        if (err.response && err.response.status === 403) {
          setIs403Error(true);
        }
        // Error already shown via toast
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, dispatch]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!currentPost || !user) return;
    
    // Store previous state for rollback
    const wasLiked = currentPost.isLiked;
    const wasDisliked = currentPost.isDisliked;
    
    try {
      
      // Optimistic UI update - update immediately
      dispatch(toggleLike(currentPost.id));
      
      // Run API in background
      setIsReacting(true);
      if (wasLiked) {
        await removeReaction({ postId: currentPost.id, userId: user.id });
      } else {
        await reactToPost({ postId: currentPost.id, userId: user.id, reactionType: 'LIKE' });
      }
      
      // API succeeded - keep the optimistic update
    } catch (e) {
      console.error('Failed to like post:', e);
      // Error already shown via toast
      
      // Rollback: revert to previous state
      if (wasLiked) {
        // Was liked, tried to remove, failed -> restore like
        dispatch(toggleLike(currentPost.id));
      } else if (wasDisliked) {
        // Was disliked, tried to like, failed -> restore dislike and remove like
        dispatch(toggleLike(currentPost.id)); // Remove the optimistic like
        dispatch(toggleDislike(currentPost.id)); // Restore the dislike
      } else {
        // Was neutral, tried to like, failed -> remove the optimistic like
        dispatch(toggleLike(currentPost.id));
      }
    } finally {
      setIsReacting(false);
    }
  };

  const handleDislike = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!currentPost || !user) return;
    
    // Store previous state for rollback
    const wasLiked = currentPost.isLiked;
    const wasDisliked = currentPost.isDisliked;
    
    try {
      
      // Optimistic UI update - update immediately
      dispatch(toggleDislike(currentPost.id));
      
      // Run API in background
      setIsReacting(true);
      if (wasDisliked) {
        await removeReaction({ postId: currentPost.id, userId: user.id });
      } else {
        await reactToPost({ postId: currentPost.id, userId: user.id, reactionType: 'DISLIKE' });
      }
      
      // API succeeded - keep the optimistic update
    } catch (e) {
      console.error('Failed to dislike post:', e);
      // Error already shown via toast
      
      // Rollback: revert to previous state
      if (wasDisliked) {
        // Was disliked, tried to remove, failed -> restore dislike
        dispatch(toggleDislike(currentPost.id));
      } else if (wasLiked) {
        // Was liked, tried to dislike, failed -> restore like and remove dislike
        dispatch(toggleDislike(currentPost.id)); // Remove the optimistic dislike
        dispatch(toggleLike(currentPost.id)); // Restore the like
      } else {
        // Was neutral, tried to dislike, failed -> remove the optimistic dislike
        dispatch(toggleDislike(currentPost.id));
      }
    } finally {
      setIsReacting(false);
    }
  };

  const handleUpdate = () => {
    setShowEditModal(true);
  };

  const handlePostUpdated = () => {
    // Refresh the post data
    const fetchPost = async () => {
      try {
        const postData = await getPostById(postId);
        const baseWithoutApi2 = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || '';
        const pickDisplayUrl2 = (u) => {
          if (!u) return null;
          return u.startsWith('http') ? u : `${baseWithoutApi2}${u}`;
        };
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
          isLiked: postData.hasLikedByCurrentUser || false,
          isDisliked: postData.hasDisLikedByCurrentUser || false,
          mediaType: postData.mediaType 
            ? postData.mediaType.charAt(0) + postData.mediaType.slice(1).toLowerCase() 
            : 'Text',
          mediaUrls: Array.isArray(postData.mediaUrls) 
            ? postData.mediaUrls.map(pickDisplayUrl2).filter(Boolean)
            : (postData.mediaUrls ? [pickDisplayUrl2(postData.mediaUrls)].filter(Boolean) : []),
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
    
    try {
      await deletePost(currentPost.id);
      console.log("Post deleted successfully");
      // Navigate to home after successful deletion
      navigate("/");
    } catch (err) {
      console.error("Failed to delete post:", err);
      // Error already shown via toast
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

  if (is403Error) {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-3xl py-8"
      >
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-64 h-64 mb-6">
              <Lottie 
                animationData={warningAnimation} 
                loop={true}
                autoplay={true}
              />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Login to check out the post
            </h2>
            <p className="text-gray-600 mb-6 max-w-md">
              You need to be logged in to view this content. Please sign in to continue.
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="px-6 py-2"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
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
            <div className="space-y-4">
              {/* Media Display - Show carousel when media exists */}
              {currentPost.mediaUrls && currentPost.mediaUrls.length > 0 && currentPost.mediaType !== 'Text' && (
                <div className="mb-6">
                  {currentPost.mediaType === 'Image' && (
                    <Carousel
                      items={currentPost.mediaUrls}
                      renderItem={(url) => (
                        <img
                          src={url}
                          alt={currentPost.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                          draggable={false}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EImage not found%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      )}
                      className="overflow-hidden rounded-lg"
                    />
                  )}
                  
                  {currentPost.mediaType === 'Audio' && currentPost.mediaUrls[0] && (
                    <div className="mb-6 overflow-hidden rounded-lg">
                      <audio
                        controls
                        preload="metadata"
                        className="w-full"
                        src={currentPost.mediaUrls[0]}
                        aria-label="Audio content"
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                  
                  {currentPost.mediaType === 'Video' && (
                    <Carousel
                      items={currentPost.mediaUrls}
                      renderItem={(url) => (
                        <video
                          controls
                          preload="metadata"
                          className="w-full h-full object-cover"
                          draggable={false}
                          src={url}
                          aria-label="Video content"
                        >
                          Your browser does not support the video element.
                        </video>
                      )}
                      className="overflow-hidden rounded-lg"
                    />
                  )}
                </div>
              )}
              
              {/* Post Content */}
              <div className="prose prose-blue max-w-none">
                {currentPost.content.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
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
        <CardFooter className="flex gap-2 justify-start items-center flex-wrap">
          <Button
            variant="ghost"
            onClick={handleLike}
            disabled={!isAuthenticated || isAuthor()}
            className={`${currentPost.isLiked ? "text-blue-600" : ""} hover:text-blue-600`}
          >
            <ThumbsUp className="mr-2 h-4 w-4" />
            {currentPost.likes} {currentPost.likes === 1 ? "Like" : "Likes"}
          </Button>
          <Button
            variant="ghost"
            onClick={handleDislike}
            disabled={!isAuthenticated || isAuthor()}
            className={`${currentPost.isDisliked ? "text-red-600" : ""} hover:text-red-600`}
          >
            <ThumbsDown className="mr-2 h-4 w-4" />
            {currentPost.dislikes} {currentPost.dislikes === 1 ? "Dislike" : "Dislikes"}
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
