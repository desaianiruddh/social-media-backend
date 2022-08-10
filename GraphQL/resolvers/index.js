const postsResolver = require('./post');
const usersResolver = require('./user');
const commentsResolver = require('./comments');

module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...usersResolver.Query,
    ...postsResolver.Query,
  },
  Mutation: {
    ...usersResolver.Mutation,
    ...postsResolver.Mutation,
    ...commentsResolver.Mutation,
  },
};
