import api from './client';

// React to a post with LIKE or DISLIKE
// payload: { postId: number|string, userId: number|string, reactionType: 'LIKE'|'DISLIKE' }
export const reactToPost = async ({ postId, userId, reactionType }) => {
  if (!postId || !userId || !reactionType) {
    throw new Error('postId, userId and reactionType are required');
  }
  return api.post(
    '/postReactions/reactPost',
    {
      postId,
      userId,
      reactionType: String(reactionType).toUpperCase(),
    },
    {
      auth: true,
      attachUser: false,
      fallbackMessage: 'Failed to react to post',
    }
  );
};

export default { reactToPost };
