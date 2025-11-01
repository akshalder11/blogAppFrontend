import api from './client';

export const getAllPosts = async () => {
  return api.get('/posts/allPost', { fallbackMessage: 'Failed to fetch posts' });
};


export const getPostById = async (postId) => {
  return api.post('/posts/getPost', { postId }, { auth: true, attachUser: false, fallbackMessage: 'Failed to fetch post' });
};

export const createPost = async ({ title, content, mediaType, mediaUrl = null }) => {
  return api.post('/posts/createPost', { 
    title, 
    content, 
    mediaType: mediaType.toUpperCase(), 
    mediaUrl,
  }, { 
    auth: true,
    attachUser: true,
    fallbackMessage: 'Failed to create post' 
  });
};