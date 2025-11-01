import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    fetchPostsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPostsSuccess: (state, action) => {
      state.loading = false;
      state.posts = action.payload;
      state.error = null;
    },
    fetchPostsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    toggleLike: (state, action) => {
      const postId = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        // If currently disliked, remove dislike first
        if (post.isDisliked) {
          post.isDisliked = false;
          post.dislikes = post.dislikes - 1;
        }
        // Toggle like
        post.isLiked = !post.isLiked;
        post.likes = post.isLiked ? post.likes + 1 : post.likes - 1;
      }
      if (state.currentPost?.id === postId) {
        // If currently disliked, remove dislike first
        if (state.currentPost.isDisliked) {
          state.currentPost.isDisliked = false;
          state.currentPost.dislikes = state.currentPost.dislikes - 1;
        }
        // Toggle like
        state.currentPost.isLiked = !state.currentPost.isLiked;
        state.currentPost.likes = state.currentPost.isLiked
          ? state.currentPost.likes + 1
          : state.currentPost.likes - 1;
      }
    },
    toggleDislike: (state, action) => {
      const postId = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        // If currently liked, remove like first
        if (post.isLiked) {
          post.isLiked = false;
          post.likes = post.likes - 1;
        }
        // Toggle dislike
        post.isDisliked = !post.isDisliked;
        post.dislikes = post.isDisliked ? post.dislikes + 1 : post.dislikes - 1;
      }
      if (state.currentPost?.id === postId) {
        // If currently liked, remove like first
        if (state.currentPost.isLiked) {
          state.currentPost.isLiked = false;
          state.currentPost.likes = state.currentPost.likes - 1;
        }
        // Toggle dislike
        state.currentPost.isDisliked = !state.currentPost.isDisliked;
        state.currentPost.dislikes = state.currentPost.isDisliked
          ? state.currentPost.dislikes + 1
          : state.currentPost.dislikes - 1;
      }
    },
  },
});

export const {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
  setCurrentPost,
  toggleLike,
  toggleDislike,
} = postsSlice.actions;

export default postsSlice.reducer;