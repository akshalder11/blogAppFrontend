import api from './client';

export const getAllPosts = async () => {
  return api.get('/posts/allPost', { fallbackMessage: 'Failed to fetch posts' });
};


// Helper to read logged-in user id from localStorage
const getUserIdFromStorage = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.id || null;
  } catch (e) {
    return null;
  }
};

export const getPostById = async (postId) => {
  const userId = getUserIdFromStorage();
  const payload = userId ? { postId, userId } : { postId };
  return api.post('/posts/getPost', payload, { auth: true, attachUser: false, fallbackMessage: 'Failed to fetch post' });
};

export const createPost = async ({ title, content, mediaType, mediaUrl = null }) => {
  return api.post('/posts/createPost', { 
    title, 
    content, 
    mediaType: mediaType.toUpperCase(), 
    mediaUrls: mediaUrl,
  }, { 
    auth: true,
    attachUser: true,
    fallbackMessage: 'Failed to create post' 
  });
};

export const updatePost = async ({ postId, title, content, mediaType, mediaUrl = null }) => {
  return api.put('/posts/updatePost', { 
    postId,
    title, 
    content, 
    mediaType: mediaType.toUpperCase(), 
    mediaUrls: mediaUrl,
  }, { 
    auth: true,
    attachUser: false,
    fallbackMessage: 'Failed to update post' 
  });
};

export const deletePost = async (postId) => {
  return api.delete('/posts/deletePost', { 
    data: { postId },
    auth: true, 
    attachUser: false,
    fallbackMessage: 'Failed to delete post' 
  });
};