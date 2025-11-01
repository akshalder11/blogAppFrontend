import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TextAlignStart, Image, ListMusic, SquarePlay } from 'lucide-react';
import Modal from './ui/Modal';
import ConfirmDialog from './ui/ConfirmDialog';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { createPost } from '../api/posts';

const CreatePostModal = ({ isOpen, onClose, initialMediaType = 'Text', onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState(initialMediaType);
  const [showPostConfirm, setShowPostConfirm] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Keep internal mediaType in sync with the latest selection passed from parent
  // and only update when the modal becomes open, so it reflects the user's
  // dropdown choice each time they open the modal.
  useEffect(() => {
    if (isOpen) {
      setMediaType(initialMediaType);
    }
  }, [initialMediaType, isOpen]);
  const mediaTypes = [
    { label: 'Text', icon: <TextAlignStart className="w-4 h-4" /> },
    { label: 'Image', icon: <Image className="w-4 h-4" /> },
    { label: 'Audio', icon: <ListMusic className="w-4 h-4" /> },
    { label: 'Video', icon: <SquarePlay className="w-4 h-4" /> },
  ];

  const handlePost = () => {
    setError(null);
    setShowPostConfirm(true);
  };

  const handleConfirmPost = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await createPost({
        title: title.trim(),
        content: content.trim(),
        mediaType,
        mediaUrl: null, // Future enhancement for media uploads
      });
      
      console.log('Post created successfully:', response);
      setShowPostConfirm(false);
      resetForm();
      onClose();
      
      // Notify parent to refresh posts
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err) {
      console.error('Failed to create post:', err);
      setError(err.message);
      setShowPostConfirm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    setShowDiscardConfirm(true);
  };

  const handleConfirmDiscard = () => {
    setShowDiscardConfirm(false);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setMediaType(initialMediaType);
    setError(null);
    setIsSubmitting(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleDiscard} title="Create New Post" size="lg">
        <div className="p-6 space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="post-title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <Input
              id="post-title"
              type="text"
              placeholder="Enter post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label htmlFor="post-content" className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              id="post-content"
              placeholder="Write your post content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Media Type Button Group */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media Type
            </label>
            <div className="flex gap-2 flex-wrap">
              {mediaTypes.map((type) => (
                <motion.button
                  key={type.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMediaType(type.label)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer transition-all ${
                    mediaType === type.label
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {type.icon}
                  <span className="text-sm font-medium">{type.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleDiscard}
              className="px-6"
              disabled={isSubmitting}
            >
              Discard
            </Button>
            <Button
              onClick={handlePost}
              className="px-6 bg-blue-600 hover:bg-blue-700"
              disabled={!title.trim() || !content.trim() || isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Post Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showPostConfirm}
        onConfirm={handleConfirmPost}
        onCancel={() => setShowPostConfirm(false)}
        title="Confirm Post"
        message="Are you sure you want to publish this post? It will be visible to all users."
        confirmText="Publish"
        cancelText="Cancel"
      />

      {/* Discard Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDiscardConfirm}
        onConfirm={handleConfirmDiscard}
        onCancel={() => setShowDiscardConfirm(false)}
        title="Discard Post"
        message="Are you sure you want to discard this post? All your changes will be lost."
        confirmText="Discard"
        cancelText="Keep Editing"
        confirmVariant="danger"
      />
    </>
  );
};

export default CreatePostModal;
