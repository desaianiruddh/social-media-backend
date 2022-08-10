const gql = require('graphql-tag');

exports.typeDefs = gql`
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
  }
  type Post {
    id: ID!
    body: String!
    userName: String!
    createdAt: String!
    comments: [Comment]
    likes: [Like]
    likeCount: Int!
    commentCount: Int!
  }
  type Mutation {
    register(registerInput: RegisterInput!): User!
    login(userName: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }
  input RegisterInput {
    userName: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type User {
    id: ID!
    email: String!
    userName: String!
    createdAt: String!
    token: String!
  }
  type Comment {
    id: ID!
    userName: String!
    body: String!
    createdAt: String!
  }
  type Like {
    id: ID!
    userName: String!
    createdAt: String!
  }
  type Subscription {
    newPost: Post
  }
`;
