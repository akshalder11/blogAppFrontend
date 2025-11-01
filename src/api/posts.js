import api from './client';

export const getAllPosts = async () => {
  return api.get('/posts/allPost', { fallbackMessage: 'Failed to fetch posts' });
};


export const getPostById = async (postId) => {
  return api.post('/posts/getPost', { postId }, { auth: true, fallbackMessage: 'Failed to fetch post' });
};