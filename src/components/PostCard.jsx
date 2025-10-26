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
            <CardTitle>{post.title}</CardTitle>
            <CardDescription>By {post.author}</CardDescription>
          </CardHeader>

          <CardContent className="flex-1">
            <p className="line-clamp-3 text-gray-600">
              {preview ? post.preview : post.content}
            </p>
          </CardContent>

          <CardFooter className="justify-between items-center">
            <span className="text-sm text-gray-500">
              {moment(post.createdAt).format("D MMM, YYYY")}
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
