import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TextAlignStart, Image, ListMusic, SquarePlay } from 'lucide-react';
import Modal from './ui/Modal';
import ConfirmDialog from './ui/ConfirmDialog';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { updatePost } from '../api/posts';

const EditPostModal = ({ isOpen, onClose, post, onPostUpdated, onPostDeleted }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState('Text');
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Store original values to detect changes
  const [originalValues, setOriginalValues] = useState({
    title: '',
    content: '',
    mediaType: 'Text',
  });

  // Initialize form with post data when modal opens
  useEffect(() => {
    if (isOpen && post) {
      setTitle(post.title || '');
      setContent(post.content || '');
      setMediaType(post.mediaType || 'Text');
      setOriginalValues({
        title: post.title || '',
        content: post.content || '',
        mediaType: post.mediaType || 'Text',
      });
      setError(null);
    }
  }, [isOpen, post]);

  // Sync mediaType when post changes to prevent selection disappearing
  useEffect(() => {
    if (post?.mediaType) {
      // Ensure mediaType matches our button labels (Text/Image/Audio/Video)
      const normalizedMediaType = post.mediaType.charAt(0).toUpperCase() + post.mediaType.slice(1).toLowerCase();
      setMediaType(normalizedMediaType);
    }
  }, [post?.mediaType]);

  const mediaTypes = [
    { label: 'Text', icon: <TextAlignStart className="w-4 h-4" /> },
    { label: 'Image', icon: <Image className="w-4 h-4" /> },
    { label: 'Audio', icon: <ListMusic className="w-4 h-4" /> },
    { label: 'Video', icon: <SquarePlay className="w-4 h-4" /> },
  ];

  // Check if form has been modified
  const hasChanges = () => {
    return (
      title.trim() !== originalValues.title ||
      content.trim() !== originalValues.content ||
      mediaType !== originalValues.mediaType
    );
  };

  const handleSave = () => {
    setError(null);
    setShowSaveConfirm(true);
  };

  const handleConfirmSave = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await updatePost({
        postId: post.id,
        title: title.trim(),
        content: content.trim(),
        mediaType,
        mediaUrl: null,
      });
      
      console.log('Post updated successfully:', response);
      setShowSaveConfirm(false);
      onClose();
      
      // Notify parent to refresh post
      if (onPostUpdated) {
        onPostUpdated();
      }
    } catch (err) {
      console.error('Failed to update post:', err);
      setError(err.message);
      setShowSaveConfirm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    setError(null);
    setShowDiscardConfirm(true);
  };

  const handleConfirmDiscard = () => {
    setShowDiscardConfirm(false);
    onClose();
  };

  const handleCancel = () => {
    if (hasChanges()) {
      // Could add a "unsaved changes" warning here if desired
      onClose();
    } else {
      onClose();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleCancel} title="Edit Post" size="lg">
        <div className="p-6 space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="edit-post-title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <Input
              id="edit-post-title"
              type="text"
              placeholder="Enter post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label htmlFor="edit-post-content" className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              id="edit-post-content"
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-all ${
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
              onClick={handleSave}
              className="px-6 bg-blue-600 hover:bg-blue-700"
              disabled={!title.trim() || !content.trim() || !hasChanges() || isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Save Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showSaveConfirm}
        onConfirm={handleConfirmSave}
        onCancel={() => setShowSaveConfirm(false)}
        title="Save Changes"
        message="Are you sure you want to save these changes to your post?"
        confirmText="Save"
        cancelText="Cancel"
      />

      {/* Discard Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDiscardConfirm}
        onConfirm={handleConfirmDiscard}
        onCancel={() => setShowDiscardConfirm(false)}
        title="Discard Changes"
        message="Are you sure you want to discard your changes? Any unsaved modifications will be lost."
        confirmText="Discard"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </>
  );
};

export default EditPostModal;
