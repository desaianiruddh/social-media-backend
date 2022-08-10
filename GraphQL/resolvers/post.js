const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/checkAuth');

module.exports = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    getPost: async (parent, { postId }) => {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error('Post Not Found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    createPost: async (parent, { body }, context) => {
      const user = checkAuth(context);
      if (body.trim() === '') {
        throw new Error('Post body must not be empty');
      }
      const newPost = new Post({
        body,
        user: user.id,
        userName: user.userName,
        createdAt: new Date().toISOString(),
      });
      const post = await newPost.save();
      return post;
    },
    deletePost: async (parent, { postId }, context) => {
      const user = checkAuth(context);
      try {
        const post = await Post.findById(postId);
        if (user.userName === post.userName) {
          await post.delete();
          return 'Post Deleted Successfully';
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    likePost: async (parent, { postId }, context) => {
      const { userName } = checkAuth(context);
      const post = await Post.findById(postId);
      if (post) {
        //if already liked then remove like
        if (post.likes.find((like) => like.userName === userName)) {
          post.likes = post.likes.filter((like) => like.userName !== userName);
        } else {
          post.likes.push({
            userName,
            createdAt: new Date().toISOString(),
          });
        }
        await post.save();
        return post;
      } else throw new UserInputError('Post Not Found');
    },
  },
};
