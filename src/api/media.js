import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Get auth token from localStorage
const getToken = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token || null;
  } catch {
    return null;
  }
};

// Upload media files (images, audio, video)
// Returns { mediaUrl: [array of uploaded file URLs] }
export const uploadMedia = async (files) => {
  if (!files || files.length === 0) {
    throw new Error('No files provided for upload');
  }

  const token = getToken();
  if (!token) {
    throw new Error('User not authenticated');
  }

  const formData = new FormData();
  
  // Append all files with the key "file"
  Array.from(files).forEach((file) => {
    formData.append('file', file);
  });

  try {
    const response = await axios.post(`${API_BASE_URL}/media/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = response.data;
    const originalUrls = Array.isArray(data?.mediaUrls) ? data.mediaUrls : [];
    // Build full URLs for previewing in UI, but keep originals for submission
    const fullMediaUrl = originalUrls.map(url => {
      if (url && !url.startsWith('http')) {
        const baseWithoutApi = API_BASE_URL.replace('/api', '');
        return `${baseWithoutApi}${url}`;
      }
      return url;
    });

    return { mediaUrl: originalUrls, fullMediaUrl };
  } catch (err) {
    const errorMessage = 
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      'Failed to upload media';
    
    // Show error toast
    toast.error(errorMessage);
    
    throw new Error(errorMessage);
  }
};

export default { uploadMedia };
