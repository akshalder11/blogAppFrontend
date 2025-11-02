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

// Remove reaction from a post
// payload: { postId: number|string, userId: number|string }
export const removeReaction = async ({ postId, userId }) => {
  if (!postId || !userId) {
    throw new Error('postId and userId are required');
  }
  return api.delete(
    '/postReactions/removeReactPost',
    {
      data: { postId, userId },
      auth: true,
      attachUser: false,
      fallbackMessage: 'Failed to remove reaction',
    }
  );
};

export default { reactToPost, removeReaction };
