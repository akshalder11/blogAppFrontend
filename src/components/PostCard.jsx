import { Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/Card";
import { Button } from "./ui/Button";
import moment from "moment";
import { motion } from "framer-motion";

const PostCard = ({ post, preview }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <motion.div
      whileHover={{ scale: 1.0 }}
      whileTap={{ scale: 1.0 }}
      className="block"
    >
      <Link to={`/posts/${post.id}`} className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col h-full">
          <CardHeader>
            <CardTitle className="truncate">{post.title}</CardTitle>
            <CardDescription>By {post.author}</CardDescription>
          </CardHeader>

          <CardContent className="flex-1">
            {/* Thumbnail for image posts: show only the first image */}
            {post.mediaType === 'Image' && post.mediaUrls && post.mediaUrls.length > 0 && (
              <div className="mb-4 overflow-hidden rounded-lg bg-gray-100 h-48">
                <img
                  src={post.mediaUrls[0]}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  draggable={false}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3ENo preview%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            )}
            <p className="line-clamp-3 text-gray-600">
              {preview ? post.preview : post.content}
            </p>
          </CardContent>

          <CardFooter className="justify-between items-center">
            <span className="text-sm text-gray-500">
              {moment(post.date).format("D MMM, YYYY")}
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={!isAuthenticated}
                className={`hover:bg-white ${
                  post.isLiked
                    ? "text-blue-600 hover:text-blue-600"
                    : "hover:text-gray-600"
                }`}
              >
                <ThumbsUp className="mr-1 h-4 w-4" />
                {post.likes}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                disabled={!isAuthenticated}
                className="text-gray-600 hover:bg-white hover:text-gray-600"
              >
                <ThumbsDown className="mr-1 h-4 w-4" />
                {post.dislikes}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
};

export default PostCard;
