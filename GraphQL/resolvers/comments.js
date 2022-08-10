const { UserInputError, AuthenticationError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/checkAuth');

module.exports = {
  Mutation: {
    createComment: async (parent, { postId, body }, context) => {
      const { userName } = checkAuth(context);
      if (body.trim() === '') {
        throw new UserInputError('Comment body must not be empty', {
          errors: {
            body: 'Comment body must not be empty',
          },
        });
      }
      const post = await Post.findById(postId);
      if (post) {
        post.comments.unshift({
          body,
          userName,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else {
        throw new UserInputError('Post Not Found');
      }
    },
    deleteComment: async (parent, { postId, commentId }, context) => {
      const { userName } = checkAuth(context);
      const post = await Post.findById(postId);
      if (post) {
        const commentIndex = post.comments.findIndex(
          (comment) => comment.id === commentId
        );
        if (post.comments[commentIndex].userName === userName) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError('Action Not Allowed');
        }
      } else {
        throw new UserInputError('Post Not Found');
      }
    },
  },
};
