import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Link as LinkIcon, X, Loader2 } from 'lucide-react';
import Modal from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { uploadMedia } from '../api/media';

const MediaUploadModal = ({ isOpen, onClose, onMediaSelected, mediaType = 'Image' }) => {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'url'
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [mediaUrl, setMediaUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // (Removed file size checks and client-side compression per request)

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      return;
    }

    setIsUploading(true);

    try {
      const response = await uploadMedia(selectedFiles);
      // Response: { mediaUrl: [relative URLs], fullMediaUrl: [absolute URLs incl. base + /api] }
      const uploadedRelativeUrls = response.mediaUrl;
      const uploadedFullUrls = response.fullMediaUrl || uploadedRelativeUrls;
      
      if (uploadedRelativeUrls && uploadedRelativeUrls.length > 0) {
        // Pass both a display URL (first full URL) and the original array for submission
        onMediaSelected({
          url: uploadedFullUrls[0],
          urls: uploadedFullUrls,
          filenames: selectedFiles.map(f => f.name)
        });
        handleClose();
      } else {
        // Error will be shown via toast from API
      }
    } catch (err) {
      // Error already shown via toast
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (!mediaUrl.trim()) {
      return;
    }

    // Basic URL validation
    try {
      new URL(mediaUrl);
      onMediaSelected({ url: mediaUrl.trim(), urls: [mediaUrl.trim()], filenames: [] });
      handleClose();
    } catch {
      // Invalid URL - will show via toast
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setMediaUrl('');
    setActiveTab('upload');
    onClose();
  };

  const getAcceptedFileTypes = () => {
    switch (mediaType) {
      case 'Image':
        return 'image/*';
      case 'Audio':
        return 'audio/*';
      case 'Video':
        return 'video/*';
      default:
        return '*/*';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Upload {mediaType}</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'upload'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Upload className="inline h-4 w-4 mr-2" />
            Upload from System
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'url'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LinkIcon className="inline h-4 w-4 mr-2" />
            Enter URL
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'upload' ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* File Input */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="media-upload"
                  accept={getAcceptedFileTypes()}
                  onChange={handleFileSelect}
                  multiple
                  className="hidden"
                />
                <label
                  htmlFor="media-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    {mediaType} files (Multiple files supported)
                  </p>
                </label>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Selected Files ({selectedFiles.length}):
                  </p>
                  <ul className="space-y-1">
                    {selectedFiles.map((file, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        • {file.name} ({(file.size / 1024).toFixed(2)} KB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || isUploading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload'
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="url"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* URL Input */}
              <div>
                <label htmlFor="media-url" className="block text-sm font-medium text-gray-700 mb-2">
                  {mediaType} URL
                </label>
                <Input
                  id="media-url"
                  type="url"
                  placeholder={`https://example.com/${mediaType.toLowerCase()}.jpg`}
                  value={mediaUrl}
                  onChange={(e) => {
                    setMediaUrl(e.target.value);
                  }}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a direct URL to the {mediaType.toLowerCase()} file
                </p>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleUrlSubmit}
                disabled={!mediaUrl.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Use URL
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
};

export default MediaUploadModal;
