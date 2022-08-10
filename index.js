const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const { typeDefs } = require('./GraphQL/schema');
const { MONGO_URL } = require('./config');
const resolvers = require('./GraphQL/resolvers/index');

const PORT = process.env.PORT || 4000;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});
mongoose
  .connect(MONGO_URL, { useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB Connected');
    return server.listen({ port: PORT });
  })
  .then(({ url }) => {
    console.log('server is ready at', url);
  })
  .catch((err) => {
    console.error(err);
  });
